import { GetJoke } from '../../../../../src/contexts/jokes/application/GetJoke';
import { JokeRepository } from '../../../../../src/contexts/jokes/domain/repositories/JokeRepository';
import { Joke } from '../../../../../src/contexts/jokes/domain/entities/Joke';
import { NotFoundError } from '../../../../../src/contexts/shared/domain/errors/NotFoundError';

describe('GetJoke Use Case', () => {
  let getJoke: GetJoke;
  let mockRepository: jest.Mocked<JokeRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findByCategoryId: jest.fn(),
      findByUserIdAndCategoryId: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    getJoke = new GetJoke(mockRepository);
  });

  describe('execute', () => {
    it('should return joke when found', async () => {
      const mockJoke = Joke.create({
        id: 'joke-123',
        text: 'A funny joke',
        userId: 'user-123',
        categoryId: 'category-456',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.findById.mockResolvedValue(mockJoke);

      const result = await getJoke.execute('joke-123');

      expect(mockRepository.findById).toHaveBeenCalledWith('joke-123');
      expect(result.id.value).toBe('joke-123');
      expect(result.text.value).toBe('A funny joke');
    });

    it('should throw NotFoundError when joke not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(getJoke.execute('non-existent')).rejects.toThrow(
        NotFoundError
      );
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
    });

    it('should throw NotFoundError with proper message', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(getJoke.execute('joke-123')).rejects.toThrow(
        'Joke with id joke-123 not found'
      );
    });
  });
});
