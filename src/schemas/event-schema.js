import { z } from 'zod';

export const eventSchema = z.object({
	title: z
		.string()
		.trim()
		.min(5, 'Название должно содержать минимум 5 символов')
		.max(100, 'Название слишком длинное'),

	description: z.string().trim().min(20, 'Описание слишком короткое'),

	date: z.string().refine(val => !isNaN(Date.parse(val)), {
		message: 'Дата должна быть валидной (ISO формат)',
	}),

	time: z
		.string()
		.trim()
		.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
			message: 'Время должно быть в формате HH:mm',
		}),

	city: z.string().trim().min(2, 'Город слишком короткий'),

	address: z.string().trim().min(5, 'Адрес слишком короткий'),

	category: z.string().trim().min(3, 'Категория слишком короткая'),

	capacity: z.preprocess(
		val => Number(val),
		z.number().min(1, 'Минимум 1 участник')
	),

	companyId: z.string().regex(/^[a-f\d]{24}$/i, 'Некорректный ObjectId'),
});

export const updateEventSchema = eventSchema.partial();
