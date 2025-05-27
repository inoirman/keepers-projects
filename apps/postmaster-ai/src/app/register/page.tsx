// apps/postmaster-ai/src/app/register/page.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Наши UI компоненты и типы
import {
	AuthCard,
	AuthCredentials,
	AuthForm,
	useToasts,
} from '@service-suite/ui'

// Логика аутентификации
import { createSupabaseBrowserClient } from '@/lib/supabase/client' // Клиент Supabase из нашего приложения
import { signUpWithEmail } from '@service-suite/auth-logic'

// Метаданные для страницы (если нужно)
// import type { Metadata } from 'next';
// export const metadata: Metadata = { title: 'Регистрация - PostmasterAI' };

export default function RegisterPage() {
	const router = useRouter()
	const { addToast } = useToasts()
	const supabase = createSupabaseBrowserClient()
	const [isLoading, setIsLoading] = useState(false)

	const handleRegisterSubmit = async (credentials: AuthCredentials) => {
		setIsLoading(true)

		if (
			!credentials.password ||
			credentials.password !== credentials.confirmPassword
		) {
			addToast({
				message: 'Пароли не совпадают или не введены.',
				type: 'error',
			})
			setIsLoading(false)
			return
		}

		const response = await signUpWithEmail(supabase, {
			email: credentials.email,
			password: credentials.password,
			// Тут можно передавать options, если нужно, например, data для профиля
			// options: { data: { full_name: 'Test User' } }
		})

		if (response.success) {
			const user = response.data?.user
			if (user) {
				await supabase.from('profiles').upsert({
					id: user.id,
					name: credentials.name, // Сохраняем имя пользователя
					email: credentials.email, // Сохраняем email
				})
			}

			addToast({
				message: response.data?.session
					? 'Вы успешно зарегистрированы и вошли в систему!'
					: 'Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения.',
				type: 'success',
				duration: 7000, // Даем больше времени прочитать, если нужно подтверждение
			})

			if (response.data?.session) {
				// Пользователь сразу вошел (например, email confirmation отключен в Supabase)
				router.push('/profile') // Или на главную, или куда настроено
			} else {
				// Требуется подтверждение email
				// Можно перенаправить на страницу логина с сообщением или оставить здесь
				router.push('/login?message=confirm-email')
			}
		} else {
			addToast({
				message: `Ошибка регистрации: ${response.error?.message || 'Неизвестная ошибка'}`,
				type: 'error',
			})
		}
		setIsLoading(false)
	}

	return (
		<AuthCard
			title='Создание аккаунта'
			footerContent={
				<>
					Уже есть аккаунт?{' '}
					<Link
						href='/login'
						className='font-medium text-primary hover:opacity-80 transition-opacity'
					>
						Войти
					</Link>
				</>
			}
		>
			<AuthForm
				formType='register'
				onSubmit={handleRegisterSubmit}
				isLoading={isLoading}
				submitButtonText='Зарегистрироваться'
			/>
		</AuthCard>
	)
}
