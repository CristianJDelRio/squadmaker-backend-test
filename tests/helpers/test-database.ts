import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.test
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
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
};
