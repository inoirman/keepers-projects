export default function Footer() {
	const currentYear = new Date().getFullYear()
	return (
		<footer className='bg-gray-100 text-center text-sm p-4 mt-8'>
			<p>© {currentYear} PostmasterAI. Все права защищены.</p>
		</footer>
	)
}
