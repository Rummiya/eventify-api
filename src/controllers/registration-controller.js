import { prisma } from '../prisma/prisma-client.js';

export const RegistrationController = {
	addRegistration: async (req, res) => {
		const { eventId } = req.body;
		const userId = req.user.userId;

		if (!eventId) {
			return res.status(404).json({ error: 'Идентификатор ивента не передан' });
		}

		try {
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
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
	removeRegistration: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		if (!id) {
			return res.status(404).json({ error: 'Идентификатор ивента не передан' });
		}

		try {
			const event = await prisma.event.findFirst({
				where: {
					id,
				},
			});

			if (!event) {
				return res.status(404).json({ error: 'Мероприятие не найдено' });
			}

			const existingRegistration = await prisma.registration.findFirst({
				where: { eventId: id, userId },
			});

			if (!existingRegistration) {
				return res.status(400).json({ error: 'Регистрация не найдена' });
			}

			await prisma.registration.deleteMany({
				where: {
					eventId: id,
					userId,
				},
			});

			res
				.status(201)
				.json({ message: 'Регистрация на мероприятие успешно отменена!' });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};
