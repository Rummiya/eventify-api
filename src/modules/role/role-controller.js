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
	updateRole: async (req, res) => {
		const { id } = req.params;
		const { value } = req.body;

		if (!id) {
			return res.status(400).json({ error: 'Идентификатор роли не передан' });
		}

		try {
			const existingRole = await prisma.role.findUnique({
				where: { id },
			});

			if (!existingRole) {
				return res.status(404).json({ error: 'Роль не найдена' });
			}

			if (existingRole.value === value) {
				return res.status(400).json({ error: 'Такая роль уже существует' });
			}

			const updatedRole = await prisma.role.update({
				where: { id },
				data: {
					value,
				},
			});

			res.json({ data: updatedRole, message: 'Роль успешно обновлена!' });
		} catch (error) {
			res.status(500).json({ error: 'Ошибка при обновлении роли' });
		}
	},
};
