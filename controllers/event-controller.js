const { prisma } = require('../prisma/prisma-client');
const isUserCompanyOwner = require('../services/permissions.js');

const EventController = {
	createEvent: async (req, res) => {
		const {
			title,
			description,
			date,
			time,
			city,
			address,
			category,
			capacity,
			companyId,
		} = req.body;
		const userId = req.user.userId;

		let filePath;

		if (req.file && req.file.path) {
			filePath = req.file.path;
		}

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
				return res.status(404).json({ error: 'Компания не найдена' });
			}

			const isOwner = await isUserCompanyOwner(userId, companyId);

			if (!isOwner) {
				return res.status(403).json({ error: 'Вы не владелец этой компании' });
			}

			const event = await prisma.event.create({
				data: {
					title,
					description,
					imageUrl: filePath ? `/${filePath}` : undefined,
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
			date,
			time,
			city,
			address,
			category,
			capacity,
		} = req.body;
		const userId = req.user.userId;

		let filePath;

		if (req.file && req.file.path) {
			filePath = req.file.path;
		}

		try {
			const event = await prisma.event.findUnique({
				where: { id },
			});

			if (!event) {
				return res.status(404).json({ error: 'Ивент не найден' });
			}

			const isOwner = await isUserCompanyOwner(userId, event.companyId);

			if (!isOwner) {
				return res.status(403).json({ error: 'Вы не владелец этой компании' });
			}

			const updatedEvent = await prisma.event.update({
				where: { id },
				data: {
					title,
					description,
					imageUrl: filePath ? `/${filePath}` : undefined,
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
			const {
				category,
				city,
				upcoming,
				likedByUser,
				orderBy = 'desc',
				page = '1',
				limit = '10',
			} = req.query;
			const userId = req.user.userId;

			const currentPage = parseInt(page, 10);
			const take = parseInt(limit, 10);
			const skip = (currentPage - 1) * take;

			const filters = {};

			if (category) filters.category = category;
			if (city) filters.city = city;
			if (upcoming === 'true') {
				filters.date = {
					gte: new Date(),
					lte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				};
			}
			if (likedByUser === 'true') {
				filters.likes = {
					some: { userId },
				};
			}

			const events = await prisma.event.findMany({
				skip,
				take,
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
				where: filters,
				orderBy: {
					createdAt: orderBy === 'asc' ? 'asc' : 'desc',
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
					comments: true,
					likes: true,
					company: true,
					registrations: true,
				},
			});

			if (!event) {
				return res.status(404).json({ error: 'Мероприятие не найдено' });
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
		try {
			const { id } = req.params;
			const userId = req.user.userId;

			const event = await prisma.event.findUnique({
				where: { id },
			});

			if (!event) {
				return res.status(404).json({ error: 'Пост не найден' });
			}

			const isOwner = await isUserCompanyOwner(userId, event.companyId);

			if (!isOwner) {
				return res
					.status(403)
					.json({ error: 'Вы не владелец компании, разместившей этот пост' });
			}

			const transaction = await prisma.$transaction([
				prisma.comment.deleteMany({ where: { eventId: id } }),
				prisma.like.deleteMany({ where: { eventId: id } }),
				prisma.event.delete({ where: { id } }),
			]);

			res.json(transaction);
		} catch (error) {
			console.error('delete event error', error);
			res.status(500).json({ error: 'Internal error server' });
		}
	},
};

module.exports = EventController;
