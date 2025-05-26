// apps/postmaster-ai/src/app/documents/new/page.tsx
'use client'

import { useAuth } from '@service-suite/auth-logic'
import { useToasts } from '@service-suite/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// import type { Metadata } from 'next';
// export const metadata: Metadata = { title: 'Новый документ - PostmasterAI' };

export default function NewDocumentPage() {
	const router = useRouter()
	const { isAuthenticated, isLoading: authLoading, user } = useAuth()
	const { addToast } = useToasts()

	const [title, setTitle] = useState('')
	const [originalText, setOriginalText] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.replace('/login?message=unauthorized_new_document')
		}
	}, [authLoading, isAuthenticated, router])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!originalText.trim()) {
			addToast({
				message: 'Текст документа не может быть пустым.',
				type: 'error',
			})
			return
		}
		if (!user) {
			addToast({ message: 'Ошибка: пользователь не определен.', type: 'error' })
			return
		}

		setIsSubmitting(true)

		try {
			const response = await fetch('/api/documents', {
				// Наш будущий API эндпоинт
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: title || null, // Отправляем null если пусто, чтобы в БД не было пустой строки
					original_text: originalText,
					// user_id будет взят из сессии на сервере или передан, если нужно
				}),
			})

			const result = await response.json()

			if (response.ok && result.data?.id) {
				addToast({
					message: 'Документ создан, начинается анализ...',
					type: 'success',
				})

				router.push(`/documents/${result.data.id}`) // Перенаправляем на страницу документа
			} else {
				addToast({
					message: `Ошибка создания документа: ${result.error?.message || 'Неизвестная ошибка'}`,
					type: 'error',
				})
			}
		} catch (error) {
			console.error('Submit error:', error)
			addToast({ message: 'Сетевая ошибка или ошибка сервера.', type: 'error' })
		} finally {
			setIsSubmitting(false)
		}
	}

	if (authLoading) {
		return <div className='py-10 text-center text-text-muted'>Загрузка...</div>
	}
	if (!isAuthenticated) {
		return (
			<div className='py-10 text-center text-text-muted'>Доступ запрещен.</div>
		)
	}

	return (
		<div className='py-6 sm:py-8'>
			<h1 className='text-2xl sm:text-3xl font-bold text-text-base mb-6'>
				Новый документ для анализа
			</h1>
			<form
				onSubmit={handleSubmit}
				className='space-y-6 bg-surface p-6 sm:p-8 rounded-lg shadow-lg'
			>
				<div>
					<label
						htmlFor='doc-title'
						className='block text-sm font-medium text-text-muted mb-1'
					>
						Название документа (необязательно)
					</label>
					<input
						id='doc-title'
						type='text'
						value={title}
						onChange={e => setTitle(e.target.value)}
						disabled={isSubmitting}
						className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background text-text-base disabled:opacity-70'
						placeholder="Например, 'Письмо от партнера X'"
					/>
				</div>
				<div>
					<label
						htmlFor='doc-text'
						className='block text-sm font-medium text-text-muted mb-1'
					>
						Текст документа на иностранном языке{' '}
						<span className='text-red-500'>*</span>
					</label>
					<textarea
						id='doc-text'
						rows={10}
						value={originalText}
						onChange={e => setOriginalText(e.target.value)}
						required
						disabled={isSubmitting}
						className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background text-text-base disabled:opacity-70'
						placeholder='Вставьте сюда текст для анализа...'
					/>
				</div>
				<div className='flex justify-end'>
					<button
						type='submit'
						disabled={isSubmitting || !originalText.trim()}
						className='px-6 py-2.5 bg-primary text-text-on-primary rounded-md hover:opacity-90 transition-opacity text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isSubmitting
							? 'Сохранение и анализ...'
							: 'Сохранить и анализировать'}
					</button>
				</div>
			</form>
		</div>
	)
}
