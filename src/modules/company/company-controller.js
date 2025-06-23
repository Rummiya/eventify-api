import { prisma } from '../../prisma/prisma-client.js';
import { isUserCompanyOwner } from '../../services/permissions.js';
import { getPagination } from '../../utils/getPagination.js';
import { getTotalPages } from '../../utils/getTotalPages.js';

export const CompanyController = {
	getMyCompanies: async (req, res) => {
		const { orderBy = 'desc' } = req.query;
		const userId = req.user.userId;

		try {
			const companies = await prisma.company.findMany({
				orderBy: {
					createdAt: orderBy === 'asc' ? 'asc' : 'desc',
				},
				where: {
					owners: {
						some: {
							userId,
						},
					},
				},
			});

			res.json({
				data: companies,
				meta: { total: companies.length, filters: { orderBy } },
			});
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ error: 'Ошибка при получении списка ваших компаний' });
		}
	},
	createCompany: async (req, res) => {
		const { name, bio, website } = req.body;
		const userId = req.user.userId;

		let filePath;

		if (req.file && req.file.path) {
			filePath = req.file.path;
		}

		if (!name) {
			return res.status(400).json({ error: 'Введите название компании' });
		}

		try {
			const existingCompany = await prisma.company.findUnique({
				where: {
					name,
				},
			});

			if (existingCompany) {
				return res
					.status(400)
					.json({ error: 'Компания с таким названием уже существует' });
			}

			const company = await prisma.company.create({
				data: {
					name,
					logoUrl: filePath ? `/${filePath}` : undefined,
					bio,
					website,
					owners: {
						create: {
							user: {
								connect: {
									id: userId,
								},
							},
						},
					},
				},
				include: {
					owners: {
						include: {
							user: true,
						},
					},
				},
			});

			res.json({ data: company, message: 'Компания успешно создана!' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Ошибка при создании компании' });
		}
	},
	updateCompany: async (req, res) => {
		const { id } = req.params;
		const { name, bio, website } = req.body;
		const userId = req.user.userId;

		let filePath;

		if (req.file && req.file.path) {
			filePath = req.file.path;
		}

		try {
			const company = await prisma.company.findUnique({
				where: {
					id,
				},
			});

			if (!company) {
				return res.status(404).json({ error: 'Компания не найдена' });
			}

			const isOwner = await isUserCompanyOwner(userId, company.id);

			if (!isOwner) {
				return res.status(403).json({ error: 'Вы не владелец этой компании' });
			}

			const updatedCompany = await prisma.company.update({
				where: {
					id: company.id,
				},
				data: {
					name,
					logoUrl: filePath ? `/${filePath}` : undefined,
					bio,
					website,
				},
			});

			res.json({
				data: updatedCompany,
				message: 'Данные компании успешно обновлены!',
			});
		} catch (error) {
			res.status(500).json({ error: 'Ошибка при обновлении данных компании' });
		}
	},
	getAllCompanies: async (req, res) => {
		const {
			name,
			followed,
			page = '1',
			limit = '10',
			orderBy = 'desc',
		} = req.query;
		const userId = req.user.userId;

		const { currentPage, skip, take } = getPagination(page, limit);

		const filters = {};

		if (followed === 'true') {
			filters.followers = {
				some: {
					userId,
				},
			};
		}
		if (name) {
			filters.name = {
				contains: name,
				mode: 'insensitive',
			};
		}

		try {
			const totalCompanies = await prisma.company.count({
				where: filters,
			});

			const companies = await prisma.company.findMany({
				skip,
				take,
				where: filters,
				orderBy: {
					createdAt: orderBy === 'asc' ? 'asc' : 'desc',
				},
				include: {
					_count: {
						select: {
							events: true,
							followers: true,
						},
					},
				},
			});

			const totalPages = getTotalPages(totalCompanies, take);

			res.json({
				data: companies,
				meta: {
					total: totalCompanies,
					page: currentPage,
					totalPages,
					limit,
					filters: { followed, orderBy, name },
				},
			});
		} catch (error) {
			res.status(500).json({ error: 'Ошибка при получении всех компаний' });
		}
	},
	getCompanyById: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		try {
			const company = await prisma.company.findUnique({
				where: {
					id,
				},
				include: {
					events: {
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
					},
					followers: {
						select: {
							id: true,
							user: true,
							userId: true,
							createdAt: true,
						},
					},
					_count: {
						select: {
							followers: true,
							events: true,
						},
					},
				},
			});

			const withFollowedInfo = {
				...company,
				isFollowed: company.followers.some(f => f.userId === userId),
			};

			res.json(withFollowedInfo);
		} catch (error) {
			res.status(500).json({ error: 'Ошибка при получении данных компании' });
		}
	},
	deleteCompany: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		try {
			const company = await prisma.company.findUnique({
				where: {
					id,
				},
			});

			if (!company) {
				return res.status(404).json({ error: 'Компания не найдена' });
			}

			const isOwner = await isUserCompanyOwner(userId, company.id);

			if (!isOwner) {
				return res
					.status(403)
					.json({ error: 'Вы не являетесь владельцем компании' });
			}

			const events = await prisma.event.findMany({ where: { companyId: id } });
			const eventIds = events.map(e => e.id);

			await prisma.$transaction([
				prisma.registration.deleteMany({
					where: { eventId: { in: eventIds } },
				}),
				prisma.comment.deleteMany({ where: { eventId: { in: eventIds } } }),
				prisma.like.deleteMany({ where: { eventId: { in: eventIds } } }),
				prisma.event.deleteMany({ where: { id: { in: eventIds } } }),

				prisma.companyFollower.deleteMany({ where: { companyId: id } }),
				prisma.companyOwner.deleteMany({ where: { companyId: id } }),
				prisma.company.delete({ where: { id } }),
			]);

			res.json({ message: 'Компания успешно удалена!' });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Ошибка при удалении компании' });
		}
	},
};
