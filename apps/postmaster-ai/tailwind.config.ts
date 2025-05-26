// apps/postmaster-ai/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Если у тебя еще есть pages/
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}', // Важно для общих компонентов
	],
	theme: {
		extend: {
			colors: {
				// Определяем наши кастомные цвета, ссылаясь на CSS переменные
				// Функция `({ opacityValue }) => ...` или `rgb(var(...) / <alpha-value>)` нужна для поддержки прозрачности
				primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
				secondary: 'rgb(var(--color-secondary-rgb) / <alpha-value>)',

				'text-base': 'rgb(var(--color-text-base-rgb) / <alpha-value>)',
				'text-muted': 'rgb(var(--color-text-muted-rgb) / <alpha-value>)',
				'text-on-primary':
					'rgb(var(--color-text-on-primary-rgb) / <alpha-value>)',

				background: 'rgb(var(--color-background-rgb) / <alpha-value>)',
				surface: 'rgb(var(--color-surface-rgb) / <alpha-value>)',

				border: 'rgb(var(--color-border-rgb) / <alpha-value>)',

				'toast-success-bg': 'rgb(var(--toast-success-bg-rgb) / <alpha-value>)',
				'toast-success-text':
					'rgb(var(--toast-success-text-rgb) / <alpha-value>)',
				'toast-error-bg': 'rgb(var(--toast-error-bg-rgb) / <alpha-value>)',
				'toast-error-text': 'rgb(var(--toast-error-text-rgb) / <alpha-value>)',
				'toast-info-bg': 'rgb(var(--toast-info-bg-rgb) / <alpha-value>)',
				'toast-info-text': 'rgb(var(--toast-info-text-rgb) / <alpha-value>)',
				'toast-warning-bg': 'rgb(var(--toast-warning-bg-rgb) / <alpha-value>)',
				'toast-warning-text':
					'rgb(var(--toast-warning-text-rgb) / <alpha-value>)',
			},
		},
	},
	plugins: [],
}
export default config
