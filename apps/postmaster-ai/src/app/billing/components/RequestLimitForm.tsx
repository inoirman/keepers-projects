import { useState } from 'react'

export function RequestLimitForm({
	userId,
	email,
}: {
	userId: string
	email?: string
}) {
	const [reason, setReason] = useState('')
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		const WEBHOOK_URL = process.env.NEXT_PUBLIC_LIMIT_REQUEST_WEBHOOK_URL // .env.local
		e.preventDefault()
		setLoading(true)
		setError(null)
		setSuccess(false)
		try {
			// Можно добавить сюда имя пользователя, e-mail, если нужно
			const payload = {
				user_id: userId,
				email: email ?? '',
				reason,
			}
			const res = await fetch(WEBHOOK_URL as string, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})
			if (res.ok) {
				setSuccess(true)
				setReason('')
			} else {
				setError('Ошибка при отправке заявки.')
			}
		} catch (err) {
			console.error('Request error:', err)
			setError('Ошибка сети или сервера.')
		} finally {
			setLoading(false)
		}
	}

	if (success) {
		return (
			<div className='mt-2 p-3 rounded bg-green-100 text-green-800 border border-green-200'>
				Заявка отправлена! Мы рассмотрим её и свяжемся с вами.
			</div>
		)
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col items-stretch gap-2 mt-2'
		>
			<textarea
				className='p-2 rounded border border-border bg-background text-text-base min-h-[60px] resize-y'
				placeholder='Обоснуйте, почему вам нужно больше документов'
				value={reason}
				onChange={e => setReason(e.target.value)}
				required
				disabled={loading}
			/>
			<button
				type='submit'
				className='px-4 py-2 rounded bg-primary text-text-on-primary font-semibold hover:opacity-90 transition disabled:opacity-60'
				disabled={loading || !reason.trim()}
			>
				{loading ? 'Отправка...' : 'Отправить заявку'}
			</button>
			{error && <div className='text-sm text-red-600'>{error}</div>}
		</form>
	)
}
