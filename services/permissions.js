import { prisma } from '../prisma/prisma-client.js';

export const isUserCompanyOwner = async (userId, companyId) => {
	const owner = await prisma.companyOwner.findFirst({
		where: { userId, companyId },
	});

	return Boolean(owner);
};
