'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAuth } from '@service-suite/auth-logic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { RequestLimitForm } from './components/RequestLimitForm'

export default function BillingPage() {
	const { profile, isAuthenticated, isLoading } = useAuth()
	const router = useRouter()
	const [used, setUsed] = useState<number>(0)
	const [isLoadingDocs, setIsLoadingDocs] = useState(true)
	const supabase = createSupabaseBrowserClient()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace('/login?message=unauthorized')
		}
	}, [isLoading, isAuthenticated, router])

	useEffect(() => {
		// Подсчитываем использованные документы
		const fetchDocsCount = async () => {
			if (!profile?.id) return
			setIsLoadingDocs(true)
			const { count } = await supabase
				.from('documents')
				.select('id', { count: 'exact', head: true })
				.eq('user_id', profile.id)
			setUsed(count || 0)
			setIsLoadingDocs(false)
		}
		if (profile?.id) fetchDocsCount()
	}, [profile?.id, supabase])

	if (isLoading || isLoadingDocs) {
		return <div className='py-10 text-center text-text-muted'>Загрузка…</div>
	}
	if (!isAuthenticated || !profile) {
		return null
	}

	const limit = profile.documents_limit ?? 3
	const left = Math.max(limit - used, 0)
	const limitReached = left <= 0

	return (
		<div className='max-w-lg mx-auto py-10'>
			<h1 className='text-2xl font-bold mb-4'>Лимиты и оплата</h1>
			<div className='mb-3 text-lg'>
				Ваш лимит документов: <b>{limit}</b>
				<br />
				Использовано: <b>{used}</b>
				<br />
				Осталось: <b>{left}</b>
			</div>

			{limitReached && (
				<div className='mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200 text-center'>
					<div className='mb-2 font-semibold'>
						Лимит документов исчерпан. Чтобы получить больше, отправьте заявку.
					</div>
					<RequestLimitForm userId={profile.id} email={profile.email} />
				</div>
			)}

			{/* Под кнопками оплаты данный текст */}
			{/* <div className="mt-4 text-xs text-text-muted text-center">
  By proceeding you accept our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
</div> */}
		</div>
	)
}
