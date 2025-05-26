'use client'

import { ToastContainer, useToasts } from '@service-suite/ui'
import { Inter } from 'next/font/google'
import Footer from './components/layout/Footer'
import './globals.css'

import {
	Header as AppHeader,
	UserProfileProps as UserProfile,
} from '@service-suite/ui'

import { useRouter } from 'next/navigation'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
	AuthManager,
	signOut as signOutFromSupabase,
	useAuth,
} from '@service-suite/auth-logic'

const inter = Inter({
	subsets: ['latin'],
})

function AppContent({ children }: { children: React.ReactNode }) {
	const { addToast } = useToasts()
	const router = useRouter()
	const supabase = createSupabaseBrowserClient()
	const { user, isLoading } = useAuth()

	const toasts = useToasts().toasts
	const dismissToast = useToasts().dismissToast

	const handleLogin = () => {
		router.push('/login')
	}
	const handleRegister = () => {
		router.push('/register')
	}
	const handleProfile = () => {
		router.push('/profile')
	}
	const handleLogout = async () => {
		const { error } = await signOutFromSupabase(supabase)
		if (error) {
			addToast({
				type: 'error',
				message: `Ошибка выхода: ${error.message}`,
			})
		} else {
			addToast({
				type: 'success',
				message: 'Вы вышли из системы',
			})
			router.push('/')
		}
	}

	if (isLoading) {
		return <div>Loading...</div>
	}

	const currentUserProfile: UserProfile | null = user
		? {
				name: user.email,
				avatarUrl: user.user_metadata?.avatar_url,
			}
		: null

	return (
		<>
			<AppHeader
				logoText='Postmaster AI'
				user={currentUserProfile}
				onLoginClick={handleLogin}
				onRegisterClick={handleRegister}
				onProfileClick={handleProfile}
				onLogoutClick={handleLogout}
			/>
			<main className='container mx-auto p-4 flex-grow'>{children}</main>
			<Footer />
			<ToastContainer
				toasts={toasts}
				onDismissToast={dismissToast}
				position='center-center'
			/>
			<ToastContainer
				toasts={toasts}
				onDismissToast={dismissToast}
				position='top-right'
			/>
		</>
	)
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const supabase = createSupabaseBrowserClient()

	return (
		<html lang='en'>
			<body className={` ${inter.className} flex flex-col min-h-screen`}>
				<AuthManager supabase={supabase}>
					<AppContent>{children}</AppContent>
				</AuthManager>
			</body>
		</html>
	)
}
