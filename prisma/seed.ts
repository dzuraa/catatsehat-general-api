import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const user = {
    id: 'fafeeb2e-4783-424f-b220-321954cefb66',
    email: 'wYJ9k@example.com',
    password: '123456',
    username: 'admin',
    fullName: 'admin',
  } satisfies Omit<User, 'createdAt' | 'updatedAt' | 'deletedAt'>;

  if ((await prisma.user.count({ where: { id: user.id } })) == 0) {
    await prisma.user.create({
      data: user,
    });
  }

  await prisma.$disconnect();

  process.exit(0);
}

main();
