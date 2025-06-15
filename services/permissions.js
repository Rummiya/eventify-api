const { prisma } = require('../prisma/prisma-client');

async function isUserCompanyOwner(userId, companyId) {
	const owner = await prisma.companyOwner.findFirst({
		where: { userId, companyId },
	});

	return Boolean(owner);
}

module.exports = isUserCompanyOwner;
