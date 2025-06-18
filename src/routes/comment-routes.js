import express from 'express';
import { CommentController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';

export const commentRouter = express.Router();

commentRouter.post(
	'/comment',
	authenticateToken,
	CommentController.createComment
);
commentRouter.delete(
	'/comment/:id',
	authenticateToken,
	CommentController.deleteComment
);
