// packages/ui/src/components/auth/AuthCard.tsx
'use client'
import React from 'react'

interface AuthCardProps {
	title: string
	children: React.ReactNode // Сюда будет вставлена AuthForm или другой контент
	footerContent?: React.ReactNode // Для ссылки типа "Нет аккаунта? Зарегистрироваться"
}

export const AuthCard: React.FC<AuthCardProps> = ({
	title,
	children,
	footerContent,
}) => {
	return (
		// Используем Tailwind классы и наши кастомные цвета (через CSS переменные)
		// Например, bg-surface, text-text-base и т.д.
		<div className='flex flex-col items-center justify-center py-10 sm:py-12 md:py-16'>
			{' '}
			{/* Отступы для центрирования */}
			<div className='w-full max-w-md p-6 sm:p-8 space-y-6 bg-surface rounded-lg shadow-xl text-text-base'>
				<h2 className='text-xl sm:text-2xl font-bold text-center text-text-base'>
					{title}
				</h2>
				{children} {/* Место для формы */}
				{footerContent && (
					<div className='mt-6 pt-4 border-t border-border'>
						{' '}
						{/* Разделитель, если есть футер */}
						<p className='text-sm text-center text-text-muted'>
							{footerContent}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
