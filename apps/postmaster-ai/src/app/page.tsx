import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Postmaster AI',
	description: 'Welcome to the Postmaster AI application!',
}

export default function Home() {
	return (
		<div>
			<h1>Home</h1>
			<p>Welcome to the Postmaster AI application!</p>
		</div>
	)
}
