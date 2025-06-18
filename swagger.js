const swaggerJSDoc = require('swagger-jsdoc');

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
	apis: ['./routes/*.js', './controllers/*.js'], // где искать JSDoc-теги
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
