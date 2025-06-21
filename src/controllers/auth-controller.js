import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/prisma-client.js';

export const AuthController = {
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

			res.json({ data: user, message: 'Аккаунт успешно создан!' });
		} catch (error) {
			console.error('Error in register', error);
			res.status(500).json({ error: 'Ошибка при создании аккаунта' });
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

			res.json({
				data: {
					token,
					user,
				},
				message: 'Вы успешно вошли!',
			});
		} catch (error) {
			console.error('Login error', error);
			res.status(500).json({ error: 'Ошибка при входе в аккаунт' });
		}
	},
};
