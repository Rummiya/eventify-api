import { z } from 'zod';

export const registerSchema = z.object({
	email: z.string().email({ message: 'Некорректный email' }),
	password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
	name: z.string().min(2, 'Имя должно быть минимум 2 символа'),
});

export const loginSchema = z.object({
	email: z.string().email({ message: 'Некорректный email' }),
	password: z.string().min(1, 'Пароль обязателен'),
});
