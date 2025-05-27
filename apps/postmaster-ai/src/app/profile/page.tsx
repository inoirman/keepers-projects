'use client'

import { useAuth } from '@service-suite/auth-logic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
	const { user, profile, isAuthenticated, isLoading } = useAuth()
	const router = useRouter()
	// const [copyStatus, setCopyStatus] = useState('')

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace('/login?message=unauthorized')
		}
	}, [isLoading, isAuthenticated, router])

	// const handleCopyId = () => {
	// 	if (!user?.id) return
	// 	navigator.clipboard.writeText(user.id)
	// 	setCopyStatus('ID скопирован!')
	// 	setTimeout(() => setCopyStatus(''), 1500)
	// }

	// if (isLoading) {
	// 	return (
	// 		<div className='py-10 text-center text-text-muted'>
	// 			Загрузка профиля...
	// 		</div>
	// 	)
	// }

	if (!isAuthenticated || !user) {
		return null
	}

	return (
		<div className='max-w-lg mx-auto py-10'>
			<h1 className='text-2xl font-bold mb-4'>Личный кабинет</h1>
			<div className='bg-surface p-6 rounded-xl shadow space-y-4 mb-6'>
				<div className='flex flex-col gap-1'>
					<span className='text-sm text-text-muted'>Имя:</span>
					<span className='font-semibold text-lg'>
						{profile?.name || 'Без имени'}
					</span>
				</div>
				<div className='flex flex-col gap-1'>
					<span className='text-sm text-text-muted'>Email:</span>
					<span className='text-base'>{user.email}</span>
				</div>
				{/* <div className='flex flex-row items-center gap-2'>
					<span className='text-sm text-text-muted'>ID пользователя:</span>
					<span className='text-xs font-mono bg-background px-2 py-1 rounded'>
						{user.id}
					</span>
					<button
						className='text-xs px-2 py-1 bg-primary text-text-on-primary rounded hover:opacity-80'
						onClick={handleCopyId}
					>
						Скопировать
					</button>
					{copyStatus && (
						<span className='text-green-600 text-xs'>{copyStatus}</span>
					)}
				</div> */}
				<div className='flex flex-col gap-1'>
					<span className='text-sm text-text-muted'>Лимит документов:</span>
					<span className='text-base'>{profile?.documents_limit ?? 3}</span>
				</div>
				<div className='flex flex-col gap-1'>
					<span className='text-sm text-text-muted'>Дата регистрации:</span>
					<span className='text-base'>
						{profile?.created_at
							? new Date(profile.created_at).toLocaleDateString()
							: '—'}
					</span>
				</div>
			</div>
			{/* Можно добавить блок с количеством документов/черновиков, когда появится */}
			<div className='mb-6'>
				<div className='text-text-muted text-sm'>В будущем здесь появится:</div>
				<ul className='list-disc ml-5 text-text-muted text-sm'>
					<li>Баланс аккаунта и история операций</li>
					<li>Тарифы и пополнение баланса</li>
					<li>Настройки уведомлений</li>
					<li>...и многое другое</li>
				</ul>
			</div>
			<Link
				href='/documents'
				className='inline-block px-5 py-2 rounded-lg bg-primary text-text-on-primary font-semibold hover:opacity-90 transition'
			>
				Перейти к документам →
			</Link>
		</div>
	)
}
