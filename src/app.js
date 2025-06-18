import express from 'express';
import createError from 'http-errors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import logger from 'morgan';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { router } from './routes/index.js';

import { ensureUploadDirs } from './utils/ensureUploadDirs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

configDotenv();

export const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'jade');

app.use(
	'/public/images',
	express.static(path.join(__dirname, '../public/images'))
);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', router);

// Название папок для картинок
const uploadDirs = [
	'uploads',
	'uploads/avatars',
	'uploads/logos',
	'uploads/banners',
];

// Создаем папки для картинок, если их нет
ensureUploadDirs(uploadDirs, path.resolve(__dirname, '..'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
