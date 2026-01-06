import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../../../../../shared/infrastructure/config/env';

let prismaClient: PrismaClient | null = null;

export const getPrismaClient = (): PrismaClient => {
  if (!prismaClient) {
    const adapter = new PrismaPg({
      connectionString: env.databaseUrl,
    });

    prismaClient = new PrismaClient({
      adapter,
      log:
        env.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  return prismaClient;
};

export const closePrismaClient = async (): Promise<void> => {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
};
