// apps/postmaster-ai/src/app/documents/[id]/components/OriginalTextDisplay.tsx
import type { Document } from '@service-suite/types'

interface OriginalTextDisplayProps {
	originalText: Document['original_text']
	className?: string
}

export function OriginalTextDisplay({
	originalText,
	className = '',
}: OriginalTextDisplayProps) {
	return (
		<div
			className={`prose prose-sm max-w-none bg-background p-3 rounded border border-border whitespace-pre-wrap ${className}`}
		>
			{originalText}
		</div>
	)
}
