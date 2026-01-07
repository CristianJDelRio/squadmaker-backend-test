import { CreateJoke } from '../../../../../src/contexts/jokes/application/CreateJoke';
import { JokeRepository } from '../../../../../src/contexts/jokes/domain/repositories/JokeRepository';
import { Joke } from '../../../../../src/contexts/jokes/domain/entities/Joke';
import { ValidationError } from '../../../../../src/contexts/shared/domain/errors/ValidationError';

describe('CreateJoke Use Case', () => {
  let createJoke: CreateJoke;
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

    createJoke = new CreateJoke(mockRepository);
  });

  describe('execute', () => {
    it('should create a joke with valid data', async () => {
      const jokeData = {
        text: 'Why did the chicken cross the road?',
        userId: 'user-123',
        categoryId: 'category-456',
      };

      const result = await createJoke.execute(jokeData);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result.text.value).toBe(jokeData.text);
      expect(result.userId.value).toBe(jokeData.userId);
      expect(result.categoryId.value).toBe(jokeData.categoryId);
      expect(result.id.value).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw ValidationError when text is empty', async () => {
      const jokeData = {
        text: '',
        userId: 'user-123',
        categoryId: 'category-456',
      };

      await expect(createJoke.execute(jokeData)).rejects.toThrow(
        ValidationError
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when userId is empty', async () => {
      const jokeData = {
        text: 'A funny joke',
        userId: '',
        categoryId: 'category-456',
      };

      await expect(createJoke.execute(jokeData)).rejects.toThrow(
        ValidationError
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when categoryId is empty', async () => {
      const jokeData = {
        text: 'A funny joke',
        userId: 'user-123',
        categoryId: '',
      };

      await expect(createJoke.execute(jokeData)).rejects.toThrow(
        ValidationError
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should generate unique id for each joke', async () => {
      const jokeData = {
        text: 'First joke',
        userId: 'user-123',
        categoryId: 'category-456',
      };

      const result1 = await createJoke.execute(jokeData);
      const result2 = await createJoke.execute({
        ...jokeData,
        text: 'Second joke',
      });

      expect(result1.id.value).not.toBe(result2.id.value);
    });

    it('should persist joke using repository', async () => {
      const jokeData = {
        text: 'Test joke',
        userId: 'user-123',
        categoryId: 'category-456',
      };

      const result = await createJoke.execute(jokeData);

      const savedJoke = mockRepository.save.mock.calls?.[0]?.[0] as Joke;
      expect(savedJoke.id.value).toBe(result.id.value);
      expect(savedJoke.text.value).toBe(jokeData.text);
    });
  });
});
