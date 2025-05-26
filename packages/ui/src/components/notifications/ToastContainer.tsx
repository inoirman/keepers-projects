// packages/ui/src/components/notifications/ToastContainer.tsx
'use client'
import React from 'react'
import { Toast, ToastProps } from './Toast'
import { ToastConfirm, ToastConfirmProps } from './ToastConfirm'

// Общий тип для тостов
type ToastVariant =
	| (Omit<ToastProps, 'onDismiss'> & {
			message: string | React.ReactNode
			variant?: 'toast'
			position?: ToastPosition
	  })
	| (Omit<ToastConfirmProps, 'onConfirm' | 'onCancel'> & {
			variant: 'confirm'
			onConfirm: (id: string) => void
			onCancel: (id: string) => void
			position?: ToastPosition
	  })

export type ToastPosition =
	| 'top-right'
	| 'top-left'
	| 'bottom-right'
	| 'bottom-left'
	| 'top-center'
	| 'bottom-center'
	| 'center-center'

interface ToastContainerProps {
	toasts: ToastVariant[]
	onDismissToast: (id: string) => void
	position?: ToastPosition
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
	toasts,
	onDismissToast,
	position = 'top-right',
}) => {
	const positionClasses: Record<ToastPosition, string> = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
		'center-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
	}

	// Отображаем только те тосты, у которых position совпадает с переданным пропсом (или дефолтным)
	const visibleToasts = toasts.filter(
		toast => (toast.position || 'top-right') === position
	)

	if (!visibleToasts.length) {
		return null
	}

	return (
		<div
			className={`fixed ${positionClasses[position]} z-50 space-y-2 w-full max-w-xs sm:max-w-sm`}
			aria-live='polite'
		>
			{visibleToasts.map(toast => {
				if (toast.variant === 'confirm') {
					const { id, message, type, onConfirm, onCancel, ...rest } =
						toast as Extract<ToastVariant, { variant: 'confirm' }>
					return (
						<ToastConfirm
							key={id}
							id={id}
							message={message}
							type={type}
							onConfirm={onConfirm}
							onCancel={onCancel}
							{...rest}
						/>
					)
				}
				// Default — обычный Toast
				const { id, ...rest } = toast as Omit<ToastProps, 'onDismiss'>
				return <Toast key={id} id={id} {...rest} onDismiss={onDismissToast} />
			})}
		</div>
	)
}
