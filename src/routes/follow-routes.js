import express from 'express';
import { FollowController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';

export const followRouter = express.Router();

followRouter.post('/follow', authenticateToken, FollowController.followCompany);
followRouter.delete(
	'/unfollow/:id',
	authenticateToken,
	FollowController.unfollowCompany
);
