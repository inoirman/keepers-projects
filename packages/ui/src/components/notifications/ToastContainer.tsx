// packages/ui/src/components/notifications/ToastContainer.tsx
import React from 'react'
import { Toast, ToastProps } from './Toast'

interface ToastContainerProps {
	toasts: Omit<ToastProps, 'onDismiss'>[] // Принимаем массив тостов без onDismiss
	onDismissToast: (id: string) => void // Функция для удаления тоста извне
	position?:
		| 'top-right'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-left'
		| 'top-center'
		| 'bottom-center'
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
	toasts,
	onDismissToast,
	position = 'top-right',
}) => {
	const positionClasses = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
	}

	if (!toasts.length) {
		return null
	}

	return (
		<div
			className={`fixed ${positionClasses[position]} z-50 space-y-2 w-full max-w-xs sm:max-w-sm`}
			aria-live='polite' // Для доступности, чтобы скринридеры объявляли новые тосты
		>
			{toasts.map(toast => (
				<Toast key={toast.id} {...toast} onDismiss={onDismissToast} />
			))}
		</div>
	)
}
