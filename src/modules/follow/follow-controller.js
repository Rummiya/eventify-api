import { prisma } from '../../prisma/prisma-client.js';
import { isUserCompanyOwner } from '../../services/permissions.js';

export const FollowController = {
	followCompany: async (req, res) => {
		const { companyId } = req.body;
		const userId = req.user.userId;

		try {
			const isOwner = await isUserCompanyOwner(userId, companyId);

			if (isOwner) {
				return res
					.status(500)
					.json({ error: 'Нельзя подписаться на свою компанию' });
			}

			const existingFollow = await prisma.companyFollower.findFirst({
				where: { userId, companyId },
			});

			if (existingFollow) {
				res.status(400).json({ error: 'Вы уже подписаны' });
			}

			await prisma.companyFollower.create({
				data: {
					user: { connect: { id: userId } },
					company: { connect: { id: companyId } },
				},
			});

			res.status(201).json({ message: 'Подписка успешно оформлена' });
		} catch (error) {
			console.error('Follow Error', error);
			res.status(500).json({ error: 'Ошибка при оформлении подписки' });
		}
	},
	unfollowCompany: async (req, res) => {
		const { companyId } = req.body;
		const userId = req.user.userId;

		try {
			const follows = await prisma.companyFollower.findFirst({
				where: { userId, companyId },
			});

			if (!follows) {
				return res.status(404).json({ error: 'Подписка не найдена' });
			}

			await prisma.companyFollower.delete({
				where: { id: follows.id },
			});

			res.status(201).json({ message: 'Подписка успешно удалена' });
		} catch (error) {
			console.error('Unfollow Error', error);
			res.status(500).json({ error: 'Ошибка при удалении подписки' });
		}
	},
};
