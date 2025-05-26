'use client'

import React from 'react'

import Link from 'next/link'

export interface UserProfileProps {
	name?: string
	avatarUrl?: string
}

export interface HeaderProps {
	logoText: string
	logoHref?: string
	user?: UserProfileProps | null
	navItems?: React.ReactNode
	onLoginClick?: () => void
	onLogoutClick?: () => void
	onRegisterClick?: () => void
	onProfileClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({
	logoText,
	logoHref = '/',
	user,
	navItems,
	onLoginClick,
	onLogoutClick,
	onRegisterClick,
	onProfileClick,
}) => {
	return (
		<header className='bg-primary text-text-on-primary p-4 shadow-md'>
			{' '}
			{/* Добавил shadow-md для примера */}
			<div className='container mx-auto flex justify-between items-center'>
				<Link href={logoHref} className='text-xl font-bold hover:opacity-80'>
					{logoText}
				</Link>
				<nav className='flex items-center space-x-4'>
					{user ? (
						<>
							{user.avatarUrl && (
								<img
									src={user.avatarUrl}
									alt={user.name || 'Аватар пользователя'}
									className='w-8 h-8 rounded-full object-cover'
								/>
							)}
							{onProfileClick && (
								<button
									onClick={onProfileClick}
									className='hover:opacity-80 transition-opacity'
									aria-label='Профиль'
								>
									{user.name || 'Профиль'}
								</button>
							)}
							{navItems} {/* Дополнительные элементы навигации, если есть */}
							{onLogoutClick && (
								<button
									onClick={onLogoutClick}
									className='hover:opacity-80 transition-opacity'
								>
									Выйти
								</button>
							)}
						</>
					) : (
						<>
							{navItems} {/* Дополнительные элементы навигации, если есть */}
							{onLoginClick && (
								<button
									onClick={onLoginClick}
									className='hover:opacity-80 transition-opacity'
								>
									Войти
								</button>
							)}
							{onRegisterClick && (
								<button
									onClick={onRegisterClick}
									className='hover:opacity-80 transition-opacity'
								>
									Регистрация
								</button>
							)}
						</>
					)}
				</nav>
			</div>
		</header>
	)
}
