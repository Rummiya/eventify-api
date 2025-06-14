const express = require('express');
const multer = require('multer');
const {
	UserController,
	CommentController,
	LikeController,
	FollowController,
	EventController,
	CompanyController,
} = require('../controllers');
const authenticateToken = require('../midddleware/auth');

const router = express.Router();

const uploadDestination = 'uploads';

// показываем, где хранить файлы
const storage = multer.diskStorage({
	destination: uploadDestination,
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

// Роуты юзера
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authenticateToken, UserController.current);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.get('/users', authenticateToken, UserController.getAllUsers);
router.put(
	'/users/:id',
	authenticateToken,
	upload.single('avatar'),
	UserController.updateUser
);

router.get(
	'/companies/my',
	authenticateToken,
	CompanyController.getMyCompanies
);
router.post('/companies', authenticateToken, CompanyController.createCompany);

// Роуты мероприятий
router.post('/events', authenticateToken, EventController.createEvent);
router.put('/events/:id', authenticateToken, EventController.updateEvent);
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
router.post('/follow', authenticateToken, FollowController.followUser);
router.delete(
	'/unfollow/:id',
	authenticateToken,
	FollowController.unfollowUser
);

module.exports = router;
