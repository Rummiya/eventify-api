import { prisma } from '../../prisma/prisma-client.js';

export const LikeController = {
	addLike: async (req, res) => {
		const { eventId } = req.body;
		const userId = req.user.userId;

		if (!eventId) {
			return res
				.status(400)
				.json({ error: 'Не передан идентификатор события' });
		}

		try {
			const event = await prisma.event.findUnique({
				where: { id: eventId },
			});

			if (!event) {
				return res.status(404).json({ error: 'Событие не найдено' });
			}

			const existingLike = await prisma.like.findFirst({
				where: { eventId, userId },
			});

			if (existingLike) {
				return res.status(400).json({ error: 'Вы уже поставили лайк' });
			}

			const like = await prisma.like.create({
				data: {
					eventId,
					userId,
				},
			});

			res.json({ data: like, message: 'Успешно добавлено в избранные' });
		} catch (error) {
			console.error('Add Like Error', error);
			res.status(500).json({ error: 'Ошибка при добавлении в избранные' });
		}
	},
	removeLike: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		if (!id) {
			return res
				.status(400)
				.json({ error: 'Не передан идентификатор события' });
		}

		try {
			const event = await prisma.event.findUnique({
				where: { id },
			});

			if (!event) {
				return res.status(404).json({ error: 'Событие не найдено' });
			}

			const existingLike = await prisma.like.findFirst({
				where: { eventId: id, userId },
			});

			if (!existingLike) {
				return res.status(400).json({ error: 'Лайк не найден' });
			}

			await prisma.like.deleteMany({
				where: { eventId: id, userId },
			});

			res.status(201).json({ message: 'Успешно удалено из избранных' });
		} catch (error) {
			console.error('Delete Like Error', error);
			res.status(500).json({ error: 'Ошибка при удалении из избранных' });
		}
	},
};
