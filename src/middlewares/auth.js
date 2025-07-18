import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/prisma-client.js';

export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Вы не зарегистрированы' });
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);

		// Проверка, существует ли пользователь в базе
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (!user) {
			return res
				.status(401)
				.json({ error: 'Токен действителен, но пользователь не найден' });
		}

		req.user = decoded;
		next();
	} catch (err) {
		console.error('JWT error:', err.message);
		return res
			.status(403)
			.json({ error: 'Недействительный или просроченный токен' });
	}
};
