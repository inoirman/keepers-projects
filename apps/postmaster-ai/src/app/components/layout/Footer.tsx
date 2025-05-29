import Link from 'next/link'

export default function Footer() {
	const currentYear = new Date().getFullYear()
	return (
		<footer className='bg-gray-100 text-center text-sm p-4 mt-8'>
			<div className='space-x-4'>
				<Link href='/impressum' className='hover:underline'>
					Impressum
				</Link>
				<Link href='/privacy' className='hover:underline'>
					Privacy Policy
				</Link>
				<Link href='/terms' className='hover:underline'>
					Terms of Service
				</Link>
				<Link href='/support' className='hover:underline'>
					Support / Refunds
				</Link>
			</div>
			<p>© {currentYear} PostmasterAI. Все права защищены.</p>
		</footer>
	)
}
