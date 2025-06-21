import { Router } from 'express';
import { validateBody } from '../../middlewares/validateBody.js';
import { RoleController } from './role-controller.js';
import { roleSchema } from './role-schema.js';

export const roleRouter = Router();

roleRouter.post('/role', validateBody(roleSchema), RoleController.createRole);
