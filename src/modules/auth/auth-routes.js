import { Router } from 'express';
import { validateBody } from '../../middlewares/validateBody.js';
import { AuthController } from './auth-controller.js';
import { loginSchema, registerSchema } from './auth-schema.js';

export const authRouter = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Логин пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@mail.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *       401:
 *         description: Неверные данные
 */
authRouter.post('/auth/login', validateBody(loginSchema), AuthController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@mail.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       200:
 *         description: Успешная регистрация
 *       401:
 *         description: Неверные данные
 */
authRouter.post(
	'/auth/register',
	validateBody(registerSchema),
	AuthController.register
);
