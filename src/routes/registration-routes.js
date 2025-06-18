import { Router } from 'express';
import { RegistrationController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';

export const registrationRouter = Router();

registrationRouter.post(
	'/registrations',
	authenticateToken,
	RegistrationController.addRegistration
);
registrationRouter.delete(
	'/registrations/:id',
	authenticateToken,
	RegistrationController.removeRegistration
);
