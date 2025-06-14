const { prisma } = require('../prisma/prisma-client');

const EventController = {
	createEvent: async (req, res) => {
		const {
			title,
			description,
			imageUrl,
			date,
			time,
			city,
			address,
			category,
			capacity,
			companyId,
		} = req.body;
		const userId = req.user.userId;

		const requiredFieldsMissing =
			!title ||
			!description ||
			!date ||
			!time ||
			!city ||
			!address ||
			!category ||
			!capacity;

		try {
			if (requiredFieldsMissing) {
				return res
					.status(400)
					.json({ error: 'Заполните все обязательные поля' });
			}

			const existingCompany = await prisma.company.findUnique({
				where: { id: companyId },
			});

			if (!existingCompany) {
				res.status(404).json({ error: 'Компания не найдена' });
			}

			const isOwner = await prisma.companyOwner.findFirst({
				where: {
					userId,
					companyId,
				},
			});

			if (!isOwner) {
				return res.status(403).json({ error: 'Вы не владелец этой компании' });
			}

			const event = await prisma.event.create({
				data: {
					title,
					description,
					imageUrl,
					date,
					time,
					city,
					address,
					category,
					capacity: Number(capacity),
					company: {
						connect: { id: companyId },
					},
				},
				include: {
					company: true,
					comments: true,
					likes: true,
					registrations: true,
				},
			});
			res.json(event);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	updateEvent: async (req, res) => {
		const { id } = req.params;
		const {
			title,
			description,
			imageUrl,
			date,
			time,
			city,
			address,
			category,
			capacity,
			companyId,
		} = req.body;

		try {
			const event = await prisma.event.findUnique({
				where: { id },
			});

			if (companyId !== event.companyId) {
				return res.status(403).json({ error: 'Вы не владелец этой компании' });
			}

			const updatedEvent = await prisma.event.update({
				where: { id },
				data: {
					title,
					description,
					imageUrl,
					date,
					time,
					city,
					address,
					category,
					capacity,
				},
			});

			res.json(updatedEvent);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	getAllEvents: async (req, res) => {
		try {
			const { category, city, upcoming, likedByUser } = req.query;
			const userId = req.user.userId;

			const where = {};

			if (category) where.category = category;
			if (city) where.city = city;
			if (upcoming === 'true') {
				where.date = {
					gte: new Date(),
					lte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				};
			}
			if (likedByUser === 'true') {
				where.likes = {
					some: { userId },
				};
			}

			const events = await prisma.event.findMany({
				select: {
					id: true,
					title: true,
					address: true,
					city: true,
					category: true,
					date: true,
					imageUrl: true,
					createdAt: true,
					updatedAt: true,
					_count: {
						select: {
							comments: true,
							likes: true,
							registrations: true,
						},
					},
					company: {
						select: {
							id: true,
							name: true,
							logoUrl: true,
						},
					},
				},
				where,
				orderBy: {
					createdAt: 'desc',
				},
			});

			res.json(events);
		} catch (error) {
			console.error('get all post error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	getEventById: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		try {
			const event = await prisma.event.findUnique({
				where: { id },
				include: {
					comments: {
						include: {
							user: true,
						},
					},
					likes: true,
					company: true,
					registrations: true,
				},
			});

			if (!event) {
				return res.status(404).json({ error: 'Пост не найден' });
			}

			const eventWithLikeInfo = {
				...event,
				likedByUser: event.likes.some(like => like.userId === userId),
			};

			res.json(eventWithLikeInfo);
		} catch (error) {
			console.error('get post by id error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
	deleteEvent: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		const event = await prisma.event.findUnique({
			where: { id },
		});

		if (!event) {
			return res.status(404).json({ error: 'Пост не найден' });
		}

		if (event.companyId !== userId) {
			return res.status(403).json({ error: 'Вы не автор поста' });
		}
		try {
			const transaction = await prisma.$transaction([
				prisma.comment.deleteMany({ where: { postId: id } }),
				prisma.like.deleteMany({ where: { postId: id } }),
				prisma.post.delete({ where: { id } }),
			]);

			res.json(transaction);
		} catch (error) {
			console.error('delete post error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
};

module.exports = EventController;
