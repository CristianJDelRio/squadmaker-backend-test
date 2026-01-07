import { GetJokes } from '../../../../../src/contexts/jokes/application/GetJokes';
import { JokeRepository } from '../../../../../src/contexts/jokes/domain/repositories/JokeRepository';
import { Joke } from '../../../../../src/contexts/jokes/domain/entities/Joke';

describe('GetJokes Use Case', () => {
  let getJokes: GetJokes;
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
      findByUserName: jest.fn(),
      findByCategoryName: jest.fn(),
      findByUserNameAndCategoryName: jest.fn(),
    };

    getJokes = new GetJokes(mockRepository);
  });

  describe('execute', () => {
    it('should return all jokes when no filters provided', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-1',
          text: 'First joke',
          userId: 'user-1',
          categoryId: 'category-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Joke.create({
          id: 'joke-2',
          text: 'Second joke',
          userId: 'user-2',
          categoryId: 'category-2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockRepository.findAll.mockResolvedValue(mockJokes);

      const result = await getJokes.execute({});

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]?.id.value).toBe('joke-1');
      expect(result[1]?.id.value).toBe('joke-2');
    });

    it('should return jokes filtered by userId', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-1',
          text: 'User joke 1',
          userId: 'user-123',
          categoryId: 'category-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Joke.create({
          id: 'joke-2',
          text: 'User joke 2',
          userId: 'user-123',
          categoryId: 'category-2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockRepository.findByUserId.mockResolvedValue(mockJokes);

      const result = await getJokes.execute({ userId: 'user-123' });

      expect(mockRepository.findByUserId).toHaveBeenCalledWith('user-123');
      expect(mockRepository.findAll).not.toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result.every((j) => j.userId.value === 'user-123')).toBe(true);
    });

    it('should return jokes filtered by categoryId', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-1',
          text: 'Category joke 1',
          userId: 'user-1',
          categoryId: 'category-456',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Joke.create({
          id: 'joke-2',
          text: 'Category joke 2',
          userId: 'user-2',
          categoryId: 'category-456',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockRepository.findByCategoryId.mockResolvedValue(mockJokes);

      const result = await getJokes.execute({ categoryId: 'category-456' });

      expect(mockRepository.findByCategoryId).toHaveBeenCalledWith(
        'category-456'
      );
      expect(mockRepository.findAll).not.toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result.every((j) => j.categoryId.value === 'category-456')).toBe(
        true
      );
    });

    it('should return jokes filtered by both userId and categoryId', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-1',
          text: 'Specific joke',
          userId: 'user-123',
          categoryId: 'category-456',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockRepository.findByUserIdAndCategoryId.mockResolvedValue(mockJokes);

      const result = await getJokes.execute({
        userId: 'user-123',
        categoryId: 'category-456',
      });

      expect(mockRepository.findByUserIdAndCategoryId).toHaveBeenCalledWith(
        'user-123',
        'category-456'
      );
      expect(mockRepository.findAll).not.toHaveBeenCalled();
      expect(mockRepository.findByUserId).not.toHaveBeenCalled();
      expect(mockRepository.findByCategoryId).not.toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]?.userId.value).toBe('user-123');
      expect(result[0]?.categoryId.value).toBe('category-456');
    });

    it('should return empty array when no jokes found', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await getJokes.execute({});

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when filtered results are empty', async () => {
      mockRepository.findByUserId.mockResolvedValue([]);

      const result = await getJokes.execute({ userId: 'non-existent' });

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
