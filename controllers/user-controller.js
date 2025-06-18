const { prisma } = require('../prisma/prisma-client');

const UserController = {
	getUserById: async (req, res) => {
		const { id } = req.params;

		try {
			const user = await prisma.user.findUnique({
				where: { id },
				include: {
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
			res.status(500).json({ error: 'Internal error server' });
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

			const currentPage = parseInt(page, 10);
			const take = parseInt(limit, 10);
			const skip = (currentPage - 1) * take;

			const validRoles = ['ADMIN', 'COMPANY_OWNER', 'USER'];
			const normalizedRole =
				typeof role === 'string' && validRoles.includes(role.toUpperCase())
					? role.toUpperCase()
					: undefined;

			const totalUsers = await prisma.user.count({
				where: {
					name: {
						contains: name,
						mode: 'insensitive',
					},
					...(normalizedRole && { role: normalizedRole }),
				},
			});

			const users = await prisma.user.findMany({
				skip,
				take,
				where: {
					name: {
						contains: name,
						mode: 'insensitive',
					},
					...(normalizedRole && { role: normalizedRole }),
				},
				include: {
					companyOwners: true,
					comments: true,
					follows: true,
				},
				orderBy: {
					createdAt: orderBy === 'asc' ? 'asc' : 'desc',
				},
			});

			const totalPages = Math.ceil(totalUsers / take);

			res.json({
				data: users,
				meta: {
					totalUsers,
					totalPages,
					currentPage,
				},
			});
		} catch (error) {
			res.status(500).json({ message: 'Internal server error', error });
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

			res.json(user);
		} catch (error) {
			console.error('Update User Error', error);
			res.status(500).json({ error: 'Internal error server' });
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
					companyOwners: true,
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
			res.status(500).json({ error: 'Internal error server' });
		}
	},
};

module.exports = UserController;
