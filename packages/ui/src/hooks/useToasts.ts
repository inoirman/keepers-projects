// packages/ui/src/hooks/useToasts.ts
'use client'
import { create } from 'zustand'

export interface ToastMessage {
	id: string
	message: string
	type?: 'success' | 'error' | 'info' | 'warning'
	duration?: number
}

interface ToastState {
	toasts: ToastMessage[]
	addToast: (toast: Omit<ToastMessage, 'id'>) => void
	dismissToast: (id: string) => void
}

let toastCount = 0

export const useToastStore = create<ToastState>(set => ({
	toasts: [],
	addToast: toast => {
		const id = `toast-${toastCount++}`
		set(state => ({
			toasts: [...state.toasts, { ...toast, id }],
		}))
	},
	dismissToast: id =>
		set(state => ({
			toasts: state.toasts.filter(toast => toast.id !== id),
		})),
}))

// Хук для удобного использования
export const useToasts = () => {
	const { toasts, addToast, dismissToast } = useToastStore()
	return { toasts, addToast, dismissToast }
}
