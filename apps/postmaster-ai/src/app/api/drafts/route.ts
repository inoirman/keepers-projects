import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

async function createSupabaseServerClientOnRoute() {
	const cookieStore = await cookies()
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					// Как и раньше — только log
					cookiesToSet.forEach(({ name, value, options }) => {
						try {
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
			return NextResponse.json(
				{ error: { message: sessionError.message } },
				{ status: 500 }
			)
		}
		if (!session) {
			return NextResponse.json(
				{ error: { message: 'Не авторизован' } },
				{ status: 401 }
			)
		}
		const user = session.user

		let body
		try {
			body = await request.json()
		} catch (e) {
			console.error(e)
			return NextResponse.json(
				{ error: { message: 'Некорректный формат запроса.' } },
				{ status: 400 }
			)
		}

		const { document_id, user_idea_for_reply } = body
		if (!document_id || !user_idea_for_reply) {
			return NextResponse.json(
				{
					error: { message: 'document_id и user_idea_for_reply обязательны.' },
				},
				{ status: 400 }
			)
		}

		// Найдём максимальный iteration_number
		const { data: drafts, error: draftsError } = await supabase
			.from('reply_drafts')
			.select('iteration_number')
			.eq('document_id', document_id)

		if (draftsError) {
			return NextResponse.json(
				{ error: { message: draftsError.message } },
				{ status: 500 }
			)
		}
		const maxIter =
			drafts && drafts.length > 0
				? Math.max(...drafts.map(d => d.iteration_number))
				: 0
		const nextIter = maxIter + 1

		// 1. Создаём черновик
		const { data: newDraft, error: draftError } = await supabase
			.from('reply_drafts')
			.insert([
				{
					document_id,
					user_id: user.id,
					user_idea_for_reply,
					iteration_number: nextIter,
					is_source_for_final_reply: false,
				},
			])
			.select('*')
			.single()

		if (draftError) {
			return NextResponse.json(
				{ error: { message: draftError.message } },
				{ status: 500 }
			)
		}

		// 2. Обновляем документ
		const { error: docError } = await supabase
			.from('documents')
			.update({
				status: 'pending_draft',
				current_reply_draft_id: newDraft.id,
			})
			.eq('id', document_id)

		if (docError) {
			return NextResponse.json(
				{ error: { message: docError.message } },
				{ status: 500 }
			)
		}

		// 3. Вызов n8n webhook
		const n8nWebhookUrl = process.env.NEXT_N8N_ANALYZE_WEBHOOK_URL
		if (n8nWebhookUrl) {
			fetch(n8nWebhookUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					document_id,
				}),
			}).catch(n8nError => {
				console.error(
					`API: Failed to trigger n8n webhook for draft ${newDraft.id}:`,
					n8nError
				)
			})
		}

		return NextResponse.json(
			{ message: 'Черновик создан и обработка запущена.', data: newDraft },
			{ status: 201 }
		)
	} catch (error: unknown) {
		let errorMessage = 'Внутренняя ошибка сервера.'
		if (error instanceof Error) errorMessage = error.message
		return NextResponse.json(
			{ error: { message: errorMessage } },
			{ status: 500 }
		)
	}
}
