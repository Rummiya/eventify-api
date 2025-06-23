import { prisma } from '../../prisma/prisma-client.js';
import { getPagination } from '../../utils/getPagination.js';
import { getTotalPages } from '../../utils/getTotalPages.js';

export const UserController = {
	getUserById: async (req, res) => {
		const { id } = req.params;

		try {
			const user = await prisma.user.findUnique({
				where: { id },
				include: {
					companies: {
						include: {
							company: true,
						},
					},
					follows: {
						include: {
							company: true,
						},
					},
					registrations: {
						include: {
							event: true,
						},
					},
					likes: {
						include: {
							event: true,
						},
					},
				},
			});

			if (!user) {
				return res.status(404).json({ error: 'Пользователь не найден' });
			}

			res.json(user);
		} catch (error) {
			console.error('Get Current Error', error);
			res
				.status(500)
				.json({ error: 'Ошибка при получении данных пользователя' });
		}
	},
	getAllUsers: async (req, res) => {
		try {
			const {
				name = '',
				role,
				orderBy = 'desc',
				page = '1',
				limit = '10',
			} = req.query;

			const { currentPage, take, skip } = getPagination(page, limit);

			const validRoles = ['ADMIN', 'COMPANY_OWNER', 'USER'];
			const normalizedRole =
				typeof role === 'string' && validRoles.includes(role.toUpperCase())
					? role.toUpperCase()
					: undefined;

			const filters = {};

			if (name) {
				filters.name = {
					contains: name,
					mode: 'insensitive',
				};
			}

			if (normalizedRole) {
				filters.role = {
					role: normalizedRole,
				};
			}

			const totalUsers = await prisma.user.count({
				where: filters,
			});

			const users = await prisma.user.findMany({
				skip,
				take,
				where: filters,
				include: {
					companies: true,
					comments: true,
					follows: true,
					role: true,
				},
				orderBy: {
					createdAt: orderBy === 'asc' ? 'asc' : 'desc',
				},
			});

			const totalPages = getTotalPages(totalUsers, take);

			res.json({
				data: users,
				meta: {
					total: totalUsers,
					page: currentPage,
					limit,
					totalPages,
					filters: { ...filters, orderBy, role },
				},
			});
		} catch (error) {
			console.log(error);
			res
				.status(500)
				.json({ message: 'Ошибка при получении списка пользователей' });
		}
	},
	updateUser: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;
		const { email, name } = req.body;

		let filePath;

		if (req.file && req.file.path) {
			filePath = req.file.path;
		}

		if (id !== userId) {
			return res.status(403).json({ error: 'Нет доступа' });
		}

		try {
			if (email) {
				const existingUser = await prisma.user.findFirst({
					where: { email: email },
				});

				if (existingUser && existingUser.id !== id) {
					return res.status(400).json({ error: 'Почта уже занята' });
				}
			}

			const user = await prisma.user.update({
				where: { id },
				data: {
					email: email || undefined,
					name: name || undefined,
					avatarUrl: filePath ? `/${filePath}` : undefined,
				},
			});

			res.json({ data: user, message: 'Данные успешно обновлены!' });
		} catch (error) {
			console.error('Update User Error', error);
			res.status(500).json({ error: 'Ошибка при обновлении данных' });
		}
	},
	current: async (req, res) => {
		const userId = req.user.userId;

		try {
			const user = await prisma.user.findUnique({
				where: { id: userId },
				include: {
					comments: {
						include: {
							event: true,
						},
					},
					companies: {
						include: {
							company: true,
						},
					},
					follows: {
						include: {
							company: true,
						},
					},
					registrations: {
						include: {
							event: true,
						},
					},
					likes: {
						include: {
							event: {
								include: {
									company: true,
									comments: true,
									likes: true,
								},
							},
						},
					},
				},
			});

			if (!user) {
				return res.status(400).json({ error: 'Пользователь не найден' });
			}

			res.json(user);
		} catch (error) {
			console.error('Get Current Error', error);
			res.status(500).json({ error: 'Ошибка при загрузке профиля' });
		}
	},
};
