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
				setAll() {},
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

		if (sessionError || !session) {
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
			console.error('Ошибка парсинга JSON:', e)
			return NextResponse.json(
				{ error: { message: 'Некорректный формат запроса.' } },
				{ status: 400 }
			)
		}

		const { draft_id, document_id } = body
		if (!draft_id || !document_id) {
			return NextResponse.json(
				{ error: { message: 'draft_id и document_id обязательны.' } },
				{ status: 400 }
			)
		}

		const { data: document, error: docError } = await supabase
			.from('documents')
			.select('*')
			.eq('id', document_id)
			.eq('user_id', user.id)
			.single()
		if (docError || !document) {
			return NextResponse.json(
				{ error: { message: 'Документ не найден или нет доступа.' } },
				{ status: 404 }
			)
		}

		const { data: draft, error: draftError } = await supabase
			.from('reply_drafts')
			.select('*')
			.eq('id', draft_id)
			.eq('document_id', document_id)
			.single()
		if (draftError || !draft) {
			return NextResponse.json(
				{ error: { message: 'Черновик не найден.' } },
				{ status: 404 }
			)
		}

		const { error: updateDocError } = await supabase
			.from('documents')
			.update({
				status: 'pending_final_reply',
				current_reply_draft_id: draft.id,
				final_reply_text: draft.draft_text_russian || null,
			})
			.eq('id', document_id)
		if (updateDocError) {
			return NextResponse.json(
				{
					error: {
						message: 'Ошибка обновления документа.',
						details: updateDocError.message,
					},
				},
				{ status: 500 }
			)
		}

		await supabase
			.from('reply_drafts')
			.update({ is_source_for_final_reply: true })
			.eq('id', draft.id)

		// ---- ВЫЗЫВАЕМ АВТОМАТИЗАЦИЮ (n8n) ----
		const n8nWebhookUrl = process.env.NEXT_N8N_FINALIZE_WEBHOOK_URL
		if (n8nWebhookUrl) {
			try {
				await fetch(n8nWebhookUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						document_id,

						// Можно добавить другие поля, если нужны автоматизации
					}),
				})
			} catch (err) {
				console.error('Ошибка вызова n8n финализации:', err)
				// Можно не останавливать цепочку — автоматизация может быть перезапущена отдельно
			}
		}
		// ---------------------------------------

		const { data: updatedDocument } = await supabase
			.from('documents')
			.select('*')
			.eq('id', document_id)
			.single()
		const { data: updatedDraft } = await supabase
			.from('reply_drafts')
			.select('*')
			.eq('id', draft.id)
			.single()

		return NextResponse.json(
			{
				data: {
					document: updatedDocument,
					draft: updatedDraft,
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('API finalize error:', error)
		return NextResponse.json(
			{ error: { message: 'Внутренняя ошибка сервера.' } },
			{ status: 500 }
		)
	}
}
