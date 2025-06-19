import path, { dirname } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Eventify API',
			version: '1.0.0',
			description: 'Документация к API ивентов, компаний и пользователей',
		},
		servers: [
			{
				url: 'http://localhost:5000/api',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	tags: [
		{
			name: 'Auth',
			description: 'Авторизация и регистрация',
		},
		{
			name: 'Users',
			description: 'Методы для работы с пользователями',
		},
		{
			name: 'Company',
			description: 'Методы для работы с компаниями',
		},
		{
			name: 'Follow',
			description: 'Подписки и отписки от компаний',
		},
		{
			name: 'Like',
			description: 'Добавление и удаление из избранных',
		},
		{
			name: 'Registrations',
			description: 'Регистрация и отмена регистрации на мероприятие',
		},
	],
	apis: [
		path.resolve(__dirname, '../routes/*.js'),
		path.resolve(__dirname, '../controllers/*.js'),
	], // где искать JSDoc-теги
};

export const swaggerSpec = swaggerJSDoc(options);
