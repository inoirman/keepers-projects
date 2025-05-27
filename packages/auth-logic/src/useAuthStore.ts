import type { Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

export interface Profile {
	id: string // UUID пользователя (primary key)
	name: string | null // Имя (может быть пустым)
	email: string // Email пользователя
	documents_limit: number // Лимит документов (например, 100)
	created_at: string // ISO-дата создания профиля (timestamptz как строка)
}

interface AuthState {
	user: User | null
	profile: Profile | null // добавляем профиль
	session: Session | null
	isLoading: boolean
	setUserAndSession: (user: User | null, session: Session | null) => void
	setLoading: (isLoading: boolean) => void
	setProfile: (profile: Profile | null) => void
}

export const useAuthStore = create<AuthState>(set => ({
	user: null,
	profile: null, // добавляем профиль
	session: null,
	isLoading: true,
	setUserAndSession: (user, session) =>
		set({ user, session, isLoading: false }),
	setLoading: isLoading => set({ isLoading }),
	setProfile: profile => set({ profile }), // экшн для профиля
}))
