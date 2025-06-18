import express from 'express';
import { AuthController } from '../controllers/index.js';

export const authRouter = express.Router();

authRouter.post('/auth/login', AuthController.login);
authRouter.post('/auth/register', AuthController.register);
