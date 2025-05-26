// apps/postmaster-ai/src/app/documents/page.tsx
'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAuth } from '@service-suite/auth-logic'
import type { Document } from '@service-suite/types' // Убедитесь, что путь правильный!
import { useToasts } from '@service-suite/ui' // Если нужны уведомления
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DocumentsPage() {
	const router = useRouter()
	const { isAuthenticated, isLoading: authLoading, user } = useAuth()
	const { addToast } = useToasts()
	const supabase = createSupabaseBrowserClient()

	const [documents, setDocuments] = useState<Document[]>([])
	const [isLoadingDocs, setIsLoadingDocs] = useState(true)
	const [errorDocs, setErrorDocs] = useState<string | null>(null)

	// Защита роута и начальная загрузка данных
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.replace('/login?message=unauthorized_documents')
			return
		}

		if (isAuthenticated && user) {
			setIsLoadingDocs(true)
			const fetchDocuments = async () => {
				const { data, error } = await supabase
					.from('documents')
					.select('id, title, original_text, status, created_at, updated_at') // Выбираем нужные поля
					.eq('user_id', user.id)
					.order('updated_at', { ascending: false }) // Сортируем по дате обновления

				if (error) {
					console.error('Error fetching documents:', error)
					setErrorDocs(error.message)
					addToast({
						message: `Ошибка загрузки списка документов: ${error.message}`,
						type: 'error',
					})
				} else if (data) {
					setDocuments(data as Document[])
					setErrorDocs(null)
				}
				setIsLoadingDocs(false)
			}

			fetchDocuments()

			// Подписка на изменения в таблице documents
			const channel = supabase
				.channel('public:documents')
				.on(
					'postgres_changes',
					{
						event: '*', // Слушаем все события: INSERT, UPDATE, DELETE
						schema: 'public',
						table: 'documents',
						// Фильтр по user_id, если возможно и нужно для оптимизации (RLS должна отсекать чужие)
						// filter: `user_id=eq.${user.id}` // может не сработать для DELETE если запись уже удалена
					},
					async payload => {
						console.log('Documents table changed:', payload)
						addToast({
							message: 'Список документов обновлен!',
							type: 'info',
							duration: 2000,
						})
						// Перезапрашиваем весь список, чтобы обработать INSERT, UPDATE, DELETE
						// Это самый простой способ, но можно оптимизировать, обрабатывая payload.eventType
						await fetchDocuments()
					}
				)
				.subscribe((status, err) => {
					if (status === 'SUBSCRIBED') {
						console.log('Subscribed to Realtime updates for documents list')
					}
					if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
						console.error(
							'Realtime subscription error for documents list:',
							err || status
						)
						addToast({
							message: 'Ошибка Realtime-подписки на список документов.',
							type: 'warning',
						})
					}
				})

			return () => {
				supabase.removeChannel(channel)
				console.log('Unsubscribed from Realtime updates for documents list')
			}
		}
	}, [authLoading, isAuthenticated, user, supabase, addToast, router]) // Добавил router в зависимости, если используется внутри useEffect

	if (
		authLoading ||
		(isAuthenticated && isLoadingDocs && documents.length === 0)
	) {
		return (
			<div className='flex items-center justify-center py-10'>
				<p className='text-text-muted'>Загрузка документов...</p>
			</div>
		)
	}

	if (!isAuthenticated && !authLoading) {
		// Уже должно быть обработано useEffect, но для надежности
		return (
			<div className='flex items-center justify-center py-10'>
				<p className='text-text-muted'>
					Для доступа к документам необходимо{' '}
					<Link href='/login' className='text-primary hover:underline'>
						войти
					</Link>
					.
				</p>
			</div>
		)
	}

	if (errorDocs) {
		return (
			<div className='py-10 text-center text-red-500'>
				Ошибка загрузки документов: {errorDocs}
			</div>
		)
	}

	return (
		<div className='py-6 sm:py-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl sm:text-3xl font-bold text-text-base'>
					Мои документы
				</h1>
				<Link
					href='/documents/new'
					className='px-4 py-2 bg-primary text-text-on-primary rounded-md hover:opacity-90 transition-opacity text-sm font-medium shadow-sm'
				>
					Создать новый документ
				</Link>
			</div>

			{documents.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
					{documents.map(doc => (
						<Link
							key={doc.id}
							href={`/documents/${doc.id}`}
							className='block bg-surface p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out'
						>
							<div className='flex justify-between items-start mb-2'>
								<h2 className='text-lg font-semibold text-text-base hover:text-primary truncate'>
									{doc.title || `Документ #${doc.id.substring(0, 6)}...`}
								</h2>
								<span
									className={`px-2 py-0.5 text-xs font-medium rounded-full
                    ${doc.status === 'reply_completed' ? 'bg-green-100 text-green-700' : ''}
                    ${doc.status === 'pending_analysis' || doc.status === 'pending_draft' || doc.status === 'pending_final_reply' ? 'bg-yellow-100 text-yellow-700 animate-pulse' : ''}
                    ${doc.status === 'analysis_completed' || doc.status === 'draft_completed' ? 'bg-blue-100 text-blue-700' : ''}
                    ${doc.status === 'new' ? 'bg-gray-200 text-gray-700' : ''}
                    ${doc.status === 'error' ? 'bg-red-100 text-red-700' : ''}
                  `}
								>
									{/* Можно сделать маппинг статусов на человекочитаемые названия */}
									{doc.status
										.replace('_', ' ')
										.replace(/\b\w/g, l => l.toUpperCase())}
								</span>
							</div>
							<p className='text-sm text-text-muted line-clamp-2 mb-3'>
								{doc.original_text}
							</p>
							<p className='text-xs text-text-muted-light text-right'>
								Обновлен: {new Date(doc.updated_at).toLocaleString()}
							</p>
						</Link>
					))}
				</div>
			) : (
				<div className='bg-surface p-6 rounded-lg shadow text-center'>
					<svg
						className='mx-auto h-12 w-12 text-gray-400'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						aria-hidden='true'
					>
						<path
							vectorEffect='non-scaling-stroke'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
						/>
					</svg>
					<h3 className='mt-2 text-sm font-medium text-text-base'>
						Нет документов
					</h3>
					<p className='mt-1 text-sm text-text-muted'>
						У вас пока нет документов. Начните с{' '}
						<Link
							href='/documents/new'
							className='text-primary hover:underline'
						>
							создания нового
						</Link>
						!
					</p>
				</div>
			)}
		</div>
	)
}
