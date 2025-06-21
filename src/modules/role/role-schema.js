import { z } from 'zod';

export const roleSchema = z.object({
	value: z
		.string()
		.trim()
		.min(3, 'Название роли не может быть пустым')
		.transform(val => val.toUpperCase())
		.refine(val => /^[A-Z_]+$/.test(val), {
			message: 'Разрешены только буквы и символ подчёркивания',
		}),
});
