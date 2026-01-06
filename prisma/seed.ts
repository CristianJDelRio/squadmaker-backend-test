import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { name: 'manolito' },
      update: {},
      create: { name: 'manolito' },
    }),
    prisma.user.upsert({
      where: { name: 'pepe' },
      update: {},
      create: { name: 'pepe' },
    }),
    prisma.user.upsert({
      where: { name: 'isabel' },
      update: {},
      create: { name: 'isabel' },
    }),
    prisma.user.upsert({
      where: { name: 'pedro' },
      update: {},
      create: { name: 'pedro' },
    }),
  ]);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'humor negro' },
      update: {},
      create: { name: 'humor negro' },
    }),
    prisma.category.upsert({
      where: { name: 'humor amarillo' },
      update: {},
      create: { name: 'humor amarillo' },
    }),
    prisma.category.upsert({
      where: { name: 'chistes verdes' },
      update: {},
      create: { name: 'chistes verdes' },
    }),
  ]);

  let jokeCount = 0;
  for (const user of users) {
    for (const category of categories) {
      for (let i = 1; i <= 3; i++) {
        await prisma.joke.create({
          data: {
            text: `Chiste ${i} de ${category.name} por ${user.name}. Un día en el parque...`,
            userId: user.id,
            categoryId: category.id,
          },
        });
        jokeCount++;
      }
    }
  }

  console.log(
    `Seeded ${users.length} users, ${categories.length} categories, ${jokeCount} jokes`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
