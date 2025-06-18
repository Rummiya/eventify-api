import { Router } from 'express';
import { authRouter } from './auth-routes.js';
import { commentRouter } from './comment-routes.js';
import { companyRouter } from './company-routes.js';
import { eventRouter } from './event-routes.js';
import { followRouter } from './follow-routes.js';
import { likeRouter } from './like-routes.js';
import { registrationRouter } from './registration-routes.js';
import { userRouter } from './user-routes.js';

export const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(companyRouter);
router.use(followRouter);
router.use(eventRouter);
router.use(registrationRouter);
router.use(likeRouter);
router.use(commentRouter);
