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

		const {
			data: { subscription: authSubscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			const user = session?.user ?? null
			const currentUserInStore = useAuthStore.getState().user
			if (
				currentUserInStore?.id !== user?.id ||
				(!currentUserInStore && user) ||
				(currentUserInStore && !user)
			) {
				setUserAndSession(user, session)
				if (user) {
					// await fetchProfile(supabase, user.id)

					fetchProfile(supabase, user.id)
						// 	.then(() => {
						// 		console.log(
						// 			'AuthManager: fetchProfile promise resolved successfully.'
						// 		)
						// 	})
						// 	.catch(err => {
						// 		console.error(
						// 			'AuthManager: fetchProfile promise REJECTED. Error:',
						// 			err
						// 		)
						// 	})
						.finally(() => {
							// 		// <<< ВОТ ЭТО ВАЖНО
							// 		console.log(
							// 			'AuthManager: fetchProfile promise FINALLY executed (regardless of resolve/reject).'
							// 		)
						})
				} else {
					setProfile(null)
				}
			} else {
				// Если сессия обновилась (например, токен), но user тот же, можно обновить только сессию
				if (
					session &&
					useAuthStore.getState().session?.access_token !== session.access_token
				) {
					setUserAndSession(user, session) // Обновит и сессию
				}
			}
			setLoading(false)
		})

		// Проверка начального состояния, если onAuthStateChange не сработал сразу
		// Это нужно, чтобы setLoading(false) вызвался, если пользователь не залогинен и onAuthStateChange не отдает сессию
		// (т.к. onAuthStateChange может вызваться с session=null)
		if (!authSubscription) {
			// Если подписка не создалась (маловероятно)
			setLoading(false)
		}
		//  else {
		// 	// Проверяем, есть ли уже сессия, чтобы сразу снять isLoading, если пользователь не залогинен
		// 	// onAuthStateChange должен почти сразу отработать с null session если пользователь не залогинен.
		// 	// Этот блок может быть избыточен.
		// 	const currentSession = supabase.auth.getSession() // Это синхронный вызов для текущего состояния клиента
		// 	if (!currentSession) {
		// 		// Если клиент еще не знает о сессии
		// 		// setLoading(false); // Осторожно, onAuthStateChange может быть в процессе
		// 	}
		// }

		return () => {
			authSubscription?.unsubscribe()
		}
	}, [supabase, setUserAndSession, setLoading, setProfile, fetchProfile])

	return <>{children}</>
}

export const useAuth = () => {
	const { user, profile, session, isLoading } = useAuthStore()
	return { user, profile, session, isAuthenticated: !!user, isLoading }
}
