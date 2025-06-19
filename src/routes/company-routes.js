import { Router } from 'express';
import multer from 'multer';
import { CompanyController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { storage } from '../utils/uploadsStorage.js';

export const companyRouter = Router();

// показываем, где хранить файлы
const upload = multer({ storage });

/**
 * @swagger
 * /api/companies/my:
 *   get:
 *     summary: Получить компании, которыми владеет текущий пользователь
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список компаний
 *       401:
 *         description: Неавторизованный пользователь
 *       500:
 *         description: Внутренняя ошибка сервера
 */
companyRouter.get(
	'/companies/my',
	authenticateToken,
	CompanyController.getMyCompanies
);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Создать новую компанию
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               website:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Компания успешно создана
 *       400:
 *         description: Неверные данные или компания уже существует
 *       500:
 *         description: Ошибка сервера
 */
companyRouter.post(
	'/companies',
	authenticateToken,
	upload.single('logo'),
	CompanyController.createCompany
);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Обновить информацию о компании
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID компании
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               website:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Компания обновлена
 *       403:
 *         description: Нет прав на обновление
 *       404:
 *         description: Компания не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */
companyRouter.put(
	'/companies/:id',
	authenticateToken,
	upload.single('logo'),
	CompanyController.updateCompany
);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Получить список всех компаний
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Фильтр по имени
 *       - in: query
 *         name: followed
 *         schema:
 *           type: boolean
 *         description: Только подписанные компании
 *     responses:
 *       200:
 *         description: Список компаний
 *       500:
 *         description: Ошибка сервера
 */
companyRouter.get(
	'/companies',
	authenticateToken,
	CompanyController.getAllCompanies
);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Получить компанию по ID
 *     tags: [Companies]
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
 *       200:
 *         description: Информация о компании
 *       404:
 *         description: Компания не найдена
 *       500:
 *         description: Ошибка сервера
 */
companyRouter.get(
	'/companies/:id',
	authenticateToken,
	CompanyController.getCompanyById
);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Удалить компанию
 *     tags: [Companies]
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
 *       200:
 *         description: Компания удалена
 *       403:
 *         description: Нет прав на удаление
 *       404:
 *         description: Компания не найдена
 *       500:
 *         description: Ошибка сервера
 */
companyRouter.delete(
	'/companies/:id',
	authenticateToken,
	CompanyController.deleteCompany
);
