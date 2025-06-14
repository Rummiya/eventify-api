const { prisma } = require('../prisma/prisma-client');

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
		const { name, logoUrl, bio, website } = req.body;
		const userId = req.user.userId;

		if (!name) {
			return res
				.status(400)
				.json({ error: 'Введите название компании или авторизуйтесь' });
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
					logoUrl,
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
};

module.exports = CompanyController;
