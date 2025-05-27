// apps/postmaster-ai/src/app/support/page.tsx
export default function SupportPage() {
	return (
		<div className='max-w-2xl mx-auto py-10 px-4'>
			<h1 className='text-2xl font-bold mb-4'>Refunds & Complaints</h1>
			<p>
				If you have a complaint or want to request a refund, contact us at{' '}
				<a href='mailto:info@kiadev.net' className='text-primary underline'>
					info@kiadev.net
				</a>
				.<br />
				We process requests within 7 days, in accordance with EU/DE law.
			</p>
		</div>
	)
}
