// apps/postmaster-ai/src/app/register/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
// Убедитесь, что пути импорта корректны
import { useScopedI18nClient } from '@/lib/i18n/client' // Наш клиентский хук i18n
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
	AuthForm,
	type AuthCredentials,
	type AuthFormTranslations,
} from '@service-suite/ui/src/components/auth/AuthForm'
import { useToasts } from '@service-suite/ui/src/hooks/useToasts'
import Link from 'next/link'

export default function RegisterPage() {
	const router = useRouter()
	const tAuthForm = useScopedI18nClient('authForm') // Получаем 't' функцию
	const { addToast } = useToasts()

	const [isLoading, setIsLoading] = useState(false)
	const supabase = createSupabaseBrowserClient()

	const handleRegister = async (credentials: AuthCredentials) => {
		setIsLoading(true)
		if (credentials.password !== credentials.confirmPassword) {
			addToast({ type: 'error', message: 'Пароли не совпадают!' }) // TODO: Перевести
			setIsLoading(false)
			return
		}
		if (!credentials.password) {
			addToast({ type: 'error', message: 'Пароль обязателен.' }) // TODO: Перевести
			setIsLoading(false)
			return
		}

		try {
			const { error } = await supabase.auth.signUp({
				email: credentials.email,
				password: credentials.password,
				options: {
					// Вы можете передать 'name' в user_metadata, если хотите
					data: {
						name: credentials.name,
						// другие данные для таблицы profiles при создании пользователя,
						// если у вас настроены триггеры или вы их обработаете позже
					},
				},
			})

			if (error) {
				addToast({
					type: 'error',
					message: `Ошибка регистрации: ${error.message}`,
				}) // TODO: Перевести
			} else {
				addToast({
					type: 'success',
					message:
						'Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения.',
				}) // TODO: Перевести
				router.push('/login') // Или на страницу "проверьте почту"
			}
		} catch (e: unknown) {
			console.error('Registration error:', e)
			addToast({
				type: 'error',
				message: `Непредвиденная ошибка`,
			}) // TODO: Перевести
		}
		setIsLoading(false)
	}

	// Собираем объект с переводами для AuthForm
	const authFormTranslations: AuthFormTranslations = {
		usernameLabel: tAuthForm('usernameLabel'),
		usernamePlaceholder: tAuthForm('usernamePlaceholder'),
		emailLabel: tAuthForm('emailLabel'),
		emailPlaceholder: tAuthForm('emailPlaceholder'),
		passwordLabel: tAuthForm('passwordLabel'),
		passwordPlaceholder: tAuthForm('passwordPlaceholder'),
		confirmPasswordLabel: tAuthForm('confirmPasswordLabel'),
		loginButton: tAuthForm('loginButton'), // Нужен для типа, но не для текста кнопки
		registerButton: tAuthForm('registerButton'),
		processingButton: tAuthForm('processingButton'),
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen py-12 bg-background'>
			<div className='w-full max-w-md p-8 space-y-8 bg-surface shadow-xl rounded-lg'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-text-base'>
						{tAuthForm('registerButton')} {/* Заголовок страницы */}
					</h2>
				</div>
				<AuthForm
					formType='register' // <--- Тип формы для регистрации
					onSubmit={handleRegister}
					isLoading={isLoading}
					translations={authFormTranslations} // <--- Передаем переводы
				>
					<div className='text-sm text-center mt-4'>
						<span className='text-text-muted'>Уже есть аккаунт? </span>
						{/* TODO: Перевести */}
						<Link
							href='/login'
							className='font-medium text-primary hover:underline'
						>
							Войти {/* TODO: Перевести */}
						</Link>
					</div>
				</AuthForm>
			</div>
		</div>
	)
}
