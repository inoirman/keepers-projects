import Image from 'next/image'
import Link from 'next/link'
export default function Home() {
	return (
		<main className='max-w-2xl mx-auto py-16 px-4 flex flex-col gap-8'>
			<section>
				<h1 className='text-3xl sm:text-4xl font-bold mb-3 text-primary'>
					Postmaster AI — автоматизация рутинных писем
				</h1>
				<p className='text-lg text-text-muted mb-3'>
					Postmaster AI — это сервис, который экономит ваше время за счёт
					автоматизации обработки писем: перевод, краткое содержание, генерация
					черновиков и финальных ответов — всё в одном окне, с минимальным
					участием человека.
				</p>
			</section>

			<section className='space-y-2'>
				<h2 className='text-xl font-semibold'>Кому подойдёт сервис:</h2>
				<ul className='list-disc pl-5 text-base text-text-base'>
					<li>
						Фрилансерам и предпринимателям, которым важно быстро реагировать на
						запросы из-за рубежа
					</li>
					<li>
						Иммигрантам и релокантам — для решения бюрократических задач на
						чужом языке
					</li>
					<li>
						Любым командам, кто ежедневно тратит время на разбор входящей
						корреспонденции
					</li>
				</ul>
			</section>

			<section className='space-y-2'>
				<h2 className='text-xl font-semibold'>Что умеет Postmaster AI:</h2>
				<ul className='list-disc pl-5 text-base text-text-base'>
					<li>Автоматически переводит и анализирует текст письма</li>
					<li>
						Генерирует черновики ответов на основе ваших идей и рекомендаций
					</li>
					<li>
						Формирует итоговые письма для отправки — на нужном языке, по
						стандарту деловой переписки
					</li>
					<li>
						Все шаги прозрачны, вы всегда можете проверить и скорректировать
						ответ
					</li>
				</ul>
			</section>

			<section>
				<h2 className='text-xl font-semibold'>Зачем всё это?</h2>
				<p className='text-base text-text-base'>
					Реальная цель — сэкономить вам часы жизни и снизить стресс от бумажной
					рутины. Postmaster AI не заменяет человека, но снимает с вас то, что
					отнимает силы ежедневно.
				</p>
			</section>

			<section className='mt-8'>
				<p className='text-sm text-text-muted text-center'>
					По всем вопросам и поддержке — пишите на{' '}
					<a
						href='mailto:support@kiadev.net'
						className='text-primary hover:underline'
					>
						support@kiadev.net
					</a>
				</p>
			</section>

			<section className='mt-8 text-center'>
				<p className='text-text-muted mb-2'>
					Если вам нравится мой труд и сервис оказался полезен,
					<br />
					вы всегда можете <b>угостить меня кофе</b>:
				</p>
				<a
					href='https://www.buymeacoffee.com/kiadev'
					target='_blank'
					rel='noopener noreferrer'
					className='inline-block transition-transform hover:scale-105 active:scale-95'
				>
					<Image
						src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'
						alt='Buy Me A Coffee'
						width={217}
						height={60}
						className='rounded-xl'
						priority={false}
					/>
				</a>
			</section>

			<section className='mt-8 text-center text-xs text-text-muted'>
				{/* Placeholder для будущих legal pages */}
				<Link href='/privacy' className='underline text-primary mr-4'>
					Политика конфиденциальности
				</Link>
				<Link href='/terms' className='underline text-primary mr-4'>
					Пользовательское соглашение
				</Link>
				<Link href='/cookies' className='underline text-primary'>
					Cookie Policy
				</Link>
			</section>
		</main>
	)
}
