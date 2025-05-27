// packages/auth-logic/src/AuthManager.tsx
'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import React, { useEffect } from 'react'
import { useAuthStore } from './useAuthStore'

interface AuthManagerProps {
	supabase: SupabaseClient
	children: React.ReactNode // Позволит использовать его как провайдер-обертку
}

export const AuthManager: React.FC<AuthManagerProps> = ({
	supabase,
	children,
}) => {
	const { setUserAndSession, setLoading, setProfile } = useAuthStore()

	useEffect(() => {
		const fetchProfile = async (userId: string) => {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.single()
			if (error) {
				console.error('Ошибка при получении профиля:', error.message)
				setProfile(null)
			}
			setProfile(data || null)
		}

		setLoading(true)
		// Получаем текущую сессию при монтировании
		supabase.auth.getSession().then(({ data: { session } }) => {
			const user = session?.user ?? null
			setUserAndSession(user, session)
			if (user) {
				// Если пользователь есть, загружаем его профиль
				fetchProfile(user.id)
			} else {
				setProfile(null) // Если пользователя нет, профиль тоже null
			}
			setLoading(false)
		})

		// Новый, исправленный код
		const {
			data: { subscription: authSubscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUserAndSession(session?.user ?? null, session)
			setLoading(false)
		})

		return () => {
			authSubscription?.unsubscribe() // Теперь отписываемся от subscription
		}
	}, [supabase, setUserAndSession, setLoading])

	return <>{children}</> // Просто рендерим дочерние элементы
}

// Удобный хук для доступа к состоянию аутентификации
export const useAuth = () => {
	const { user, profile, session, isLoading } = useAuthStore()
	return { user, profile, session, isAuthenticated: !!user, isLoading }
}
