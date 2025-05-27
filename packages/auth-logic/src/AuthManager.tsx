// packages/auth-logic/src/AuthManager.tsx
'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import React, { useEffect } from 'react'
import { useAuthStore } from './useAuthStore'

interface AuthManagerProps {
	supabase: SupabaseClient
	children: React.ReactNode
}

export const AuthManager: React.FC<AuthManagerProps> = ({
	supabase,
	children,
}) => {
	const { setUserAndSession, setLoading, setProfile, fetchProfile } =
		useAuthStore()

	useEffect(() => {
		setLoading(true)

		const loadSessionAndProfile = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			const user = session?.user ?? null
			setUserAndSession(user, session)
			if (user) {
				await fetchProfile(supabase, user.id)
			} else {
				setProfile(null)
			}
			setLoading(false)
		}
		loadSessionAndProfile()

		const {
			data: { subscription: authSubscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			const user = session?.user ?? null
			setUserAndSession(user, session)
			if (user) {
				await fetchProfile(supabase, user.id)
			} else {
				setProfile(null)
			}
			setLoading(false)
		})

		return () => {
			authSubscription?.unsubscribe()
		}
	}, [supabase, setUserAndSession, setLoading, setProfile, fetchProfile])

	return <>{children}</>
}

// Удобный хук для доступа к состоянию аутентификации и профиля
export const useAuth = () => {
	const { user, profile, session, isLoading } = useAuthStore()
	return { user, profile, session, isAuthenticated: !!user, isLoading }
}
