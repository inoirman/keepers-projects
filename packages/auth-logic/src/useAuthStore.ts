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

export const useAuthStore = create<AuthState>((set, get) => ({
	// Добавил get для доступа к текущему состоянию
	user: null,
	profile: null,
	session: null,
	isLoading: true,
	setUserAndSession: (user, session) => {
		set({ user, session, isLoading: false })
	},
	setLoading: isLoading => {
		set({ isLoading })
	},
	setProfile: profile => {
		set({ profile })
	},
	fetchProfile: async (supabase, userId) => {
		try {
			// Добавим try-catch для большей надежности
			const { data, error, status } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.maybeSingle()

			if (error && status !== 406) {
				set({ profile: null })
			} else {
				set({ profile: data || null })
			}
		} catch (e) {
			set({ profile: null })
		}
	},
}))
