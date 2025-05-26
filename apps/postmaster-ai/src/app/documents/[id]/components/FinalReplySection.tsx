// apps/postmaster-ai/src/app/documents/[id]/components/FinalReplySection.tsx
import type { Document, ReplyDraft } from '@service-suite/types'
import { useEffect, useState } from 'react'

interface FinalReplySectionProps {
	document: Document | null
	drafts: ReplyDraft[] // Для получения текста из финального черновика, если final_reply_text еще нет
	onCopyToClipboard: (text: string) => void
}

const LoadingSpinner = () => (
	<svg
		className='w-6 h-6 animate-spin text-primary'
		fill='none'
		viewBox='0 0 24 24'
	>
		<circle
			className='opacity-25'
			cx='12'
			cy='12'
			r='10'
			stroke='currentColor'
			strokeWidth='4'
		></circle>
		<path
			className='opacity-75'
			fill='currentColor'
			d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
		></path>
	</svg>
)

export function FinalReplySection({
	document,
	drafts,
	onCopyToClipboard,
}: FinalReplySectionProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [editableFinalReply, setEditableFinalReply] = useState('')

	useEffect(() => {
		const sourceDraft = drafts.find(d => d.is_source_for_final_reply)
		const textToDisplay =
			document?.final_reply_text || sourceDraft?.draft_text_russian || ''
		setEditableFinalReply(textToDisplay)
		setIsEditing(false) // Сбрасываем редактирование при изменении документа/черновиков
	}, [document, drafts])

	if (!document) return null

	if (document.status === 'pending_final_reply') {
		const sourceDraft = drafts.find(
			d => d.id === document.current_reply_draft_id
		)
		return (
			<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg text-center'>
				<LoadingSpinner />
				<h2 className='text-lg font-semibold text-primary mt-4 mb-2'>
					Формируется итоговое письмо...
				</h2>
				{sourceDraft && (
					<div className='w-full max-w-2xl mx-auto bg-background border border-border rounded p-4 mb-2 text-left'>
						<div className='text-sm text-text-muted mb-1'>
							На основе черновика (Итерация {sourceDraft.iteration_number}):
						</div>
						<div className='prose prose-sm max-w-none whitespace-pre-wrap'>
							{sourceDraft.draft_text_russian || (
								<span className='italic text-text-muted'>
									Текст черновика не загружен
								</span>
							)}
						</div>
					</div>
				)}
				<p className='mt-4 text-xs text-gray-400'>
					Страница обновится автоматически.
				</p>
			</section>
		)
	}

	if (document.status === 'reply_completed') {
		return (
			<section className='bg-surface p-6 rounded-2xl shadow-xl flex flex-col items-stretch'>
				<h2 className='text-xl font-bold text-text-base mb-4'>
					Итоговое письмо
				</h2>
				<textarea
					className='w-full min-h-[200px] sm:min-h-[300px] p-4 rounded-lg border border-border bg-background text-text-base mb-4 whitespace-pre-wrap focus:ring-2 focus:ring-primary focus:border-transparent'
					value={editableFinalReply}
					onChange={e => setEditableFinalReply(e.target.value)}
					readOnly={!isEditing}
				/>
				<div className='flex flex-col sm:flex-row gap-3 justify-end'>
					<button
						className='px-4 py-2 rounded-lg bg-primary text-text-on-primary font-semibold hover:opacity-90 transition-opacity'
						onClick={() => onCopyToClipboard(editableFinalReply)}
					>
						Скопировать текст
					</button>
					{!isEditing ? (
						<button
							className='px-4 py-2 rounded-lg border border-border bg-background text-text-base font-semibold hover:bg-surface transition'
							onClick={() => setIsEditing(true)}
						>
							Редактировать
						</button>
					) : (
						<div className='flex gap-3'>
							<button
								className='px-4 py-2 rounded-lg border border-green-500 bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition'
								onClick={() => {
									// TODO: Здесь должна быть логика сохранения отредактированного текста в БД
									// Например, вызов API / server action
									alert(
										'Логика сохранения отредактированного текста еще не реализована. Пока только в UI.'
									)
									setIsEditing(false)
									// После успешного сохранения в БД, можно обновить `document.final_reply_text`
									// и `editableFinalReply` должен будет взять новое значение из `useEffect`
								}}
							>
								Сохранить изменения
							</button>
							<button
								className='px-4 py-2 rounded-lg border border-border bg-background text-text-base font-semibold hover:bg-surface transition'
								onClick={() => {
									const sourceDraft = drafts.find(
										d => d.is_source_for_final_reply
									)
									setEditableFinalReply(
										document?.final_reply_text ||
											sourceDraft?.draft_text_russian ||
											''
									)
									setIsEditing(false)
								}}
							>
								Отменить
							</button>
						</div>
					)}
				</div>
			</section>
		)
	}

	return null // Если статус не предполагает отображения этой секции
}
