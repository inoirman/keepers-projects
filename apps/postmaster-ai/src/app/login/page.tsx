// apps/postmaster-ai/src/app/login/page.tsx
'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Наши UI компоненты и типы
import {
	AuthCard,
	AuthCredentials,
	AuthForm,
	useToasts,
} from '@service-suite/ui'

// Логика аутентификации
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { signInWithEmail } from '@service-suite/auth-logic'

// Метаданные для страницы (если нужно)
// import type { Metadata } from 'next';
// export const metadata: Metadata = { title: 'Вход - PostmasterAI' };

export default function LoginPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { addToast } = useToasts()
	const supabase = createSupabaseBrowserClient()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const message = searchParams.get('message')
		if (message === 'confirm-email') {
			addToast({
				message:
					'Пожалуйста, проверьте вашу почту и подтвердите регистрацию, чтобы войти.',
				type: 'info',
				duration: 8000,
			})
		}
		// Тут же можно добавить проверку, если пользователь УЖЕ залогинен,
		// и сразу перенаправлять его на /profile. Это сделаем позже с хуком useAuth.
	}, [searchParams, addToast, router])

	const handleLoginSubmit = async (credentials: AuthCredentials) => {
		setIsLoading(true)

		if (!credentials.password) {
			addToast({ message: 'Пароль не введен.', type: 'error' })
			setIsLoading(false)
			return
		}

		const response = await signInWithEmail(supabase, {
			email: credentials.email,
			password: credentials.password,
		})

		if (response.success && response.data?.user) {
			addToast({ message: 'Вы успешно вошли в систему!', type: 'success' })
			router.push('/profile') // Или на другую страницу после логина
		} else {
			addToast({
				message: `Ошибка входа: ${response.error?.message || 'Неверный email или пароль.'}`,
				type: 'error',
			})
		}
		setIsLoading(false)
	}

	return (
		<AuthCard
			title='Вход в PostmasterAI'
			footerContent={
				<>
					Впервые у нас?{' '}
					<Link
						href='/register'
						className='font-medium text-primary hover:opacity-80 transition-opacity'
					>
						Создать аккаунт
					</Link>
				</>
			}
		>
			<AuthForm
				formType='login'
				onSubmit={handleLoginSubmit}
				isLoading={isLoading}
				submitButtonText='Войти'
			>
				{/* Сюда можно добавить ссылку "Забыли пароль?" если нужно, используя children слот AuthForm */}
				<div className='text-sm text-right mt-2'>
					<Link
						href='/forgot-password'
						className='font-medium text-primary hover:opacity-80 transition-opacity'
					>
						Забыли пароль?
					</Link>
				</div>
			</AuthForm>
		</AuthCard>
	)
}
