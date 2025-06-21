import { z } from 'zod';

export const registerSchema = z.object({
	email: z.string().trim().email({ message: 'Некорректный email' }),
	password: z.string().trim().min(6, 'Пароль должен быть минимум 6 символов'),
	name: z.string().trim().min(2, 'Имя должно быть минимум 2 символа'),
});

export const loginSchema = z.object({
	email: z.string().trim().email({ message: 'Некорректный email' }),
	password: z.string().trim().min(1, 'Пароль обязателен'),
});
