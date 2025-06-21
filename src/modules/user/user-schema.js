import { z } from 'zod';

export const userSchema = z.object({
	email: z.string().trim().email({ message: 'Некорректный email' }).optional(),
	name: z
		.string()
		.trim()
		.min(2, 'Имя должно быть минимум 2 символа')
		.optional(),
});
