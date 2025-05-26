'use client'
import { create } from 'zustand'

export interface ToastBasicMessage {
	id: string
	message: string
	type?: 'success' | 'error' | 'info' | 'warning'
	duration?: number
	variant?: 'toast'
	position?:
		| 'top-right'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-left'
		| 'top-center'
		| 'bottom-center'
		| 'center-center'
}
export interface ToastConfirmMessage {
	id: string
	message: string
	type?: 'success' | 'error' | 'info' | 'warning'
	variant: 'confirm'
	onConfirm: (id: string) => void
	onCancel: (id: string) => void
	position?:
		| 'top-right'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-left'
		| 'top-center'
		| 'bottom-center'
		| 'center-center'
}

export type ToastMessage = ToastBasicMessage | ToastConfirmMessage

type AddToast = {
	(toast: Omit<ToastBasicMessage, 'id'>): void
	(toast: Omit<ToastConfirmMessage, 'id'>): void
}

interface ToastState {
	toasts: ToastMessage[]
	addToast: AddToast
	dismissToast: (id: string) => void
}

let toastCount = 0

export const useToastStore = create<ToastState>(set => ({
	toasts: [],
	addToast: (toast: any) => {
		const id = `toast-${toastCount++}`
		if (toast.variant === 'confirm') {
			set(state => ({
				toasts: [...state.toasts, { ...toast, id }],
			}))
		} else {
			set(state => ({
				toasts: [...state.toasts, { ...toast, id, variant: 'toast' }],
			}))
		}
	},
	dismissToast: id =>
		set(state => ({
			toasts: state.toasts.filter(toast => toast.id !== id),
		})),
}))

export const useToasts = () => {
	const { toasts, addToast, dismissToast } = useToastStore()
	return { toasts, addToast, dismissToast }
}
