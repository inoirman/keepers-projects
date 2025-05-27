// apps/postmaster-ai/src/app/documents/[id]/components/DocumentHeader.tsx
import type { Document } from '@service-suite/types'
import { useRouter } from 'next/navigation'

interface DocumentHeaderProps {
	document: Document | null
}

export function DocumentHeader({ document }: DocumentHeaderProps) {
	const router = useRouter()
	if (!document) return null

	return (
		<div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
			<div>
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
										? 'text-blue-600'
										: document.status === 'reply_completed'
											? 'text-purple-600'
											: ''
						}`}
					>
						{document.status}
					</span>
				</p>
			</div>
			<button
				className='mt-2 sm:mt-0 px-4 py-2 bg-primary text-text-on-primary rounded-lg shadow hover:opacity-90 transition flex items-center gap-2'
				onClick={() => router.push('/documents')}
			>
				<svg
					className='w-5 h-5'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M15 19l-7-7 7-7'
					/>
				</svg>
				<span>К списку документов</span>
			</button>
		</div>
	)
}
