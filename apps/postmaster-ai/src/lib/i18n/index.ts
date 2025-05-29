// apps/postmaster-ai/src/lib/i18n/index.ts
import { createI18n } from 'next-international'

export const localeLoaders = {
	en: () => import('@/locales/en'),
	ru: () => import('@/locales/ru'),
} as const

const i18nInstance = createI18n(localeLoaders)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useI18n: any = i18nInstance.useI18n
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useScopedI18n: any = i18nInstance.useScopedI18n
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const I18nProvider: any = i18nInstance.I18nProvider
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLocaleProps: any = i18nInstance.getLocaleProps
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCurrentLocale: any = i18nInstance.useCurrentLocale

// export const getI18n: any = i18nInstance.getI18n;
// export const getScopedI18n: any = i18nInstance.getScopedI18n;
