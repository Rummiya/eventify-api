import { z } from 'zod';

export const companySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Название компании должно быть не короче 2 символов')
		.max(100, 'Название компании слишком длинное'),

	bio: z
		.string()
		.trim()
		.max(500, 'Описание компании слишком длинное')
		.optional()
		.or(z.literal('')),

	website: z
		.string()
		.trim()
		.url('Некорректный URL')
		.optional()
		.or(z.literal('')),
});
