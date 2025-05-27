export default function Footer() {
	const currentYear = new Date().getFullYear()
	return (
		<footer className='bg-gray-100 text-center text-sm p-4 mt-8'>
			<div className='space-x-4'>
				<a href='/impressum' className='hover:underline'>
					Impressum
				</a>
				<a href='/privacy' className='hover:underline'>
					Privacy Policy
				</a>
				<a href='/terms' className='hover:underline'>
					Terms of Service
				</a>
				<a href='/support' className='hover:underline'>
					Support / Refunds
				</a>
			</div>
			<p>© {currentYear} PostmasterAI. Все права защищены.</p>
		</footer>
	)
}
