// apps/postmaster-ai/src/locales/ru.ts
export default {
	authForm: {
		usernameLabel: 'Имя пользователя',
		usernamePlaceholder: 'Ваше имя',
		emailLabel: 'Электронная почта',
		emailPlaceholder: 'you@example.com',
		passwordLabel: 'Пароль',
		passwordPlaceholder: '••••••••',
		confirmPasswordLabel: 'Подтвердите пароль',
		loginButton: 'Войти',
		registerButton: 'Зарегистрироваться',
		processingButton: 'Обработка...',
		noAccountPrompt: 'Нет аккаунта?', // <--- НОВЫЙ КЛЮЧ
		signUpLinkText: 'Зарегистрироваться', // <--- НОВЫЙ КЛЮЧ (для слова "Зарегистрироваться" в ссылке)
	},
	// ========== Добавьте сюда другие общие переводы, если они вам нужны ===========
	// Пример:
	// general: {
	//   submit: 'Отправить',
	//   cancel: 'Отмена',
	//   loading: 'Загрузка...',
	// }
	// ===========================================================================
} as const // 'as const' важен для генерации точных типов TypeScript
