import { prisma } from '../prisma/prisma-client.js';

export const RegistrationController = {
	addRegistration: async (req, res) => {
		const { eventId } = req.body;
		const userId = req.user.userId;

		if (!eventId) {
			return res.status(404).json({ error: 'Идентификатор поста не передан' });
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId },
		});

		if (!event) {
			return res.status(404).json({ error: 'Мероприятие не найдено' });
		}

		const existingRegistration = await prisma.registration.findFirst({
			where: { eventId, userId },
		});

		if (existingRegistration) {
			return res.status(400).json({ error: 'Вы уже зарегистрированы' });
		}

		const registration = await prisma.registration.create({
			data: {
				userId,
				eventId,
			},
		});

		res.json({
			data: registration,
			message: 'Вы успешно зарегистрированы на мероприятие!',
		});
	},
	removeRegistration: async (req, res) => {},
};
