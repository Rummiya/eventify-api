import { Router } from 'express';
import { CommentController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';

export const commentRouter = Router();

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
