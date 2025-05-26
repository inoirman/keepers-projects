import type { Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface AuthState {
	user: User | null
	session: Session | null
	isLoading: boolean
	setUserAndSession: (user: User | null, session: Session | null) => void
	setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>(set => ({
	user: null,
	session: null,
	isLoading: true,
	setUserAndSession: (user, session) =>
		set({ user, session, isLoading: false }),
	setLoading: isLoading => set({ isLoading }),
}))
