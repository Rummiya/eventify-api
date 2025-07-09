import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function createBaseRoles() {
	const baseRoles = ['USER', 'ADMIN', 'FOUNDER', 'MANAGER'];

	for (const role of baseRoles) {
		await prisma.role.upsert({
			where: { value: role },
			update: {},
			create: {
				value: role,
				isSystem: true,
			},
		});
	}

	console.log('✔ Базовые роли добавлены или уже существуют');
}

async function createAdmin() {
	const adminRole = await prisma.role.findUnique({ where: { value: 'ADMIN' } });

	if (!adminRole) {
		throw new Error('Роли "ADMIN" не существует');
	}

	const hashedPassword = await bcrypt.hash('123123', 10);

	await prisma.user.upsert({
		where: { email: 'admin@admin.com' },
		update: {},
		create: {
			email: 'admin@admin.com',
			name: 'Admin',
			password: hashedPassword,
			role: {
				connect: { value: adminRole.value },
			},
		},
	});

	console.log('✔ Админ создан');
}

async function main() {
	await createBaseRoles();
	await createAdmin();
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
