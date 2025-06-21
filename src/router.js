import { Router } from 'express';
import { authRouter } from './modules/auth/auth-routes.js';
import { commentRouter } from './modules/comment/comment-routes.js';
import { companyRouter } from './modules/company/company-routes.js';
import { eventRouter } from './modules/event/event-routes.js';
import { followRouter } from './modules/follow/follow-routes.js';
import { likeRouter } from './modules/like/like-routes.js';
import { registrationRouter } from './modules/registration/registration-routes.js';
import { roleRouter } from './modules/role/role-routes.js';
import { userRouter } from './modules/user/user-routes.js';

export const router = Router();

const routes = [
	authRouter,
	userRouter,
	roleRouter,
	companyRouter,
	followRouter,
	eventRouter,
	registrationRouter,
	likeRouter,
	commentRouter,
];

routes.forEach(item => {
	router.use(item);
});
