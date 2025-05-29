// 'use client'

// import { ToastContainer, useToasts } from '@service-suite/ui'
// import { Inter } from 'next/font/google'
// import Footer from './components/layout/Footer'
// import './globals.css'

// import {
// 	Header as AppHeader,
// 	UserProfileProps as UserProfile,
// } from '@service-suite/ui'

// import { useRouter } from 'next/navigation'

// import { createSupabaseBrowserClient } from '@/lib/supabase/client'
// import {
// 	AuthManager,
// 	signOut as signOutFromSupabase,
// 	useAuth,
// } from '@service-suite/auth-logic'
// import CookiesBanner from './components/CookiesBanner'

// const inter = Inter({
// 	subsets: ['latin'],
// })

// const supabase = createSupabaseBrowserClient()

// function AppContent({ children }: { children: React.ReactNode }) {
// 	const { addToast } = useToasts()
// 	const router = useRouter()

// 	const { user, isLoading } = useAuth()

// 	const toasts = useToasts().toasts
// 	const dismissToast = useToasts().dismissToast

// 	const handleLogin = () => {
// 		router.push('/login')
// 	}
// 	const handleRegister = () => {
// 		router.push('/register')
// 	}
// 	const handleProfile = () => {
// 		router.push('/profile')
// 	}
// 	const handleLogout = async () => {
// 		const { error } = await signOutFromSupabase(supabase)
// 		if (error) {
// 			addToast({
// 				type: 'error',
// 				message: `Ошибка выхода: ${error.message}`,
// 			})
// 		} else {
// 			addToast({
// 				type: 'success',
// 				message: 'Вы вышли из системы',
// 			})
// 			router.push('/')
// 		}
// 	}

// 	if (isLoading) {
// 		return <div>Loading...</div>
// 	}

// 	const currentUserProfile: UserProfile | null = user
// 		? {
// 				name: user.email,
// 				avatarUrl: user.user_metadata?.avatar_url,
// 			}
// 		: null

// 	return (
// 		<>
// 			<AppHeader
// 				logoText='Postmaster AI'
// 				user={currentUserProfile}
// 				onLoginClick={handleLogin}
// 				onRegisterClick={handleRegister}
// 				onProfileClick={handleProfile}
// 				onLogoutClick={handleLogout}
// 			/>
// 			<main className='container mx-auto p-4 flex-grow'>{children}</main>
// 			<Footer />
// 			<ToastContainer
// 				toasts={toasts}
// 				onDismissToast={dismissToast}
// 				position='center-center'
// 			/>
// 			<ToastContainer
// 				toasts={toasts}
// 				onDismissToast={dismissToast}
// 				position='top-right'
// 			/>
// 		</>
// 	)
// }

// export default function RootLayout({
// 	children,
// }: Readonly<{
// 	children: React.ReactNode
// }>) {
// 	return (
// 		<html lang='en'>
// 			<body className={` ${inter.className} flex flex-col min-h-screen`}>
// 				<AuthManager supabase={supabase}>
// 					<AppContent>{children}</AppContent>
// 				</AuthManager>
// 				<CookiesBanner />
// 			</body>
// 		</html>
// 	)
// }

// apps/postmaster-ai/src/app/[locale]/layout.tsx
'use client' // Делаем этот layout клиентским, так как он будет использовать I18nProviderClient
// и содержит другие клиентские компоненты/логику

import { Inter } from 'next/font/google'
// Убедитесь, что относительные пути к этим компонентам корректны из директории [locale]
// Если components/layout/Footer находится в app/components/layout/Footer, то путь будет ../components/layout/Footer
import { I18nProviderClient } from '@/lib/i18n/client'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
	AuthManager,
	signOut as signOutFromSupabase,
	useAuth,
} from '@service-suite/auth-logic'
import {
	Header as AppHeader,
	ToastContainer,
	UserProfileProps as UserProfile,
	useToasts,
} from '@service-suite/ui'
import { useRouter } from 'next/navigation'
import React from 'react'
import CookiesBanner from './components/CookiesBanner'
import Footer from './components/layout/Footer'
import './globals.css' // Аналогично, путь к globals.css

const inter = Inter({ subsets: ['latin'] })

// Этот компонент будет содержать основную часть вашего UI,
// чтобы избежать передачи locale через слишком много уровней пропсов вручную.
// Он будет рендериться внутри I18nProviderClient.
function AppMainContent({ children }: { children: React.ReactNode }) {
	const { addToast } = useToasts() // Предполагаем, что ToastProvider настроен
	const router = useRouter()
	const { user, isLoading } = useAuth()
	const supabase = createSupabaseBrowserClient()

	const toasts = useToasts().toasts
	const dismissToast = useToasts().dismissToast

	const handleLogin = () => router.push('/login') // next-international middleware позаботится о префиксе локали
	const handleRegister = () => router.push('/register')
	const handleProfile = () => router.push('/profile')
	const handleLogout = async () => {
		const { error } = await signOutFromSupabase(supabase)
		if (error) {
			addToast({ type: 'error', message: `Ошибка выхода: ${error.message}` })
		} else {
			addToast({ type: 'success', message: 'Вы вышли из системы' })
			router.push('/')
			router.refresh()
		}
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				Loading app state...
			</div>
		)
	}

	const currentUserProfile: UserProfile | null = user
		? { name: user.email, avatarUrl: user.user_metadata?.avatar_url }
		: null

	return (
		<>
			<AppHeader
				logoText='Postmaster AI' // TODO: Перевести этот текст позже
				user={currentUserProfile}
				onLoginClick={handleLogin}
				onRegisterClick={handleRegister}
				onProfileClick={handleProfile}
				onLogoutClick={handleLogout}
			/>
			<main className='container mx-auto p-4 flex-grow'>{children}</main>
			<Footer /> {/* TODO: Перевести содержимое Footer позже */}
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

// Тип для пропсов нашего Layout
interface LocaleLayoutProps {
	children: React.ReactNode
	params: { locale: string } // Next.js автоматически передаст сюда 'locale' из URL
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
	const supabaseClient = createSupabaseBrowserClient()

	return (
		// Оборачиваем все в I18nProviderClient и передаем текущую локаль

		<html lang='ru'>
			<body
				className={`${inter.className} flex flex-col min-h-screen bg-background text-text-base`}
			>
				{/* I18nProviderClient теперь здесь, оборачивает AuthManager и все, что ниже */}
				<I18nProviderClient locale='ru'>
					{/* React.Suspense может понадобиться, если I18nProviderClient или его контент асинхронно загружает локали */}
					{/* Fallback может быть null или легковесный лоадер, чтобы не вызывать сдвигов */}
					<React.Suspense fallback={<div>Loading translations...</div>}>
						{' '}
						{/* Или просто null */}
						<AuthManager supabase={supabaseClient}>
							<AppMainContent>{children}</AppMainContent>
						</AuthManager>
						<CookiesBanner />
					</React.Suspense>
				</I18nProviderClient>
			</body>
		</html>
	)
}
