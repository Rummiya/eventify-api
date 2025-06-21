import { prisma } from '../../prisma/prisma-client.js';

export const CommentController = {
	createComment: async (req, res) => {
		const { content, eventId } = req.body;
		const userId = req.user.userId;

		if (!content || !eventId) {
			return res.status(400).json({ error: 'Заполните все поля' });
		}

		try {
			const comment = await prisma.comment.create({
				data: {
					eventId,
					userId,
					content,
				},
			});

			res.json({ data: comment, message: 'Комментарий опубликован!' });
		} catch (error) {
			console.error('Error Creating Comment', error);
			res.status(500).json({ error: 'Ошибка при публикации комментария' });
		}
	},
	deleteComment: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		try {
			const comment = await prisma.comment.findUnique({
				where: { id },
			});

			if (!comment) {
				return res.status(404).json({ error: 'Комментарий не найден' });
			}

			if (comment.userId !== userId) {
				return res.status(403).json({ error: 'Вы не автор комментария' });
			}

			await prisma.comment.delete({ where: { id } });

			res.json({ message: 'Комментарий удален!' });
		} catch (error) {
			console.error('Error Deleting Comment', error);
			res.status(500).json({ error: 'Ошибка при удалении комментария' });
		}
	},
};
