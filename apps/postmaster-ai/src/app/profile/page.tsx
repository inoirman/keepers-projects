// apps/postmaster-ai/src/app/profile/page.tsx
'use client'

import { useAuth } from '@service-suite/auth-logic' // Наш хук
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
	const { user, isAuthenticated, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace('/login?message=unauthorized') // Перенаправляем на логин, если не авторизован
		}
	}, [isLoading, isAuthenticated, router])

	if (isLoading) {
		return <div>Загрузка профиля...</div> // Или более красивый скелетон/спиннер
	}

	if (!isAuthenticated || !user) {
		// Эта проверка дублирует useEffect, но полезна для моментального рендера,
		// пока useEffect еще не отработал или если пользователь разлогинился.
		// Можно просто вернуть null или заглушку, так как редирект уже в пути.
		return null
	}

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4'>Профиль пользователя</h1>
			<p>Добро пожаловать, {user.email}!</p>
			<p>ID пользователя: {user.id}</p>
			{/* Здесь будет остальная информация о профиле и его финансовой составляющей */}

			{/* Пример отображения user_metadata, если они есть */}
			{user.user_metadata && (
				<pre className='mt-4 p-2 bg-surface border border-border rounded'>
					{JSON.stringify(user.user_metadata, null, 2)}
				</pre>
			)}
		</div>
	)
}
