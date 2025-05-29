// // packages/ui/src/components/auth/AuthForm.tsx
// 'use client'
// import React from 'react'

// export interface AuthCredentials {
// 	email: string
// 	password?: string // Пароль может быть опциональным, если форма для чего-то другого (например, OAuth старт)
// 	confirmPassword?: string
// 	name: string
// }

// interface AuthFormProps {
// 	formType: 'login' | 'register'
// 	onSubmit: (credentials: AuthCredentials) => void // Колбэк при отправке формы
// 	isLoading?: boolean // Для отображения состояния загрузки на кнопке
// 	submitButtonText?: string // Кастомный текст для кнопки отправки
// 	children?: React.ReactNode // Слот для дополнительных элементов внутри формы (например, "Забыли пароль?")
// }

// export const AuthForm: React.FC<AuthFormProps> = ({
// 	formType,
// 	onSubmit,
// 	isLoading = false,
// 	submitButtonText,
// 	children,
// }) => {
// 	const [email, setEmail] = React.useState('')
// 	const [password, setPassword] = React.useState('')
// 	const [confirmPassword, setConfirmPassword] = React.useState('')
// 	const [name, setName] = React.useState('')

// 	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
// 		event.preventDefault()
// 		// Валидацию совпадения паролей лучше делать в вызывающем коде (на странице),
// 		// так как там будет доступ к системе уведомлений (useToasts).
// 		// Либо передавать функцию для показа ошибок как пропс.
// 		// Пока просто собираем данные:
// 		onSubmit({ name, email, password, confirmPassword })
// 	}

// 	const defaultSubmitText =
// 		formType === 'login' ? 'Войти' : 'Зарегистрироваться'

// 	return (
// 		<form onSubmit={handleSubmit} className='space-y-6'>
// 			{formType === 'register' && (
// 				<div>
// 					<label
// 						htmlFor='auth-name'
// 						className='block text-sm font-medium text-text-muted mb-1'
// 					>
// 						Имя пользователя
// 					</label>
// 					<input
// 						id='auth-name'
// 						name='name'
// 						type='text'
// 						autoComplete='name'
// 						required
// 						value={name}
// 						onChange={e => setName(e.target.value)}
// 						className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-base disabled:opacity-70'
// 						placeholder='Ваше имя'
// 						disabled={isLoading}
// 					/>
// 				</div>
// 			)}
// 			<div>
// 				<label
// 					htmlFor='auth-email'
// 					className='block text-sm font-medium text-text-muted mb-1'
// 				>
// 					Электронная почта
// 				</label>
// 				<input
// 					id='auth-email'
// 					name='email'
// 					type='email'
// 					autoComplete='email'
// 					required
// 					value={email}
// 					onChange={e => setEmail(e.target.value)}
// 					className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-base disabled:opacity-70'
// 					placeholder='you@example.com'
// 					disabled={isLoading}
// 				/>
// 			</div>

// 			<div>
// 				<label
// 					htmlFor='auth-password'
// 					className='block text-sm font-medium text-text-muted mb-1'
// 				>
// 					Пароль
// 				</label>
// 				<input
// 					id='auth-password'
// 					name='password'
// 					type='password'
// 					autoComplete={
// 						formType === 'login' ? 'current-password' : 'new-password'
// 					}
// 					required
// 					value={password}
// 					onChange={e => setPassword(e.target.value)}
// 					className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-base disabled:opacity-70'
// 					placeholder='••••••••'
// 					disabled={isLoading}
// 				/>
// 			</div>

// 			{formType === 'register' && (
// 				<div>
// 					<label
// 						htmlFor='auth-confirm-password'
// 						className='block text-sm font-medium text-text-muted mb-1'
// 					>
// 						Подтвердите пароль
// 					</label>
// 					<input
// 						id='auth-confirm-password'
// 						name='confirmPassword'
// 						type='password'
// 						autoComplete='new-password'
// 						required
// 						value={confirmPassword}
// 						onChange={e => setConfirmPassword(e.target.value)}
// 						className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-base disabled:opacity-70'
// 						placeholder='••••••••'
// 						disabled={isLoading}
// 					/>
// 				</div>
// 			)}

// 			{/* Слот для дополнительных элементов, например, "Забыли пароль?" */}
// 			{children}

// 			<div>
// 				<button
// 					type='submit'
// 					disabled={isLoading}
// 					className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-on-primary bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
// 				>
// 					{isLoading ? 'Обработка...' : submitButtonText || defaultSubmitText}
// 				</button>
// 			</div>
// 		</form>
// 	)
// }

// packages/ui/src/components/auth/AuthForm.tsx
'use client' // Компонент формы явно клиентский

import React from 'react' // Убедитесь, что React импортирован

// Интерфейс для данных, которые форма будет возвращать
export interface AuthCredentials {
	email: string
	password?: string
	confirmPassword?: string
	name?: string // Имя опционально, т.к. для логина оно не нужно
}

// Определяем тип для объекта переводов, который будет принимать компонент
// Этот интерфейс должен быть экспортирован, чтобы приложение могло его использовать
export interface AuthFormTranslations {
	usernameLabel: string
	usernamePlaceholder: string
	emailLabel: string
	emailPlaceholder: string
	passwordLabel: string
	passwordPlaceholder: string // Обычно плейсхолдер для пароля и подтверждения одинаковый
	confirmPasswordLabel: string
	loginButton: string
	registerButton: string
	processingButton: string
}

// Пропсы для компонента AuthForm
interface AuthFormProps {
	formType: 'login' | 'register'
	onSubmit: (credentials: AuthCredentials) => void // Колбэк при отправке
	isLoading?: boolean // Для состояния загрузки кнопки
	translations: AuthFormTranslations // <--- НОВЫЙ ПРОПС для всех текстов
	children?: React.ReactNode // Для дополнительных элементов (например, ссылка "Забыли пароль?")
}

export const AuthForm: React.FC<AuthFormProps> = ({
	formType,
	onSubmit,
	isLoading = false,
	translations, // Используем переданные тексты
	children,
}) => {
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [confirmPassword, setConfirmPassword] = React.useState('')
	const [name, setName] = React.useState('')

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const credentialsToSubmit: AuthCredentials = { email, password }
		if (formType === 'register') {
			credentialsToSubmit.name = name
			credentialsToSubmit.confirmPassword = confirmPassword
		}
		onSubmit(credentialsToSubmit)
	}

	// Определяем текст для кнопки на основе переводов
	const submitButtonActiveText =
		formType === 'login'
			? translations.loginButton
			: translations.registerButton

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{formType === 'register' && (
				<div>
					<label
						htmlFor='auth-name'
						className='block text-sm font-medium text-text-muted mb-1'
					>
						{translations.usernameLabel}
					</label>
					<input
						id='auth-name'
						name='name'
						type='text'
						autoComplete='name'
						required
						value={name}
						onChange={e => setName(e.target.value)}
						className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-base disabled:opacity-70'
						placeholder={translations.usernamePlaceholder}
						disabled={isLoading}
					/>
				</div>
			)}
			<div>
				<label
					htmlFor='auth-email'
					className='block text-sm font-medium text-text-muted mb-1'
				>
					{translations.emailLabel}
				</label>
				<input
					id='auth-email'
					name='email'
					type='email'
					autoComplete='email'
					required
					value={email}
					onChange={e => setEmail(e.target.value)}
					className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-base disabled:opacity-70'
					placeholder={translations.emailPlaceholder}
					disabled={isLoading}
				/>
			</div>

			<div>
				<label
					htmlFor='auth-password'
					className='block text-sm font-medium text-text-muted mb-1'
				>
					{translations.passwordLabel}
				</label>
				<input
					id='auth-password'
					name='password'
					type='password'
					autoComplete={
						formType === 'login' ? 'current-password' : 'new-password'
					}
					required
					value={password}
					onChange={e => setPassword(e.target.value)}
					className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-base disabled:opacity-70'
					placeholder={translations.passwordPlaceholder}
					disabled={isLoading}
				/>
			</div>

			{formType === 'register' && (
				<div>
					<label
						htmlFor='auth-confirm-password'
						className='block text-sm font-medium text-text-muted mb-1'
					>
						{translations.confirmPasswordLabel}
					</label>
					<input
						id='auth-confirm-password'
						name='confirmPassword'
						type='password'
						autoComplete='new-password'
						required
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						className='mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-base disabled:opacity-70'
						placeholder={translations.passwordPlaceholder} // Используем тот же плейсхолдер, что и для пароля
						disabled={isLoading}
					/>
				</div>
			)}

			{children}

			<div>
				<button
					type='submit'
					disabled={isLoading}
					className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-on-primary bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
				>
					{isLoading ? translations.processingButton : submitButtonActiveText}
				</button>
			</div>
		</form>
	)
}
