// // apps/postmaster-ai/middleware.ts
// import { createI18nMiddleware } from 'next-international/middleware'
// import { NextRequest } from 'next/server'

// const I18nMiddleware = createI18nMiddleware({
// 	locales: ['en', 'ru'], // Список ваших поддерживаемых локалей
// 	defaultLocale: 'ru', // Локаль, которая будет использоваться, если не указана другая
// 	// Опционально: стратегия обработки URL для локалей
// 	// Если вы хотите, чтобы URL были вида /en/about, /ru/about,
// 	// и чтобы Next.js автоматически обрабатывал это через папки [locale],
// 	// то можно ничего не указывать здесь или 'none' (по умолчанию).
// 	// Либо можно использовать:
// 	// urlMappingStrategy: 'rewrite', // Переписывает URL, не показывая префикс локали пользователю
// 	// urlMappingStrategy: 'redirect', // Делает редирект на URL с префиксом локали
// 	// Для начала, оставим по умолчанию (или 'none'), что означает, что мы будем использовать
// 	// сегмент [locale] в структуре папок нашего App Router.
// })

// export function middleware(request: NextRequest) {
// 	return I18nMiddleware(request)
// }

// export const config = {
// 	// matcher определяет, для каких путей будет запускаться этот middleware.
// 	// Эта строка исключает API роуты, статические файлы, изображения и favicon.
// 	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }
