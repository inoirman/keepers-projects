import type {
	SignInWithPasswordCredentials,
	SignUpWithPasswordCredentials,
	SupabaseClient,
} from '@supabase/supabase-js'

export interface AuthResponse {
	success: boolean
	error?: { message: string; status?: number }
	data?: any // Можно типизировать более конкретно (User, Session)
}

export async function signUpWithEmail(
	supabase: SupabaseClient,
	credentials: SignUpWithPasswordCredentials
): Promise<AuthResponse> {
	const { data, error } = await supabase.auth.signUp(credentials)

	if (error) {
		return {
			success: false,
			error: { message: error.message, status: error.status },
		}
	}
	return { success: true, data: { user: data.user, session: data.session } }
}

export async function signInWithEmail(
	supabase: SupabaseClient,
	credentials: SignInWithPasswordCredentials
): Promise<AuthResponse> {
	const { data, error } = await supabase.auth.signInWithPassword(credentials)

	if (error) {
		return {
			success: false,
			error: { message: error.message, status: error.status },
		}
	}
	return { success: true, data: { user: data.user, session: data.session } }
}

export async function signOut(supabase: SupabaseClient): Promise<AuthResponse> {
	const { error } = await supabase.auth.signOut()
	if (error) {
		return {
			success: false,
			error: { message: error.message, status: error.status },
		}
	}
	return { success: true }
}
