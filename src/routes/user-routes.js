import { Router } from 'express';
import multer from 'multer';
import { UserController } from '../controllers/index.js';
import { authenticateToken } from '../middlewares/auth.js';
import { storage } from '../utils/uploadsStorage.js';

export const userRouter = Router();

// показываем, где хранить файлы
const upload = multer({ storage });

/**
 * @swagger
 * /api/current:
 *   get:
 *     summary: Получить текущего пользователя
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный ответ с текущим пользователем
 *       400:
 *         description: Пользователь не найден
 */
userRouter.get('/current', authenticateToken, UserController.current);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пользователя
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешно получен пользователь
 *       404:
 *         description: Пользователь не найден
 */
userRouter.get('/users/:id', authenticateToken, UserController.getUserById);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Поиск по имени (нечёткий)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, COMPANY_OWNER, USER]
 *         description: Фильтр по роли
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество на странице
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Сортировка по дате регистрации
 *     responses:
 *       200:
 *         description: Успешный ответ с пользователями
 */
userRouter.get('/users', authenticateToken, UserController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Обновить данные пользователя
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пользователя
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Успешное обновление
 *       403:
 *         description: Нет доступа
 *       400:
 *         description: Почта уже занята
 */
userRouter.put(
	'/users/:id',
	authenticateToken,
	upload.single('avatar'),
	UserController.updateUser
);
