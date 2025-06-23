import { prisma } from '../../prisma/prisma-client.js';
import { isUserCompanyOwner } from '../../services/permissions.js';
import { getPagination } from '../../utils/getPagination.js';
import { getTotalPages } from '../../utils/getTotalPages.js';

export const EventController = {
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

		try {
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

			res.json({ data: event, message: 'Событие успешно создано!' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Ошибка при создании события' });
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

			res.json({ data: updatedEvent, message: 'Данные события обновлены!' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Ошибка при обновлении данных события' });
		}
	},
	getAllEvents: async (req, res) => {
		try {
			const {
				category,
				city,
				upcoming,
				isLiked,
				orderBy = 'desc',
				page = '1',
				limit = '10',
			} = req.query;
			const userId = req.user.userId;

			const { currentPage, take, skip } = getPagination(page, limit);

			const filters = {};

			if (category) filters.category = category;
			if (city) filters.city = city;
			if (upcoming === 'true') {
				filters.date = {
					gte: new Date(),
					lte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				};
			}
			if (isLiked === 'true') {
				filters.likes = {
					some: { userId },
				};
			}

			const totalEvents = await prisma.event.count({
				where: filters,
			});

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

			const totalPages = getTotalPages(totalEvents, take);

			res.json({
				data: events,
				meta: {
					total: totalEvents,
					page: currentPage,
					totalPages,
					limit,
					filters: { category, city, upcoming, isLiked, orderBy },
				},
			});
		} catch (error) {
			console.error('get all event error', error);
			res.status(500).json({ error: 'Ошибка при получении списка событий' });
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
				isLiked: event.likes.some(like => like.userId === userId),
			};

			res.json({ data: eventWithLikeInfo });
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
				prisma.registration.deleteMany({ where: { eventId: id } }),
				prisma.comment.deleteMany({ where: { eventId: id } }),
				prisma.like.deleteMany({ where: { eventId: id } }),
				prisma.event.delete({ where: { id } }),
			]);

			res.json({ message: 'Событие успешно удалено!' });
		} catch (error) {
			console.error('delete event error', error);
			res.status(500).json({ error: 'Ошибка при удалении события' });
		}
	},
};
