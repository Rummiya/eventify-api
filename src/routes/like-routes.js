import { Router } from 'express';
import { LikeController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';

export const likeRouter = Router();

/**
 * @swagger
 * /api/like:
 *   post:
 *     summary: Добавить мероприятие в избранные
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно добавлено в избранные
 *       400:
 *         description: Уже  добавлено в избранные или неверные данные
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
likeRouter.post('/like', authenticateToken, LikeController.addLike);

/**
 * @swagger
 * /api/like/{id}:
 *   delete:
 *     summary: Удалить мероприятие из избранных
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Успешно удалено из избранных
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Лайк не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
likeRouter.delete('/like/:id', authenticateToken, LikeController.removeLike);
