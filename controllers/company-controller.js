const { prisma } = require('../prisma/prisma-client');
const isUserCompanyOwner = require('../services/permissions');

const CompanyController = {
	getMyCompanies: async (req, res) => {
		try {
			const userId = req.user.userId;

			const companies = await prisma.company.findMany({
				where: {
					owners: {
						some: {
							userId,
						},
					},
				},
			});

			res.json(companies);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal server error' });
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

			res.status(200).json(company);
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
				res.status(404).json({ error: 'Компания не найдена' });
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

			res.json(updatedCompany);
		} catch (error) {
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
	getAllCompanies: async (req, res) => {
		const { name, followed } = req.query;
		const userId = req.user.userId;

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
			const companies = await prisma.company.findMany({
				where: filters,
				include: {
					_count: {
						select: {
							events: true,
							followers: true,
						},
					},
				},
			});

			res.json(companies);
		} catch (error) {
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};

module.exports = CompanyController;
