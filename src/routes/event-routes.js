import { Router } from 'express';
import multer from 'multer';
import { EventController } from '../controllers/index.js';
import { authenticateToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { eventSchema, updateEventSchema } from '../schemas/event-schema.js';
import { storage } from '../utils/uploadsStorage.js';

export const eventRouter = Router();

// показываем, где хранить файлы
const upload = multer({ storage });

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Получить список мероприятий
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: likedByUser
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Список мероприятий
 *       500:
 *         description: Внутренняя ошибка сервера
 */
eventRouter.get('/events', authenticateToken, EventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие найдено
 *       404:
 *         description: Мероприятие не найдено
 */
eventRouter.get('/events/:id', authenticateToken, EventController.getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - time
 *               - city
 *               - address
 *               - category
 *               - capacity
 *               - companyId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               companyId:
 *                 type: string
 *               banner:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Мероприятие успешно создано
 *       400:
 *         description: Ошибка валидации
 *       403:
 *         description: Нет доступа
 *       500:
 *         description: Внутренняя ошибка сервера
 */
eventRouter.post(
	'/events',
	authenticateToken,
	upload.single('banner'),
	validate(eventSchema),
	EventController.createEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Обновить мероприятие
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID мероприятия
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               banner:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Мероприятие обновлено
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Мероприятие не найдено
 */
eventRouter.put(
	'/events/:id',
	authenticateToken,
	upload.single('banner'),
	validate(updateEventSchema),
	EventController.updateEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Удалить мероприятие
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие успешно удалено
 *       403:
 *         description: Нет прав на удаление
 *       404:
 *         description: Мероприятие не найдено
 */
eventRouter.delete(
	'/events/:id',
	authenticateToken,
	EventController.deleteEvent
);
