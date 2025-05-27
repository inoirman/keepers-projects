// apps/postmaster-ai/src/app/documents/[id]/components/DraftingArea.tsx
import type { Document, ReplyDraft } from '@service-suite/types'
import { OriginalTextDisplay } from './OriginalTextDisplay'

interface DraftingAreaProps {
	document: Document | null
	currentDraft: ReplyDraft | null
	draftsCount: number
	userIdea: string
	onUserIdeaChange: (value: string) => void
	onSubmitDraft: () => void
	onFinalizeDraft: (draft: ReplyDraft) => void
	isSubmitting: boolean
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

export function DraftingArea({
	document,
	currentDraft,
	draftsCount,
	userIdea,
	onUserIdeaChange,
	onSubmitDraft,
	onFinalizeDraft,
	isSubmitting,
}: DraftingAreaProps) {
	if (!document) return null

	const canCreateMoreDrafts = draftsCount < 3

	// Секция анализа текста (когда статус analysis_completed)
	if (document.status === 'analysis_completed') {
		return (
			<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg space-y-4'>
				<h2 className='text-lg font-semibold text-text-base mb-3'>
					Полный перевод письма
				</h2>
				{/* TODO: Заменить document.analysis_detailed на поле с переводом, когда оно будет */}
				<OriginalTextDisplay
					originalText={document.analysis_detailed || 'Перевод еще не готов...'}
					className='mb-4'
				/>

				<h3 className='font-medium text-text-base mb-2'>
					Ваши мысли для ответа
				</h3>
				<textarea
					className='block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background text-text-base'
					rows={4}
					placeholder='Что вы хотите спросить или уточнить в ответе?'
					value={userIdea}
					onChange={e => onUserIdeaChange(e.target.value)}
					disabled={isSubmitting || !canCreateMoreDrafts}
				/>
				<div className='flex items-center justify-between mt-2'>
					<button
						className='px-4 py-2 bg-primary text-text-on-primary rounded-md hover:opacity-90 transition-opacity disabled:opacity-50'
						onClick={onSubmitDraft}
						disabled={isSubmitting || !userIdea.trim() || !canCreateMoreDrafts}
					>
						{isSubmitting ? 'Генерация...' : 'Сгенерировать черновик'}
					</button>
					<div className='text-sm text-text-muted'>
						{canCreateMoreDrafts
							? `Осталось попыток: ${3 - draftsCount}`
							: 'Достигнут лимит (3 из 3)'}
					</div>
				</div>
			</section>
		)
	}

	// Секция ожидания черновика (pending_draft)
	if (document.status === 'pending_draft') {
		return (
			<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[250px] text-center'>
				<LoadingSpinner />
				<h2 className='text-lg font-semibold text-primary mt-4 mb-2'>
					Генерируется черновик ответа...
				</h2>
				<p className='text-text-muted'>
					Ваш запрос обрабатывается. Обычно это занимает не больше минуты.
				</p>
				<p className='mt-4 text-xs text-gray-400'>
					(Страница обновится автоматически)
				</p>
			</section>
		)
	}

	// Секция работы с готовым черновиком (draft_completed)
	if (document.status === 'draft_completed' && currentDraft) {
		return (
			<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg space-y-4'>
				<h2 className='text-lg font-semibold text-text-base mb-3'>
					Ваш черновик ответа (Вариант {currentDraft.iteration_number})
				</h2>
				<OriginalTextDisplay
					originalText={
						currentDraft.draft_text_russian || 'Текст черновика отсутствует.'
					}
					className='mb-4'
				/>

				{canCreateMoreDrafts && (
					<>
						<h3 className='font-medium text-text-base mb-2'>
							Что хотите доработать?
						</h3>
						<textarea
							className='block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background text-text-base'
							rows={4}
							placeholder='Опишите ваши правки или новую идею для следующей итерации...'
							value={userIdea}
							onChange={e => onUserIdeaChange(e.target.value)}
							disabled={isSubmitting}
						/>
					</>
				)}
				<div className='flex flex-wrap items-center justify-between gap-2 mt-2'>
					{canCreateMoreDrafts && (
						<button
							className='px-4 py-2 bg-primary text-text-on-primary rounded-md hover:opacity-90 transition-opacity disabled:opacity-50'
							onClick={onSubmitDraft}
							disabled={isSubmitting || !userIdea.trim()}
						>
							{isSubmitting ? 'Генерация...' : 'Сгенерировать новый черновик'}
						</button>
					)}
					<button
						className={`px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50
              ${isSubmitting ? 'bg-gray-400' : 'bg-green-600'}`}
						onClick={() => onFinalizeDraft(currentDraft)}
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Обработка...' : 'Сформировать итоговое письмо'}
					</button>
					<div className='text-sm text-text-muted w-full md:w-auto text-right mt-2 md:mt-0'>
						{canCreateMoreDrafts
							? `Осталось попыток: ${3 - draftsCount}`
							: 'Достигнут лимит (3 из 3)'}
					</div>
				</div>
			</section>
		)
	}

	// Секция отображения оригинального текста если статус pending_analysis
	if (document.status === 'pending_analysis') {
		return (
			<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg'>
				<h2 className='text-lg font-semibold text-text-base mb-3'>
					Исходный текст
				</h2>
				<OriginalTextDisplay originalText={document.original_text} />
			</section>
		)
	}

	return null // Если ни один статус не подошел для этой области
}
