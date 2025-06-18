import express from 'express';
import multer from 'multer';
import { UserController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { storage } from '../utils/uploadsStorage.js';

export const userRouter = express.Router();

// показываем, где хранить файлы
const upload = multer({ storage });

userRouter.get('/current', authenticateToken, UserController.current);
userRouter.get('/users/:id', authenticateToken, UserController.getUserById);
userRouter.get('/users', authenticateToken, UserController.getAllUsers);
userRouter.put(
	'/users/:id',
	authenticateToken,
	upload.single('avatar'),
	UserController.updateUser
);
