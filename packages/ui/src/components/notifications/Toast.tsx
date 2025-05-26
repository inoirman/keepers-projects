// packages/ui/src/components/notifications/Toast.tsx
'use client'
import React, { useEffect } from 'react'

export interface ToastProps {
	id: string
	message: string
	type?: 'success' | 'error' | 'info' | 'warning'
	duration?: number
	onDismiss: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({
	id,
	message,
	type = 'info',
	duration = 3000,
	onDismiss,
}) => {
	useEffect(() => {
		if (duration) {
			const timer = setTimeout(() => {
				onDismiss(id)
			}, duration)
			return () => clearTimeout(timer)
		}
	}, [id, duration, onDismiss])

	const baseClasses =
		'p-4 rounded-md shadow-lg text-sm font-medium flex items-center'

	const typeClasses = {
		success: 'bg-toast-success-bg text-toast-success-text',
		error: 'bg-toast-error-bg text-toast-error-text',
		warning: 'bg-toast-warning-bg text-toast-warning-text',
		info: 'bg-toast-info-bg text-toast-info-text', // Раньше был bg-blue-500, теперь наш info
	}

	// Иконки (простые текстовые, можно заменить на SVG)
	const icons = {
		success: '✓',
		error: '✕',
		warning: '!',
		info: 'ℹ',
	}

	return (
		<div
			className={`${baseClasses} ${typeClasses[type]}`}
			role='alert'
			aria-live='assertive'
			aria-atomic='true'
		>
			<span className='mr-2 text-lg'>{icons[type]}</span>
			<span>{message}</span>
			<button
				onClick={() => onDismiss(id)}
				className='ml-auto -mr-1 -my-1 p-1 rounded-md hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50'
				aria-label='Закрыть'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M6 18L18 6M6 6l12 12'
					/>
				</svg>
			</button>
		</div>
	)
}
