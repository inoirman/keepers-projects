// keepers-projects/packages/types/index.ts

export interface Document {
	id: string // UUID
	user_id: string // UUID, references auth.users(id)
	parent_doc_id?: string | null // UUID, references public.documents(id)

	title?: string | null
	original_text: string
	original_language?: string | null // e.g., 'en', 'de'

	analysis_summary?: string | null
	analysis_detailed?: string | null // ИЗМЕНЕНО: теперь это string | null
	analysis_recommendations?: string[] | null // Если это массив строк

	current_reply_draft_id?: string | null // UUID, references reply_drafts.id
	final_reply_text?: string | null

	status: string // 'new', 'pending_analysis', 'analysis_completed', 'pending_draft', 'draft_completed', 'pending_final_reply', 'reply_completed', 'error'

	retry_count: number
	last_attempt_at?: string | null // TIMESTAMPTZ as string

	created_at: string // TIMESTAMPTZ as string
	updated_at: string // TIMESTAMPTZ as string
}

export interface ReplyDraft {
	id: string // UUID
	document_id: string // UUID, references public.documents(id)
	user_id: string // UUID, references auth.users(id)

	user_idea_for_reply?: string | null
	draft_text_russian?: string | null
	user_edit_suggestions?: string | null
	iteration_number: number

	is_source_for_final_reply: boolean

	created_at: string // TIMESTAMPTZ as string
	updated_at: string // TIMESTAMPTZ as string
}

// Вы можете добавить сюда другие общие типы по мере необходимости
