const express = require('express');
const multer = require('multer');
const {
	UserController,
	CommentController,
	LikeController,
	FollowController,
	EventController,
	CompanyController,
	AuthController,
} = require('../controllers');
const authenticateToken = require('../midddleware/auth');
const storage = require('../utils/uploadsStorage');

const router = express.Router();

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

module.exports = router;
