import { Router } from 'express';
import { validateBody } from '../../middlewares/validateBody.js';
import { RoleController } from './role-controller.js';
import { roleSchema } from './role-schema.js';

export const roleRouter = Router();

roleRouter.get('/role', RoleController.getRoles);
roleRouter.post('/role', validateBody(roleSchema), RoleController.createRole);
roleRouter.put(
	'/role/:id',
	validateBody(roleSchema),
	RoleController.updateRole
);
roleRouter.delete('/role/:id', RoleController.deleteRole);
