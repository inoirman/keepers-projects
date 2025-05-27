// apps/postmaster-ai/src/app/terms/page.tsx
export default function TermsOfServicePage() {
	return (
		<div className='max-w-2xl mx-auto py-10 px-4'>
			<h1 className='text-2xl font-bold mb-4'>Terms of Service</h1>
			<p>Last updated: 2024-05-28</p>

			<h2 className='mt-6 font-semibold text-lg'>1. General</h2>
			<p>By using Postmaster AI, you agree to these terms.</p>

			<h2 className='mt-6 font-semibold text-lg'>2. Services</h2>
			<ul className='list-disc pl-6'>
				<li>
					You may use the service to process and generate replies to your
					documents/emails.
				</li>
				<li>You are responsible for the legality of content you upload.</li>
			</ul>

			<h2 className='mt-6 font-semibold text-lg'>3. Payments and Billing</h2>
			<ul className='list-disc pl-6'>
				<li>
					Payments are processed by third-party providers (Stripe/PayPal).
				</li>
				<li>You are responsible for maintaining valid payment information.</li>
				<li>No refunds are guaranteed unless required by law.</li>
			</ul>

			<h2 className='mt-6 font-semibold text-lg'>4. Limits and Fair Use</h2>
			<ul className='list-disc pl-6'>
				<li>
					Each account has a limit of documents; additional usage may require
					payment or approval.
				</li>
				<li>Abuse or fraudulent activity will result in suspension.</li>
			</ul>

			<h2 className='mt-6 font-semibold text-lg'>5. Account</h2>
			<ul className='list-disc pl-6'>
				<li>You are responsible for maintaining your account’s security.</li>
				<li>You may delete your account at any time by contacting support.</li>
			</ul>

			<h2 className='mt-6 font-semibold text-lg'>6. Liability</h2>
			<p>
				Service is provided “as is”, without warranty. We are not liable for any
				damages resulting from use or inability to use the service.
			</p>

			<h2 className='mt-6 font-semibold text-lg'>7. Changes</h2>
			<p>
				We may update these terms and will notify you of significant changes.
			</p>

			<h2 className='mt-6 font-semibold text-lg'>8. Contact</h2>
			<p>
				For questions, contact{' '}
				<a href='mailto:info@kiadev.net' className='text-primary underline'>
					info@kiadev.net
				</a>
			</p>
		</div>
	)
}
