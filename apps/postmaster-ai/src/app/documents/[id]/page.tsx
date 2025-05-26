// apps/postmaster-ai/src/app/documents/[id]/page.tsx
'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client' // Для подписки или запросов
import { useAuth } from '@service-suite/auth-logic'
import { useToasts } from '@service-suite/ui'
import {
	useParams,
	useRouter, // useParams для получения [id] из URL
} from 'next/navigation'
import { useEffect, useState } from 'react'

// Тип для документа (можно будет вынести в общий @service-suite/types)
interface DocumentType {
	id: string
	title?: string | null
	original_text: string
	status: string
	analysis_summary?: string | null
	analysis_detailed?: string | null // jsonb
	analysis_recommendations?: string | null // jsonb
	// ... другие поля из твоей таблицы documents
	created_at: string
}

export default function DocumentDetailPage() {
	const params = useParams() // { id: '...' }
	const documentId = params.id as string // Получаем ID документа из URL

	const router = useRouter()
	const { isAuthenticated, isLoading: authLoading, user } = useAuth()
	const { addToast } = useToasts()
	const supabase = createSupabaseBrowserClient()

	const [document, setDocument] = useState<DocumentType | null>(null)
	const [isLoadingDoc, setIsLoadingDoc] = useState(true)
	const [errorDoc, setErrorDoc] = useState<string | null>(null)

	// Загрузка документа при монтировании и подписка на изменения
	useEffect(() => {
		if (!documentId || !isAuthenticated) return // Ждем ID и авторизацию

		setIsLoadingDoc(true)

		// Функция для загрузки документа
		const fetchDocument = async () => {
			const { data, error } = await supabase
				.from('documents')
				.select('*') // Загружаем все поля
				.eq('id', documentId)
				.eq('user_id', user!.id) // Убеждаемся, что документ принадлежит пользователю
				.single()

			if (error) {
				console.error('Error fetching document:', error)
				setErrorDoc(error.message)
				addToast({
					message: `Ошибка загрузки документа: ${error.message}`,
					type: 'error',
				})
				// router.push('/documents'); // Можно вернуть на список, если документ не найден или нет прав
			} else if (data) {
				setDocument(data as DocumentType)
				setErrorDoc(null)
			} else {
				setErrorDoc('Документ не найден или у вас нет к нему доступа.')
				addToast({ message: 'Документ не найден.', type: 'info' })
				// router.push('/documents');
			}
			setIsLoadingDoc(false)
		}

		fetchDocument()

		// Подписка на изменения в таблице documents для этого документа
		const channel = supabase
			.channel(`document-${documentId}`)
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'documents',
					filter: `id=eq.${documentId}`,
				},
				payload => {
					console.log('Document updated via Realtime:', payload.new)
					addToast({
						message: 'Данные документа обновлены!',
						type: 'info',
						duration: 2000,
					})
					setDocument(payload.new as DocumentType) // Обновляем состояние документа
					// Здесь можно проверить payload.new.status и обновить UI соответственно
					if (payload.new.status === 'analysis_completed') {
						addToast({ message: 'Анализ текста завершен!', type: 'success' })
					}
				}
			)
			.subscribe((status, err) => {
				if (status === 'SUBSCRIBED') {
					console.log(
						`Subscribed to Realtime updates for document ${documentId}`
					)
				}
				if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
					console.error(
						`Realtime subscription error for document ${documentId}:`,
						err || status
					)
					addToast({
						message: 'Ошибка Realtime-подписки на обновления документа.',
						type: 'warning',
					})
				}
			})

		// Отписка при размонтировании компонента
		return () => {
			supabase.removeChannel(channel)
			console.log(
				`Unsubscribed from Realtime updates for document ${documentId}`
			)
		}
	}, [documentId, isAuthenticated, supabase, user, addToast, router])

	// Защита роута на клиенте
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.replace(`/login?redirect=/documents/${documentId}`)
		}
	}, [authLoading, isAuthenticated, router, documentId])

	if (authLoading || isLoadingDoc) {
		return (
			<div className='py-10 text-center text-text-muted'>
				Загрузка документа...
			</div>
		)
	}

	if (!isAuthenticated) {
		// Уже должно быть обработано useEffect выше, но для надежности
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
		// Это состояние может быть, если документ еще не загружен, или не найден
		// isLoadingDoc должно было это покрыть, но для полноты картины
		return (
			<div className='py-10 text-center text-text-muted'>
				Документ не найден.
			</div>
		)
	}

	// === ОСНОВНОЙ UI СТРАНИЦЫ ДОКУМЕНТА ===
	return (
		<div className='py-6 sm:py-8'>
			<div className='mb-6'>
				<h1 className='text-2xl sm:text-3xl font-bold text-text-base break-all'>
					{document.title || `Документ #${document.id.substring(0, 8)}...`}
				</h1>
				<p className='text-sm text-text-muted'>
					Статус:{' '}
					<span
						className={`font-semibold ${document.status === 'pending_analysis' ? 'text-yellow-600' : document.status === 'analysis_completed' ? 'text-green-600' : ''}`}
					>
						{document.status}
					</span>
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* Колонка с исходным текстом и формой для ответа */}
				<div className='md:col-span-2 space-y-6'>
					<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg'>
						<h2 className='text-lg font-semibold text-text-base mb-3'>
							Исходный текст
						</h2>
						<div className='prose prose-sm max-w-none bg-background p-3 rounded border border-border whitespace-pre-wrap'>
							{/* whitespace-pre-wrap для сохранения пробелов и переносов */}
							{document.original_text}
						</div>
					</section>

					{/* Здесь будут формы для идеи ответа, правок и т.д. в зависимости от статуса */}
					{document.status === 'analysis_completed' && (
						<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg'>
							<h2 className='text-lg font-semibold text-text-base mb-3'>
								Ваша идея для ответа
							</h2>
							{/* ... форма для идеи ответа ... */}
							<textarea
								className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-background text-text-base'
								rows={5}
								placeholder='Напишите здесь основные тезисы вашего ответа...'
							></textarea>
							<button className='mt-3 px-4 py-2 bg-primary text-text-on-primary rounded-md hover:opacity-90'>
								Сгенерировать черновик
							</button>
						</section>
					)}
				</div>

				{/* Боковая панель с результатами анализа */}
				<aside className='space-y-6'>
					<section className='bg-surface p-4 sm:p-6 rounded-lg shadow-lg'>
						<h2 className='text-lg font-semibold text-text-base mb-3'>
							Анализ документа
						</h2>
						{document.status === 'pending_analysis' && (
							<p className='text-text-muted italic'>
								Анализ выполняется, пожалуйста, подождите...
							</p>
						)}
						{document.status === 'analysis_completed' && (
							<>
								{document.analysis_summary && (
									<div className='mb-4'>
										<h3 className='font-medium text-text-base mb-1'>
											Краткий смысл:
										</h3>
										<p className='text-sm text-text-muted'>
											{document.analysis_summary}
										</p>
									</div>
								)}
								{/* Здесь будет отображение analysis_detailed и analysis_recommendations */}
								{/* Например, если они JSONB: <pre>{JSON.stringify(document.analysis_detailed, null, 2)}</pre> */}
								<p className='text-sm text-text-muted italic'>
									(Здесь будут подробности и рекомендации)
								</p>
							</>
						)}
						{document.status !== 'pending_analysis' &&
							document.status !== 'analysis_completed' &&
							!document.analysis_summary && (
								<p className='text-text-muted italic'>
									Информация об анализе отсутствует для текущего статуса.
								</p>
							)}
					</section>
				</aside>
			</div>
		</div>
	)
}
