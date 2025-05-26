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
	const { setUserAndSession, setLoading } = useAuthStore()

	useEffect(() => {
		setLoading(true)
		// Получаем текущую сессию при монтировании
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUserAndSession(session?.user ?? null, session)
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
	const { user, session, isLoading } = useAuthStore()
	return { user, session, isAuthenticated: !!user, isLoading }
}
