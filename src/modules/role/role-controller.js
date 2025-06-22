import { prisma } from '../../prisma/prisma-client.js';

export const RoleController = {
	createRole: async (req, res) => {
		try {
			const { value } = req.body;

			const existingRole = await prisma.role.findUnique({
				where: { value },
			});

			if (existingRole) {
				return res.status(400).json({ error: 'Такая роль уже существует' });
			}

			const role = await prisma.role.create({ data: { value } });

			res.json({ data: role, message: 'Роль успешно создана!' });
		} catch (error) {
			res.status(500).json({ error: 'Ошибка при создании роли' });
		}
	},
	getRoles: async (_, res) => {
		try {
			const roles = await prisma.role.findMany();
			res.json({ data: roles });
		} catch (error) {
			res.status(500).json({ error: 'Ошибка при получении списка ролей' });
		}
	},
};
