// apps/postmaster-ai/src/app/impressum/page.tsx
export default function ImpressumPage() {
	return (
		<div className='max-w-2xl mx-auto py-10 px-4'>
			<h1 className='text-2xl font-bold mb-4'>Impressum</h1>
			<p>
				<b>Postmaster AI</b>
				<br />
				{/* Пока нет оплаты - убираем */}
				{/* [Business Owner Name / Legal Entity]
				<br />
				[Address in Germany or Portugal]
				<br />
				Email:{' '}
				<a href='mailto:info@kiadev.net' className='text-primary underline'>
					info@kiadev.net
				</a>
			</p>
			<p className='mt-4'>
				Responsible for content according to § 55 Abs. 2 RStV:
				<br />
				[Owner Name]
			</p>
			<p className='mt-4'>
				EU dispute resolution:{' '}
				<a
					href='https://ec.europa.eu/consumers/odr'
					target='_blank'
					className='text-primary underline'
				>
					https://ec.europa.eu/consumers/odr
				</a> */}
			</p>
			{/* <p className='mt-4'>VAT ID: [если есть]</p> */}
		</div>
	)
}
