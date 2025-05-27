import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

// Создание Supabase-клиента с куки для SSR/Route
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
					// Не нужен для route handler, но оставим для лога/debug
					cookiesToSet.forEach(({ name, value, options }) => {
						console.warn(
							`(Supabase server client on Route Handler) set cookie: ${name}`,
							{ value, options }
						)
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
				{ error: { message: 'Не авторизован.' } },
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

		const { document_id, draft_id } = body
		if (!document_id || !draft_id) {
			return NextResponse.json(
				{
					error: { message: 'document_id и draft_id обязательны.' },
				},
				{ status: 400 }
			)
		}

		// Проверяем, что документ реально принадлежит пользователю (RLS может быть, но лучше явная защита)
		const { data: doc, error: docError } = await supabase
			.from('documents')
			.select('user_id')
			.eq('id', document_id)
			.single()
		if (docError) {
			return NextResponse.json(
				{ error: { message: docError.message } },
				{ status: 404 }
			)
		}
		if (doc.user_id !== user.id) {
			return NextResponse.json(
				{ error: { message: 'Нет доступа к документу.' } },
				{ status: 403 }
			)
		}

		// Обновляем только current_reply_draft_id
		const { error: updateError } = await supabase
			.from('documents')
			.update({ current_reply_draft_id: draft_id })
			.eq('id', document_id)

		if (updateError) {
			return NextResponse.json(
				{ error: { message: updateError.message } },
				{ status: 500 }
			)
		}

		return NextResponse.json({ success: true }, { status: 200 })
	} catch (error: unknown) {
		let errorMessage = 'Внутренняя ошибка сервера.'
		if (error instanceof Error) errorMessage = error.message
		return NextResponse.json(
			{ error: { message: errorMessage } },
			{ status: 500 }
		)
	}
}
