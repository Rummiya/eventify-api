const bcrypt = require('bcryptjs');
const { prisma } = require('../prisma/prisma-client');
const jwt = require('jsonwebtoken');

const UserController = {
	register: async (req, res) => {
		const { email, password, name } = req.body;

		if (!email || !password || !name) {
			return res.status(400).json({ error: 'Заполните все поля' });
		}

		try {
			const existingUser = await prisma.user.findUnique({ where: { email } });

			if (existingUser) {
				return res.status(400).json({ error: 'Пользователь уже существует' });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					name,
					avatarUrl: `/images/def-user.png`,
				},
			});

			res.json(user);
		} catch (error) {
			console.error('Error in register', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	login: async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Заполните все поля' });
		}

		try {
			const user = await prisma.user.findUnique({ where: { email } });

			if (!user) {
				return res.status(400).json({ error: 'Неверный логин или пароль' });
			}

			const valid = await bcrypt.compare(password, user.password);

			if (!valid) {
				return res.status(400).json({ error: 'Неверный логин или пароль' });
			}

			const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
			res.json({ token });
		} catch (error) {
			console.error('Login error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	getUserById: async (req, res) => {
		const { id } = req.params;
		// const userId = req.user.userId;

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
