import { Router } from 'express';
import { RegistrationController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';

export const registrationRouter = Router();

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Зарегистрироваться на мероприятие
 *     tags: [Registrations]
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
 *         description: Успешная регистрация
 *       400:
 *         description: Уже зарегистрирован
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
registrationRouter.post(
	'/registrations',
	authenticateToken,
	RegistrationController.addRegistration
);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: Отменить регистрацию на мероприятие
 *     tags: [Registrations]
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
 *         description: Регистрация успешно отменена
 *       400:
 *         description: Регистрация не найдена
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
registrationRouter.delete(
	'/registrations/:id',
	authenticateToken,
	RegistrationController.removeRegistration
);
