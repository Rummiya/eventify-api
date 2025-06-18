import express from 'express';
import multer from 'multer';

import { authenticateToken } from '../midddleware/auth.js';
import { storage } from '../utils/uploadsStorage.js';

import {
	AuthController,
	CommentController,
	CompanyController,
	EventController,
	FollowController,
	LikeController,
	RegistrationController,
	UserController,
} from '../controllers/index.js';

export const router = express.Router();

// показываем, где хранить файлы
const upload = multer({ storage: storage });

// Роуты авторизации
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// Роуты юзера
router.get('/current', authenticateToken, UserController.current);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.get('/users', authenticateToken, UserController.getAllUsers);
router.put(
	'/users/:id',
	authenticateToken,
	upload.single('avatar'),
	UserController.updateUser
);

// Роуты компании
router.get(
	'/companies/my',
	authenticateToken,
	CompanyController.getMyCompanies
);
router.post(
	'/companies',
	authenticateToken,
	upload.single('logo'),
	CompanyController.createCompany
);
router.put(
	'/companies/:id',
	authenticateToken,
	upload.single('logo'),
	CompanyController.updateCompany
);
router.get('/companies', authenticateToken, CompanyController.getAllCompanies);
router.get(
	'/companies/:id',
	authenticateToken,
	CompanyController.getCompanyById
);
router.delete(
	'/companies/:id',
	authenticateToken,
	CompanyController.deleteCompany
);

// Роуты мероприятий
router.post(
	'/events',
	authenticateToken,
	upload.single('banner'),
	EventController.createEvent
);
router.put(
	'/events/:id',
	authenticateToken,
	upload.single('banner'),
	EventController.updateEvent
);
router.get('/events', authenticateToken, EventController.getAllEvents);
router.get('/events/:id', authenticateToken, EventController.getEventById);
router.delete('/events/:id', authenticateToken, EventController.deleteEvent);

// Роуты регистрации на ивенты
router.post(
	'/registrations',
	authenticateToken,
	RegistrationController.addRegistration
);
router.delete(
	'/registrations/:id',
	authenticateToken,
	RegistrationController.removeRegistration
);

// Роуты комментария
router.post('/comment', authenticateToken, CommentController.createComment);
router.delete(
	'/comment/:id',
	authenticateToken,
	CommentController.deleteComment
);

// Роуты лайка
router.post('/like', authenticateToken, LikeController.addLike);
router.delete('/like/:id', authenticateToken, LikeController.removeLike);

// Роуты подписок
router.post('/follow', authenticateToken, FollowController.followCompany);
router.delete(
	'/unfollow/:id',
	authenticateToken,
	FollowController.unfollowCompany
);
