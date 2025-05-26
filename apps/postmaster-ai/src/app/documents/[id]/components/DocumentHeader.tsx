// apps/postmaster-ai/src/app/documents/[id]/components/DocumentHeader.tsx
import type { Document } from '@service-suite/types'

interface DocumentHeaderProps {
	document: Document | null
}

export function DocumentHeader({ document }: DocumentHeaderProps) {
	if (!document) return null

	return (
		<div className='mb-6'>
			<h1 className='text-2xl sm:text-3xl font-bold text-text-base break-all'>
				{document.title || `Документ #${document.id.substring(0, 8)}...`}
			</h1>
			<p className='text-sm text-text-muted'>
				Статус:{' '}
				<span
					className={`font-semibold ${
						document.status === 'pending_analysis'
							? 'text-yellow-600'
							: document.status === 'analysis_completed'
								? 'text-green-600'
								: document.status === 'draft_completed'
									? 'text-blue-600' // Добавим для примера
									: document.status === 'reply_completed'
										? 'text-purple-600'
										: '' // Добавим для примера
					}`}
				>
					{document.status} {/* TODO: Сделать более человекочитаемые статусы */}
				</span>
			</p>
		</div>
	)
}
