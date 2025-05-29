// apps/postmaster-ai/src/lib/i18n/types.ts
import type en from '@/locales/en' // Импортируем одну из локалей для получения ее типа
import type ru from '@/locales/ru'

export interface Locales {
	en: typeof en
	ru: typeof ru
}

// Также можно определить тип для ключей локалей, если понадобится
export type LocaleKeys = keyof Locales
