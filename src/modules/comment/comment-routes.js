import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.js';
import { CommentController } from './comment-controller.js';

export const commentRouter = Router();

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Добавить комментарий к мероприятию
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Комментарий создан
 *       400:
 *         description: Не все поля заполнены
 *       500:
 *         description: Внутренняя ошибка сервера
 */
commentRouter.post(
	'/comment',
	authenticateToken,
	CommentController.createComment
);

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     summary: Удалить комментарий
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID комментария
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Комментарий удалён
 *       403:
 *         description: Нет прав на удаление
 *       404:
 *         description: Комментарий не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
commentRouter.delete(
	'/comment/:id',
	authenticateToken,
	CommentController.deleteComment
);
