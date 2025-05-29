// apps/postmaster-ai/src/lib/i18n/client.ts
'use client'

import { createI18nClient } from 'next-international/client'
import { localeLoaders } from './index'

const i18nClient = createI18nClient(localeLoaders)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useI18nClient: any = i18nClient.useI18n
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useScopedI18nClient: any = i18nClient.useScopedI18n
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const I18nProviderClient: any = i18nClient.I18nProviderClient
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useChangeLocaleClient: any = i18nClient.useChangeLocale
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCurrentLocaleClient: any = i18nClient.useCurrentLocale
