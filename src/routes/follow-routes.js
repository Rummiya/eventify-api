import { Router } from 'express';
import { FollowController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';

export const followRouter = Router();

/**
 * @swagger
 * /api/follow:
 *   post:
 *     summary: Подписаться на компанию
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *             properties:
 *               companyId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Подписка успешно создана
 *       400:
 *         description: Вы уже подписаны
 *       500:
 *         description: Внутренняя ошибка сервера
 */
followRouter.post('/follow', authenticateToken, FollowController.followCompany);

/**
 * @swagger
 * /api/unfollow/{id}:
 *   delete:
 *     summary: Отписаться от компании
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID компании
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Подписка успешно удалена
 *       404:
 *         description: Подписка не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */
followRouter.delete(
	'/unfollow/:id',
	authenticateToken,
	FollowController.unfollowCompany
);
