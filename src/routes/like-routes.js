import { Router } from 'express';
import { LikeController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';

export const likeRouter = Router();

likeRouter.post('/like', authenticateToken, LikeController.addLike);
likeRouter.delete('/like/:id', authenticateToken, LikeController.removeLike);
