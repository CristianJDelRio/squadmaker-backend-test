import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

let testPrisma: PrismaClient | null = null;

export const getTestPrismaClient = (): PrismaClient => {
  if (!testPrisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    testPrisma = new PrismaClient({
      adapter,
      log: process.env.LOG_LEVEL === 'debug' ? ['query', 'error', 'warn'] : [],
    });
  }

  return testPrisma;
};

export const closeTestPrismaClient = async (): Promise<void> => {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
};

export const cleanDatabase = async (prisma: PrismaClient): Promise<void> => {
  await prisma.joke.deleteMany();
};

export const cleanAllDatabase = async (prisma: PrismaClient): Promise<void> => {
  await prisma.joke.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
};

export const seedTestData = async (
  prisma: PrismaClient
): Promise<{
  user: { id: string; name: string };
  category: { id: string; name: string };
}> => {
  const user = await prisma.user.upsert({
    where: { id: 'test-user-e2e' },
    update: {},
    create: {
      id: 'test-user-e2e',
      name: 'Test User E2E',
    },
  });

  const category = await prisma.category.upsert({
    where: { id: 'test-category-e2e' },
    update: {},
    create: {
      id: 'test-category-e2e',
      name: 'Test Category E2E',
    },
  });

  return { user, category };
};
