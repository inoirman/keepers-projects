// apps/postmaster-ai/src/app/privacy/page.tsx
export default function PrivacyPolicyPage() {
	return (
		<div className='max-w-2xl mx-auto py-10 px-4'>
			<h1 className='text-2xl font-bold mb-4'>Privacy Policy</h1>
			<p>Last updated: 2024-05-28</p>
			<p className='mt-4'>
				This Privacy Policy describes how Postmaster AI (&quot;we&quot;,
				&quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your
				personal information when you use our website and services.
			</p>

			<h2 className='mt-6 font-semibold text-lg'>
				What information do we collect?
			</h2>
			<ul className='list-disc pl-6'>
				<li>
					Your email address and name (when you register or use our services)
				</li>
				<li>
					Data you provide for processing your documents (including email
					contents)
				</li>
				<li>
					Usage data (device, browser, IP address) for security and analytics
				</li>
			</ul>

			<h2 className='mt-6 font-semibold text-lg'>
				How do we use your information?
			</h2>
			<ul className='list-disc pl-6'>
				<li>To provide and improve our service</li>
				<li>To process your documents and generate responses</li>
				<li>For customer support and communication</li>
				<li>For security and fraud prevention</li>
			</ul>

			<h2 className='mt-6 font-semibold text-lg'>Payment Information</h2>
			<p>
				We use third-party payment providers (e.g. Stripe, PayPal) to process
				your payments. We do <b>not</b> store your card or payment information
				on our servers.
				<br />
				See{' '}
				<a
					href='https://stripe.com/privacy'
					target='_blank'
					className='text-primary underline'
				>
					Stripe’s Privacy Policy
				</a>{' '}
				and{' '}
				<a
					href='https://www.paypal.com/webapps/mpp/ua/privacy-full'
					target='_blank'
					className='text-primary underline'
				>
					PayPal’s Privacy Policy
				</a>
				.
			</p>

			<h2 className='mt-6 font-semibold text-lg'>Cookies</h2>
			<p>
				We use essential cookies for the operation of the service and may use
				analytics cookies to improve your experience. You can opt out of
				analytics cookies at any time.
			</p>

			<h2 className='mt-6 font-semibold text-lg'>Data Retention</h2>
			<p>
				Your personal data and document data are stored as long as your account
				is active, and deleted upon your request or account deletion.
			</p>

			<h2 className='mt-6 font-semibold text-lg'>Your Rights</h2>
			<p>
				You have the right to access, correct, or delete your data. To exercise
				your rights, contact us at:{' '}
				<a href='mailto:info@kiadev.net' className='text-primary underline'>
					info@kiadev.net
				</a>
			</p>

			<h2 className='mt-6 font-semibold text-lg'>Contact</h2>
			<p>
				For questions about this policy, please contact us at:{' '}
				<a href='mailto:info@kiadev.net' className='text-primary underline'>
					info@kiadev.net
				</a>
			</p>
		</div>
	)
}
