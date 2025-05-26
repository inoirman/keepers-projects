// apps/postmaster-ai/src/app/documents/page.tsx
'use client' // Для использования useRouter и в будущем для списка документов

import { useAuth } from '@service-suite/auth-logic' // Для проверки авторизации
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// import type { Metadata } from 'next';
// export const metadata: Metadata = { title: 'Мои документы - PostmasterAI' };

export default function DocumentsPage() {
	const router = useRouter()
	const { isAuthenticated, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace('/login?message=unauthorized_documents')
		}
	}, [isLoading, isAuthenticated, router])

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-10'>
				<p className='text-text-muted'>Загрузка...</p>
			</div>
		)
	}

	if (!isAuthenticated) {
		// Этот рендер может быть не виден из-за редиректа в useEffect,
		// но полезен как заглушка или если JS отключен (хотя 'use client' требует JS).
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

	// Здесь будет логика загрузки и отображения списка документов
	// const [documents, setDocuments] = useState([]);
	// useEffect(() => { /* ... загрузка документов ... */ }, []);

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

			{/* Заглушка для списка документов */}
			<div className='bg-surface p-6 rounded-lg shadow'>
				<p className='text-text-muted'>
					У вас пока нет документов. Начните с{' '}
					<Link href='/documents/new' className='text-primary hover:underline'>
						создания нового
					</Link>
					!
				</p>
				{/* 
        Здесь будет рендеринг списка:
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>{doc.title || 'Без названия'} - {doc.status}</li>
          ))}
        </ul>
        */}
			</div>
		</div>
	)
}
