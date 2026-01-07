import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaJokeRepository } from '../../../../../src/contexts/jokes/infrastructure/persistence/PrismaJokeRepository';
import { Joke } from '../../../../../src/contexts/jokes/domain/entities/Joke';
import { NotFoundError } from '../../../../../src/contexts/shared/domain/errors/NotFoundError';

function createPrismaError(
  message: string,
  code: string
): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code,
    clientVersion: '7.0.0',
  });
}

describe('PrismaJokeRepository - Unit Tests', () => {
  let mockPrisma: jest.Mocked<PrismaClient>;
  let repository: PrismaJokeRepository;

  beforeEach(() => {
    mockPrisma = {
      joke: {
        delete: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    repository = new PrismaJokeRepository(mockPrisma);
  });

  describe('delete', () => {
    it('should throw NotFoundError when Prisma throws P2025', async () => {
      const prismaError = createPrismaError('Record not found', 'P2025');
      (mockPrisma.joke.delete as jest.Mock).mockRejectedValue(prismaError);

      await expect(repository.delete('non-existent-id')).rejects.toThrow(
        NotFoundError
      );
    });

    it('should rethrow non-P2025 Prisma errors', async () => {
      const prismaError = createPrismaError(
        'Database connection failed',
        'P2002'
      );
      (mockPrisma.joke.delete as jest.Mock).mockRejectedValue(prismaError);

      await expect(repository.delete('some-id')).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError
      );
    });

    it('should rethrow generic errors', async () => {
      const genericError = new Error('Connection timeout');
      (mockPrisma.joke.delete as jest.Mock).mockRejectedValue(genericError);

      await expect(repository.delete('some-id')).rejects.toThrow(
        'Connection timeout'
      );
    });
  });

  describe('update', () => {
    const createTestJoke = (): Joke =>
      Joke.create({
        id: 'test-id',
        text: 'Test joke text',
        userId: 'user-id',
        categoryId: 'category-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    it('should throw NotFoundError when Prisma throws P2025', async () => {
      const prismaError = createPrismaError('Record not found', 'P2025');
      (mockPrisma.joke.update as jest.Mock).mockRejectedValue(prismaError);

      const joke = createTestJoke();

      await expect(repository.update(joke)).rejects.toThrow(NotFoundError);
    });

    it('should rethrow non-P2025 Prisma errors', async () => {
      const prismaError = createPrismaError(
        'Unique constraint violation',
        'P2002'
      );
      (mockPrisma.joke.update as jest.Mock).mockRejectedValue(prismaError);

      const joke = createTestJoke();

      await expect(repository.update(joke)).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError
      );
    });

    it('should rethrow generic errors', async () => {
      const genericError = new Error('Database unavailable');
      (mockPrisma.joke.update as jest.Mock).mockRejectedValue(genericError);

      const joke = createTestJoke();

      await expect(repository.update(joke)).rejects.toThrow(
        'Database unavailable'
      );
    });
  });
});
