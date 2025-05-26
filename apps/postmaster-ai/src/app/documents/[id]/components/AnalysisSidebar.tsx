// apps/postmaster-ai/src/app/documents/[id]/components/AnalysisSidebar.tsx
import type { Document, ReplyDraft } from '@service-suite/types'
import { OriginalTextDisplay } from './OriginalTextDisplay' // Импортируем

interface AnalysisSidebarProps {
	document: Document | null
	drafts: ReplyDraft[]
	currentDraft: ReplyDraft | null
	onSelectDraftAsFinal: (draft: ReplyDraft) => void
}

export function AnalysisSidebar({
	document,
	drafts,
	currentDraft,
	onSelectDraftAsFinal,
}: AnalysisSidebarProps) {
	if (!document) return null

	return (
		<aside className='space-y-6'>
			<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg'>
				<h2 className='text-lg font-semibold text-text-base mb-3'>
					Анализ документа
				</h2>

				{document.status === 'pending_analysis' && (
					<p className='text-text-muted italic'>
						Анализ выполняется, пожалуйста, подождите...
					</p>
				)}

				<details open={document.status !== 'pending_analysis'}>
					{' '}
					{/* Открыто по умолчанию, если не pending_analysis */}
					<summary className='cursor-pointer text-text-base font-medium hover:text-primary transition-colors'>
						Оригинал письма
					</summary>
					<OriginalTextDisplay
						originalText={document.original_text}
						className='mt-2'
					/>
				</details>

				{Array.isArray(document.analysis_recommendations) &&
					document.analysis_recommendations.length > 0 && (
						<div className='mt-4'>
							<h3 className='font-medium text-text-base mb-1'>
								Рекомендации для ответа:
							</h3>
							<ul className='list-disc pl-5 space-y-1 text-sm'>
								{(document.analysis_recommendations as string[]).map(
									// Утверждение типа
									(rec: string, idx: number) => (
										<li key={idx} className='text-text-muted'>
											{rec}
										</li>
									)
								)}
							</ul>
						</div>
					)}

				{drafts.length > 0 && (
					<div className='mt-6'>
						<h3 className='font-semibold text-text-base mb-2'>
							История черновиков ({drafts.length}/3)
						</h3>
						<div className='space-y-3'>
							{drafts.map(draft => (
								<div
									key={draft.id}
									className={`bg-background border border-border rounded-lg p-3 transition-all
                    ${currentDraft && draft.id === currentDraft.id ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'}
                    ${draft.is_source_for_final_reply ? 'opacity-70 border-green-500' : ''}
                  `}
								>
									<div className='flex justify-between items-center text-xs mb-1 text-text-muted'>
										<span>Итерация {draft.iteration_number}</span>
										<span className='text-gray-500'>
											{new Date(draft.created_at).toLocaleDateString()}
										</span>
									</div>
									<p className='whitespace-pre-wrap text-xs text-text-base mb-2 break-words line-clamp-3'>
										{draft.draft_text_russian || (
											<span className='italic'>Генерация...</span>
										)}
									</p>
									{document.status !== 'reply_completed' &&
										document.status !== 'pending_final_reply' &&
										!draft.is_source_for_final_reply && (
											<button
												className='text-xs font-medium text-primary hover:underline disabled:opacity-50'
												onClick={() => onSelectDraftAsFinal(draft)}
												disabled={
													currentDraft?.id === draft.id &&
													document.status === 'pending_draft'
												} // Нельзя выбрать текущий генерирующийся
											>
												Выбрать и сделать финальным
											</button>
										)}
									{draft.is_source_for_final_reply && (
										<span className='text-xs font-medium text-green-600'>
											Использован для ответа
										</span>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{document.status !== 'pending_analysis' &&
					document.status !== 'analysis_completed' &&
					!document.analysis_summary && ( // Условие можно уточнить
						<p className='text-text-muted italic mt-4'>
							Информация об анализе отсутствует для текущего статуса.
						</p>
					)}
			</section>
		</aside>
	)
}
