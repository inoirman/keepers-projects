'use client'
import React from 'react'

export interface ToastConfirmProps {
	id: string
	message: string | React.ReactNode
	details?: string | React.ReactNode
	type?: 'info' | 'warning' | 'error' | 'success'
	onConfirm: (id: string) => void
	onCancel: (id: string) => void
}

const iconMap = {
	success: (
		<span className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-toast-success-bg text-toast-success-text mb-4 shadow'>
			<svg
				className='w-7 h-7'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M5 13l4 4L19 7'
				/>
			</svg>
		</span>
	),
	error: (
		<span className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-toast-error-bg text-toast-error-text mb-4 shadow'>
			<svg
				className='w-7 h-7'
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
		</span>
	),
	warning: (
		<span className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-toast-confirm-icon-bg text-toast-confirm-icon-text mb-4 shadow'>
			<svg
				className='w-7 h-7'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z'
				/>
			</svg>
		</span>
	),
	info: (
		<span className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-toast-info-bg text-toast-info-text mb-4 shadow'>
			<svg
				className='w-7 h-7'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M13 16h-1v-4h-1m1-4h.01'
				/>
			</svg>
		</span>
	),
}

export const ToastConfirm: React.FC<ToastConfirmProps> = ({
	id,
	message,
	details,
	type = 'warning',
	onConfirm,
	onCancel,
}) => (
	<div className='fixed inset-0 flex items-center justify-center z-50 bg-black/50'>
		<div className='bg-toast-confirm-bg text-toast-confirm-text rounded-2xl shadow-2xl p-8 max-w-xs w-full animate-fade-in flex flex-col items-center relative border border-border'>
			{iconMap[type]}
			<div className='text-lg font-bold text-center mb-2'>{message}</div>
			<div className='flex flex-col gap-3 w-full mt-2'>
				<button
					className='flex-1 py-2 rounded-lg bg-primary text-text-on-primary font-semibold hover:opacity-90 transition'
					onClick={() => onConfirm(id)}
					autoFocus
				>
					Подтвердить
				</button>
				<button
					className='flex-1 py-2 rounded-lg border border-border bg-background text-text-base font-semibold hover:bg-surface transition'
					onClick={() => onCancel(id)}
				>
					Отмена
				</button>
			</div>
		</div>
	</div>
)
