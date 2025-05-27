// components/CookiesBanner.tsx
'use client'
import { useEffect, useState } from 'react'

export default function CookiesBanner() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (!localStorage.getItem('cookiesAccepted')) setVisible(true)
	}, [])

	const acceptCookies = () => {
		localStorage.setItem('cookiesAccepted', 'true')
		setVisible(false)
	}
	const declineCookies = () => {
		localStorage.setItem('cookiesAccepted', 'false')
		setVisible(false)
	}

	if (!visible) return null

	return (
		<div className='fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between shadow-lg'>
			<div>
				<span className='font-medium'>This website uses cookies</span>
				<span className='ml-2 text-sm text-text-muted'>
					We use essential cookies for the operation of the service. Analytics
					cookies are only used with your consent.
				</span>
			</div>
			<div className='flex gap-2 mt-2 sm:mt-0'>
				<button
					className='px-4 py-2 rounded bg-primary text-text-on-primary font-semibold'
					onClick={acceptCookies}
				>
					Accept
				</button>
				<button
					className='px-4 py-2 rounded bg-background border border-border text-text-base font-semibold'
					onClick={declineCookies}
				>
					Decline
				</button>
			</div>
		</div>
	)
}
