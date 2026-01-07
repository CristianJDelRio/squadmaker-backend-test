import { PrismaClient } from '@prisma/client';
import { PrismaJokeRepository } from '../../../../../src/contexts/jokes/infrastructure/persistence/PrismaJokeRepository';
import { Joke } from '../../../../../src/contexts/jokes/domain/entities/Joke';
import { NotFoundError } from '../../../../../src/contexts/shared/domain/errors/NotFoundError';
import {
  getTestPrismaClient,
  closeTestPrismaClient,
  cleanDatabase,
} from '../../../../helpers/test-database';

describe('PrismaJokeRepository - Integration Tests', () => {
  let prisma: PrismaClient;
  let repository: PrismaJokeRepository;
  let testUserId: string;
  let testCategoryId: string;

  beforeAll(async () => {
    prisma = getTestPrismaClient();
    repository = new PrismaJokeRepository(prisma);

    const user = await prisma.user.create({
      data: { name: 'test-user-integration' },
    });
    testUserId = user.id;

    const category = await prisma.category.create({
      data: { name: 'test-category-integration' },
    });
    testCategoryId = category.id;
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await closeTestPrismaClient();
  });

  beforeEach(async () => {
    await prisma.joke.deleteMany({
      where: {
        OR: [{ userId: testUserId }, { categoryId: testCategoryId }],
      },
    });
  });

  describe('save', () => {
    it('should save a joke to the database', async () => {
      const joke = Joke.create({
        id: 'test-joke-1',
        text: 'A funny test joke',
        userId: testUserId,
        categoryId: testCategoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await repository.save(joke);

      const saved = await prisma.joke.findUnique({
        where: { id: 'test-joke-1' },
      });

      expect(saved).not.toBeNull();
      expect(saved?.text).toBe('A funny test joke');
      expect(saved?.userId).toBe(testUserId);
      expect(saved?.categoryId).toBe(testCategoryId);
    });
  });

  describe('findById', () => {
    it('should find a joke by id', async () => {
      await prisma.joke.create({
        data: {
          id: 'test-joke-2',
          text: 'Another test joke',
          userId: testUserId,
          categoryId: testCategoryId,
        },
      });

      const joke = await repository.findById('test-joke-2');

      expect(joke).not.toBeNull();
      expect(joke?.id.value).toBe('test-joke-2');
      expect(joke?.text.value).toBe('Another test joke');
      expect(joke?.userId.value).toBe(testUserId);
      expect(joke?.categoryId.value).toBe(testCategoryId);
    });

    it('should return null when joke not found', async () => {
      const joke = await repository.findById('non-existent-id');

      expect(joke).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all jokes ordered by createdAt desc', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      await prisma.joke.createMany({
        data: [
          {
            id: 'test-joke-3',
            text: 'Old joke',
            userId: testUserId,
            categoryId: testCategoryId,
            createdAt: yesterday,
          },
          {
            id: 'test-joke-4',
            text: 'New joke',
            userId: testUserId,
            categoryId: testCategoryId,
            createdAt: now,
          },
        ],
      });

      const jokes = await repository.findAll();

      expect(jokes.length).toBeGreaterThanOrEqual(2);
      const testJokes = jokes.filter((j) =>
        ['test-joke-3', 'test-joke-4'].includes(j.id.value)
      );
      expect(testJokes[0]?.id.value).toBe('test-joke-4');
      expect(testJokes[1]?.id.value).toBe('test-joke-3');
    });
  });

  describe('findByUserId', () => {
    it('should return jokes by user id', async () => {
      await prisma.joke.createMany({
        data: [
          {
            id: 'test-joke-5',
            text: 'User joke 1',
            userId: testUserId,
            categoryId: testCategoryId,
          },
          {
            id: 'test-joke-6',
            text: 'User joke 2',
            userId: testUserId,
            categoryId: testCategoryId,
          },
        ],
      });

      const jokes = await repository.findByUserId(testUserId);

      expect(jokes.length).toBe(2);
      expect(jokes.every((j) => j.userId.value === testUserId)).toBe(true);
    });
  });

  describe('findByCategoryId', () => {
    it('should return jokes by category id', async () => {
      await prisma.joke.create({
        data: {
          id: 'test-joke-7',
          text: 'Category joke 1',
          userId: testUserId,
          categoryId: testCategoryId,
        },
      });

      const jokes = await repository.findByCategoryId(testCategoryId);

      expect(jokes.length).toBeGreaterThanOrEqual(1);
      expect(jokes.every((j) => j.categoryId.value === testCategoryId)).toBe(
        true
      );
    });
  });

  describe('findByUserIdAndCategoryId', () => {
    it('should return jokes filtered by both user and category', async () => {
      await prisma.joke.create({
        data: {
          id: 'test-joke-8',
          text: 'Filtered joke',
          userId: testUserId,
          categoryId: testCategoryId,
        },
      });

      const jokes = await repository.findByUserIdAndCategoryId(
        testUserId,
        testCategoryId
      );

      expect(jokes.length).toBeGreaterThanOrEqual(1);
      expect(
        jokes.every(
          (j) =>
            j.userId.value === testUserId &&
            j.categoryId.value === testCategoryId
        )
      ).toBe(true);
    });
  });

  describe('update', () => {
    it('should update a joke', async () => {
      await prisma.joke.create({
        data: {
          id: 'test-joke-9',
          text: 'Original text',
          userId: testUserId,
          categoryId: testCategoryId,
        },
      });

      const joke = await repository.findById('test-joke-9');
      const updatedJoke = joke!.updateText('Updated text');

      await repository.update(updatedJoke);

      const found = await prisma.joke.findUnique({
        where: { id: 'test-joke-9' },
      });

      expect(found?.text).toBe('Updated text');
    });

    it('should throw NotFoundError when updating non-existent joke', async () => {
      const joke = Joke.create({
        id: 'non-existent',
        text: 'Test',
        userId: testUserId,
        categoryId: testCategoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(repository.update(joke)).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete a joke', async () => {
      await prisma.joke.create({
        data: {
          id: 'test-joke-10',
          text: 'To be deleted',
          userId: testUserId,
          categoryId: testCategoryId,
        },
      });

      await repository.delete('test-joke-10');

      const found = await prisma.joke.findUnique({
        where: { id: 'test-joke-10' },
      });

      expect(found).toBeNull();
    });

    it('should throw NotFoundError when deleting non-existent joke', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('findByUserName', () => {
    it('should return jokes by user name', async () => {
      await prisma.joke.createMany({
        data: [
          {
            id: 'test-joke-11',
            text: 'Joke by test-user-integration',
            userId: testUserId,
            categoryId: testCategoryId,
          },
          {
            id: 'test-joke-12',
            text: 'Another joke by test-user-integration',
            userId: testUserId,
            categoryId: testCategoryId,
          },
        ],
      });

      const jokes = await repository.findByUserName('test-user-integration');

      expect(jokes.length).toBe(2);
      expect(jokes.every((j) => j.userId.value === testUserId)).toBe(true);
    });

    it('should return empty array when user not found', async () => {
      const jokes = await repository.findByUserName('non-existent-user');

      expect(jokes).toEqual([]);
    });
  });

  describe('findByCategoryName', () => {
    it('should return jokes by category name', async () => {
      await prisma.joke.create({
        data: {
          id: 'test-joke-13',
          text: 'Joke in test-category-integration',
          userId: testUserId,
          categoryId: testCategoryId,
        },
      });

      const jokes = await repository.findByCategoryName(
        'test-category-integration'
      );

      expect(jokes.length).toBeGreaterThanOrEqual(1);
      expect(jokes.every((j) => j.categoryId.value === testCategoryId)).toBe(
        true
      );
    });

    it('should return empty array when category not found', async () => {
      const jokes = await repository.findByCategoryName(
        'non-existent-category'
      );

      expect(jokes).toEqual([]);
    });
  });

  describe('findByUserNameAndCategoryName', () => {
    it('should return jokes filtered by user name and category name', async () => {
      await prisma.joke.create({
        data: {
          id: 'test-joke-14',
          text: 'Filtered joke by names',
          userId: testUserId,
          categoryId: testCategoryId,
        },
      });

      const jokes = await repository.findByUserNameAndCategoryName(
        'test-user-integration',
        'test-category-integration'
      );

      expect(jokes.length).toBeGreaterThanOrEqual(1);
      expect(
        jokes.every(
          (j) =>
            j.userId.value === testUserId &&
            j.categoryId.value === testCategoryId
        )
      ).toBe(true);
    });

    it('should return empty array when user not found', async () => {
      const jokes = await repository.findByUserNameAndCategoryName(
        'non-existent-user',
        'test-category-integration'
      );

      expect(jokes).toEqual([]);
    });

    it('should return empty array when category not found', async () => {
      const jokes = await repository.findByUserNameAndCategoryName(
        'test-user-integration',
        'non-existent-category'
      );

      expect(jokes).toEqual([]);
    });

    it('should return empty array when both not found', async () => {
      const jokes = await repository.findByUserNameAndCategoryName(
        'non-existent-user',
        'non-existent-category'
      );

      expect(jokes).toEqual([]);
    });
  });
});
