// apps/postmaster-ai/src/app/api/documents/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr' // Используем createServerClient
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

// Вспомогательная функция должна стать асинхронной, если cookies() асинхронна
async function createSupabaseServerClientOnRoute() {
	// <--- async здесь
	const cookieStore = await cookies() // <--- await здесь, раз cookies() возвращает Promise

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				// getAll теперь вызывается на объекте cookieStore, который уже разрешен из Promise
				getAll() {
					return cookieStore.getAll()
				},
				setAll(
					cookiesToSet: {
						name: string
						value: string
						options: CookieOptions
					}[]
				) {
					cookiesToSet.forEach(({ name, value, options }) => {
						try {
							// cookieStore.set(name, value, options); // По-прежнему вызовет ошибку, т.к. ReadonlyRequestCookies read-only
							console.warn(
								`(Supabase server client on Route Handler) Attempted to set cookie '${name}' using setAll. ` +
									`This will not modify the response cookies directly in a Route Handler.`
							)
							console.log(`Some info about cookie: ${name} ${value} ${options}`)
						} catch (error) {
							console.error(
								`(Supabase server client on Route Handler) Error setting cookie '${name}':`,
								error
							)
						}
					})
				},
			},
		}
	)
}

export async function POST(request: NextRequest) {
	const supabase = await createSupabaseServerClientOnRoute()

	try {
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession()

		if (sessionError) {
			console.error('API: Session Error:', sessionError.message)
			return NextResponse.json(
				{
					error: {
						message: sessionError.message || 'Ошибка при получении сессии.',
					},
				},
				{ status: 500 }
			)
		}

		if (!session) {
			console.warn('API: No active session found for POST /api/documents.')
			return NextResponse.json(
				{ error: { message: 'Не авторизован. Активная сессия отсутствует.' } },
				{ status: 401 }
			)
		}
		const user = session.user

		let body
		try {
			body = await request.json()
		} catch (e) {
			return NextResponse.json(
				{
					error: {
						message: 'Некорректный формат запроса (ожидается JSON). ',
						details: e,
					},
				},
				{ status: 400 }
			)
		}

		const { title, original_text } = body

		if (
			!original_text ||
			typeof original_text !== 'string' ||
			original_text.trim() === ''
		) {
			return NextResponse.json(
				{
					error: {
						message: 'Текст документа обязателен и не может быть пустым.',
					},
				},
				{ status: 400 }
			)
		}

		const { data: newDocument, error: dbError } = await supabase
			.from('documents')
			.insert({
				user_id: user.id,
				title: title && typeof title === 'string' ? title.trim() : null,
				original_text: original_text,
				status: 'pending_analysis',
			})
			.select()
			.single()

		if (dbError) {
			console.error('API: DB Error creating document:', dbError)
			const statusCode = 500
			const errorMessage = dbError.message || 'Ошибка при сохранении документа.'
			// ... (обработка кодов ошибок БД)
			return NextResponse.json(
				{ error: { message: errorMessage, details: dbError.details } },
				{ status: statusCode }
			)
		}

		if (!newDocument || !newDocument.id) {
			console.error('API: No document created or missing ID:', newDocument)
			return NextResponse.json(
				{
					error: {
						message: 'Не удалось создать документ. Попробуйте позже.',
					},
				},
				{ status: 500 }
			)
		}

		// --->>> ШАГ ВЫЗОВА N8N <<<---
		const n8nWebhookUrl = process.env.NEXT_N8N_ANALYZE_WEBHOOK_URL // Получаем URL из переменных окружения

		if (n8nWebhookUrl) {
			try {
				// Отправляем запрос в n8n асинхронно (не ждем ответа от n8n здесь)
				// n8n должен будет сам обновить статус документа в БД после обработки
				fetch(n8nWebhookUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						document_id: newDocument.id,
						action: 'analyze_text', // Указываем, какое действие должен выполнить n8n
						// Можно передать и другие данные, если n8n не будет их сам брать из БД
						// например, user_id: user.id, original_text: newDocument.original_text (если n8n не хочет делать лишний запрос к БД)
					}),
				}).catch(n8nError => {
					// Логируем ошибку вызова n8n, но не блокируем ответ клиенту,
					// так как документ уже сохранен. Система перезапуска n8n должна будет это подхватить.
					console.error(
						`API: Failed to trigger n8n webhook for document ${newDocument.id}:`,
						n8nError
					)
					// Можно обновить статус документа в БД на 'n8n_trigger_failed', если нужно
				})
				console.log(
					`API: N8N webhook triggered for document ${newDocument.id} with action 'analyze_text'.`
				)
			} catch (error) {
				// Этот catch маловероятен для fetch без await, но на всякий случай
				console.error(
					`API: Unexpected error triggering n8n for document ${newDocument.id}:`,
					error
				)
			}
		} else {
			console.warn(
				'API: N8N_ANALYZE_WEBHOOK_URL is not defined. Skipping n8n trigger.'
			)
			// Если URL n8n не задан, можно обновить статус на что-то вроде 'analysis_skipped_no_webhook'
			// или оставить 'pending_analysis' и надеяться на ручной запуск.
			// Для MVP можно считать, что если нет URL, то анализ не запустится.
		}
		// --->>> КОНЕЦ ШАГА ВЫЗОВА N8N <<<---

		return NextResponse.json(
			{
				message: 'Документ успешно создан и поставлен в очередь на анализ.',
				data: newDocument,
			},
			{ status: 201 }
		)
	} catch (error: unknown) {
		console.error('API: General Error in POST /api/documents:', error)
		let errorMessage = 'Внутренняя ошибка сервера.'
		if (error instanceof Error) {
			errorMessage = error.message
		} else if (
			typeof error === 'object' &&
			error !== null &&
			'message' in error &&
			typeof (error as { message: unknown }).message === 'string'
		) {
			errorMessage = (error as { message: string }).message
		}
		return NextResponse.json(
			{ error: { message: errorMessage } },
			{ status: 500 }
		)
	}
}
