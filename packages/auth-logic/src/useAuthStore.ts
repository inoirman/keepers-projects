// packages/auth-logic/src/useAuthStore.ts
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { create } from 'zustand'

export interface Profile {
	id: string // UUID пользователя (primary key)
	name: string | null
	email: string
	documents_limit: number
	created_at: string
}

interface AuthState {
	user: User | null
	profile: Profile | null
	session: Session | null
	isLoading: boolean
	setUserAndSession: (user: User | null, session: Session | null) => void
	setLoading: (isLoading: boolean) => void
	setProfile: (profile: Profile | null) => void
	// <-- Вот эта функция новая!
	fetchProfile: (supabase: SupabaseClient, userId: string) => Promise<void>
}

export const useAuthStore = create<AuthState>(set => ({
	user: null,
	profile: null,
	session: null,
	isLoading: true,
	setUserAndSession: (user, session) =>
		set({ user, session, isLoading: false }),
	setLoading: isLoading => set({ isLoading }),
	setProfile: profile => set({ profile }),
	fetchProfile: async (supabase, userId) => {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.maybeSingle()
		if (error) {
			console.error('Ошибка при получении профиля:', error.message)
			set({ profile: null })
		} else {
			set({ profile: data || null })
		}
	},
}))
