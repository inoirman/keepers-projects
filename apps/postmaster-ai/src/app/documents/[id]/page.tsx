// apps/postmaster-ai/src/app/documents/[id]/page.tsx
'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAuth } from '@service-suite/auth-logic' // Убедись, что этот путь правильный
import type {
	Document as DocumentType,
	ReplyDraft as ReplyDraftType,
} from '@service-suite/types' // Используем центральные типы
import { useToasts } from '@service-suite/ui' // Убедись, что этот путь правильный
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

// Импорт новых компонентов
import { AnalysisSidebar } from './components/AnalysisSidebar'
import { DocumentHeader } from './components/DocumentHeader'
import { DraftingArea } from './components/DraftingArea'
import { FinalReplySection } from './components/FinalReplySection'

export default function DocumentDetailPage() {
	const params = useParams()
	const documentId = params.id as string

	const router = useRouter()
	const { isAuthenticated, isLoading: authLoading, user } = useAuth()
	const { addToast, dismissToast } = useToasts()
	const supabase = createSupabaseBrowserClient()

	const [document, setDocument] = useState<DocumentType | null>(null)
	const [isLoadingDoc, setIsLoadingDoc] = useState(true)
	const [errorDoc, setErrorDoc] = useState<string | null>(null)

	const [drafts, setDrafts] = useState<ReplyDraftType[]>([])
	const [currentDraft, setCurrentDraft] = useState<ReplyDraftType | null>(null) // Черновик, который является текущим для отображения/работы

	const [userIdea, setUserIdea] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false) // Общий флаг для асинхронных операций

	// Загрузка документа и подписка
	useEffect(() => {
		if (!documentId || !isAuthenticated || !user?.id) return
		setIsLoadingDoc(true)

		const fetchDocument = async () => {
			const { data, error } = await supabase
				.from('documents')
				.select('*')
				.eq('id', documentId)
				.eq('user_id', user.id)
				.single()

			if (error) {
				console.error('Error fetching document:', error)
				setErrorDoc('Ошибка загрузки: ' + error.message)
				addToast({ message: `Ошибка загрузки документа.`, type: 'error' })
				// router.push('/documents'); // Раскомментируй, если нужно
			} else if (data) {
				setDocument(data)
				setErrorDoc(null)
			} else {
				setErrorDoc('Документ не найден или у вас нет к нему доступа.')
				addToast({ message: 'Документ не найден.', type: 'info' })
				// router.push('/documents'); // Раскомментируй, если нужно
			}
			setIsLoadingDoc(false)
		}

		fetchDocument()

		const channel = supabase
			.channel(`document-${documentId}`)
			.on<DocumentType>( // Явно указываем тип для payload
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'documents',
					filter: `id=eq.${documentId}`,
				}, // Добавлен filter
				payload => {
					console.log('Document updated via Realtime:', payload.new)
					addToast({
						message: 'Данные документа обновлены!',
						type: 'info',
						duration: 2000,
					})
					setDocument(payload.new)
					if (payload.new.status === 'analysis_completed') {
						addToast({ message: 'Анализ текста завершен!', type: 'success' })
					}
					// Можно добавить обработку других статусов
				}
			)
			.subscribe((status, err) => {
				if (status === 'SUBSCRIBED')
					console.log(`Subscribed to Realtime for document ${documentId}`)
				if (err)
					console.error(
						`Realtime subscription error for document ${documentId}:`,
						err
					)
			})

		return () => {
			supabase.removeChannel(channel)
		}
	}, [documentId, isAuthenticated, user?.id, supabase, addToast, router])

	// Загрузка и обновление черновиков
	const fetchAndSetDrafts = useCallback(async () => {
		if (!documentId || !user?.id) return
		const { data, error } = await supabase
			.from('reply_drafts')
			.select('*')
			.eq('document_id', documentId)
			.eq('user_id', user.id) // Добавляем user_id для безопасности/RLS
			.order('iteration_number', { ascending: true })

		if (error) {
			console.error('Error fetching drafts:', error)
			addToast({
				message: `Ошибка загрузки черновиков: ${error.message}`,
				type: 'error',
			})
			setDrafts([])
		} else {
			setDrafts(data || [])
		}
	}, [documentId, user?.id, supabase, addToast])

	useEffect(() => {
		fetchAndSetDrafts()
	}, [fetchAndSetDrafts])

	// Установка currentDraft на основе document.current_reply_draft_id или последнего из списка
	useEffect(() => {
		if (document && drafts.length > 0) {
			const activeDraft =
				drafts.find(d => d.id === document.current_reply_draft_id) ||
				drafts[drafts.length - 1]
			setCurrentDraft(activeDraft)
		} else if (document && drafts.length === 0) {
			setCurrentDraft(null) // Если документ есть, а черновиков нет
		}
	}, [document, drafts])

	// Защита роута
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.replace(`/login?redirect=/documents/${documentId}`)
		}
	}, [authLoading, isAuthenticated, router, documentId])

	const handleCreateDraft = async () => {
		if (!document || !userIdea.trim()) return
		setIsSubmitting(true)
		try {
			const response = await fetch('/api/drafts/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					document_id: document.id,
					user_idea_for_reply: userIdea,
				}),
			})
			const result = await response.json() // Предполагаем, что result может содержать { data: ..., error: { message: ... } }

			if (response.ok && result.data) {
				// Проверяем и data
				addToast({
					message: 'Запрос на черновик отправлен, ожидайте генерации.',
					type: 'success',
				})
				setUserIdea('')
			} else {
				// Если есть result.error и у него есть message, используем его
				const errorMessage =
					result.error?.message || 'Неизвестная ошибка при создании черновика.'
				addToast({
					message: `Ошибка создания черновика: ${errorMessage}`,
					type: 'error',
				})
			}
		} catch (error: unknown) {
			// ИЗМЕНЕНО: error: unknown
			let errorMessage = 'Произошла сетевая ошибка или ошибка сервера.'
			if (error instanceof Error) {
				errorMessage = error.message // Безопасный доступ к свойству message
			}
			addToast({ message: `Ошибка: ${errorMessage}`, type: 'error' })
			console.error('Draft creation error:', error) // Логируем всю ошибку для отладки
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleGenerateFinalAnswer = async (draftToFinalize: ReplyDraftType) => {
		if (!draftToFinalize || !document?.id) return
		setIsSubmitting(true)
		try {
			const response = await fetch('/api/drafts/finalize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					draft_id: draftToFinalize.id,
					document_id: document.id,
				}),
			})
			const result = await response.json() // Аналогично предполагаем структуру ответа

			if (response.ok && result.data?.document) {
				// Проверяем и data.document
				addToast({
					message: 'Запрос на финальный ответ отправлен.',
					type: 'success',
				})
			} else {
				const errorMessage =
					result.error?.message || 'Неизвестная ошибка при генерации ответа.'
				addToast({
					message: `Ошибка генерации ответа: ${errorMessage}`,
					type: 'error',
				})
			}
		} catch (error: unknown) {
			// ИЗМЕНЕНО: error: unknown
			let errorMessage = 'Произошла сетевая ошибка или ошибка сервера.'
			if (error instanceof Error) {
				errorMessage = error.message
			}
			addToast({ message: `Ошибка: ${errorMessage}`, type: 'error' })
			console.error('Generate final answer error:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleSelectDraftAsFinalWithConfirm = (draft: ReplyDraftType) => {
		addToast({
			variant: 'confirm', // Убедитесь, что ваш useToasts это поддерживает
			message:
				'Сгенерировать итоговое письмо на базе выбранного черновика? Это действие необратимо.',
			type: 'warning',
			onConfirm: toastId => {
				dismissToast(toastId)
				handleGenerateFinalAnswer(draft)
			},
			onCancel: dismissToast,
		})
	}

	const handleCopyToClipboard = (text: string) => {
		if (!text) {
			addToast({ message: 'Нет текста для копирования.', type: 'warning' })
			return
		}
		navigator.clipboard
			.writeText(text)
			.then(() =>
				addToast({
					message: 'Текст скопирован!',
					type: 'success',
					duration: 2000,
				})
			)
			.catch(() =>
				addToast({ message: 'Ошибка копирования в буфер.', type: 'error' })
			)
	}

	// Рендеринг состояний загрузки/ошибок
	if (authLoading || (isLoadingDoc && !document)) {
		// Показываем загрузку, если нет документа Идет загрузка
		return (
			<div className='py-10 text-center text-text-muted'>
				Загрузка данных документа...
			</div>
		)
	}
	if (!isAuthenticated && !authLoading) {
		// Если загрузка авторизации завершена и не авторизован
		return (
			<div className='py-10 text-center text-text-muted'>
				Для просмотра документа необходимо войти.
			</div>
		)
	}
	if (errorDoc) {
		return (
			<div className='py-10 text-center text-red-500'>Ошибка: {errorDoc}</div>
		)
	}
	if (!document) {
		// Если после всех проверок документа все еще нет
		return (
			<div className='py-10 text-center text-text-muted'>
				Документ не найден.
			</div>
		)
	}

	// === ОСНОВНОЙ UI СТРАНИЦЫ ДОКУМЕНТА ===
	return (
		<div className='container mx-auto px-2 sm:px-4 py-6 sm:py-8'>
			<DocumentHeader document={document} />

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
				<main className='lg:col-span-2 space-y-6'>
					{/* Область для различных действий в зависимости от статуса */}
					<DraftingArea
						document={document}
						currentDraft={currentDraft}
						draftsCount={drafts.length}
						userIdea={userIdea}
						onUserIdeaChange={setUserIdea}
						onSubmitDraft={handleCreateDraft}
						onFinalizeDraft={handleGenerateFinalAnswer} // Передаем сюда, если текущий черновик выбран для финализации из этой области
						isSubmitting={isSubmitting}
					/>
					<FinalReplySection
						document={document}
						drafts={drafts}
						onCopyToClipboard={handleCopyToClipboard}
					/>
				</main>

				<AnalysisSidebar
					document={document}
					drafts={drafts}
					currentDraft={currentDraft}
					onSelectDraftAsFinal={handleSelectDraftAsFinalWithConfirm}
				/>
			</div>
		</div>
	)
}
