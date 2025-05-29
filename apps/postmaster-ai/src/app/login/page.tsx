// apps/postmaster-ai/src/app/[locale]/login/page.tsx
'use client'

import { useRouter } from 'next/navigation' // Для App Router
import { useState } from 'react'
// Убедитесь, что импорты из вашего UI пакета и i18n настроек корректны
import { useScopedI18nClient } from '@/lib/i18n/client' // Наш клиентский хук i18n
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
	AuthForm,
	type AuthCredentials,
	type AuthFormTranslations,
} from '@service-suite/ui/src/components/auth/AuthForm' // Проверьте этот путь!
import { useToasts } from '@service-suite/ui/src/hooks/useToasts' // Проверьте этот путь!
import Link from 'next/link' // Для ссылки на регистрацию

export default function LoginPage() {
	const router = useRouter()
	const tAuthForm = useScopedI18nClient('authForm') // Получаем 't' функцию для скоупа 'authForm'
	const { addToast } = useToasts()

	const [isLoading, setIsLoading] = useState(false)
	const supabase = createSupabaseBrowserClient()

	const handleLogin = async (credentials: AuthCredentials) => {
		setIsLoading(true)
		if (!credentials.password) {
			// Пароль обязателен для логина
			addToast({ type: 'error', message: 'Пожалуйста, введите пароль.' }) // TODO: Перевести эту строку
			setIsLoading(false)
			return
		}
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: credentials.email,
				password: credentials.password,
			})

			if (error) {
				// TODO: Перевести сообщения об ошибках Supabase, если это возможно/нужно
				addToast({ type: 'error', message: `Ошибка входа: ${error.message}` })
			} else {
				addToast({ type: 'success', message: 'Вход выполнен успешно!' }) // TODO: Перевести
				router.push('/') // Перенаправляем на главную (или дашборд)
				router.refresh() // Обновить данные сессии на стороне сервера
			}
		} catch (e: unknown) {
			console.log('Login error:', e)

			addToast({
				type: 'error',
				message: `Непредвиденная ошибка`,
			}) // TODO: Перевести
		}
		setIsLoading(false)
	}

	// Собираем объект с переводами для AuthForm, используя нашу 't' функцию
	const authFormTranslations: AuthFormTranslations = {
		usernameLabel: tAuthForm('usernameLabel'), // Не используется для логина, но тип требует
		usernamePlaceholder: tAuthForm('usernamePlaceholder'), // Не используется
		emailLabel: tAuthForm('emailLabel'),
		emailPlaceholder: tAuthForm('emailPlaceholder'),
		passwordLabel: tAuthForm('passwordLabel'),
		passwordPlaceholder: tAuthForm('passwordPlaceholder'),
		confirmPasswordLabel: tAuthForm('confirmPasswordLabel'), // Не используется
		loginButton: tAuthForm('loginButton'),
		registerButton: tAuthForm('registerButton'), // Не используется для текста кнопки, но может быть для ссылки
		processingButton: tAuthForm('processingButton'),
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen py-12 bg-background'>
			{' '}
			{/* Пример использования Tailwind классов */}
			<div className='w-full max-w-md p-8 space-y-8 bg-surface shadow-xl rounded-lg'>
				{' '}
				{/* Пример */}
				<div>
					{/* Заголовок страницы тоже можно перевести, если есть ключ в локалях */}
					<h2 className='mt-6 text-center text-3xl font-extrabold text-text-base'>
						{tAuthForm('loginButton')}{' '}
						{/* Используем текст кнопки входа как заголовок */}
					</h2>
				</div>
				<AuthForm
					formType='login'
					onSubmit={handleLogin}
					isLoading={isLoading}
					translations={authFormTranslations} // Передаем объект с переводами
				>
					{/* Дополнительные ссылки под формой */}
					<div className='text-sm text-center mt-4'>
						<span className='text-text-muted'>
							{tAuthForm('noAccountPrompt')}{' '}
						</span>
						<Link
							href='/register'
							className='font-medium text-primary hover:underline'
						>
							{tAuthForm('signUpLinkText')}
						</Link>
					</div>
				</AuthForm>
			</div>
		</div>
	)
}
