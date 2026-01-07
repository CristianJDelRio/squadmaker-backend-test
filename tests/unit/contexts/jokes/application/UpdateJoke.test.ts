import { UpdateJoke } from '../../../../../src/contexts/jokes/application/UpdateJoke';
import { JokeRepository } from '../../../../../src/contexts/jokes/domain/repositories/JokeRepository';
import { Joke } from '../../../../../src/contexts/jokes/domain/entities/Joke';
import { NotFoundError } from '../../../../../src/contexts/shared/domain/errors/NotFoundError';
import { ValidationError } from '../../../../../src/contexts/shared/domain/errors/ValidationError';

describe('UpdateJoke Use Case', () => {
  let updateJoke: UpdateJoke;
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

    updateJoke = new UpdateJoke(mockRepository);
  });

  describe('execute', () => {
    it('should update joke text when joke exists', async () => {
      const existingJoke = Joke.create({
        id: 'joke-123',
        text: 'Old joke text',
        userId: 'user-123',
        categoryId: 'category-456',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });

      mockRepository.findById.mockResolvedValue(existingJoke);

      const result = await updateJoke.execute({
        id: 'joke-123',
        text: 'New joke text',
      });

      expect(mockRepository.findById).toHaveBeenCalledWith('joke-123');
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(result.id.value).toBe('joke-123');
      expect(result.text.value).toBe('New joke text');
      expect(result.userId.value).toBe('user-123');
      expect(result.categoryId.value).toBe('category-456');
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        existingJoke.updatedAt.getTime()
      );
    });

    it('should throw NotFoundError when joke does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        updateJoke.execute({
          id: 'non-existent',
          text: 'New text',
        })
      ).rejects.toThrow(NotFoundError);

      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError with proper message', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        updateJoke.execute({
          id: 'joke-123',
          text: 'New text',
        })
      ).rejects.toThrow('Joke with id joke-123 not found');
    });

    it('should throw ValidationError when text is empty', async () => {
      const existingJoke = Joke.create({
        id: 'joke-123',
        text: 'Old joke text',
        userId: 'user-123',
        categoryId: 'category-456',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.findById.mockResolvedValue(existingJoke);

      await expect(
        updateJoke.execute({
          id: 'joke-123',
          text: '',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when text is only whitespace', async () => {
      const existingJoke = Joke.create({
        id: 'joke-123',
        text: 'Old joke text',
        userId: 'user-123',
        categoryId: 'category-456',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.findById.mockResolvedValue(existingJoke);

      await expect(
        updateJoke.execute({
          id: 'joke-123',
          text: '   ',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should persist updated joke using repository', async () => {
      const existingJoke = Joke.create({
        id: 'joke-123',
        text: 'Old text',
        userId: 'user-123',
        categoryId: 'category-456',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });

      mockRepository.findById.mockResolvedValue(existingJoke);

      const result = await updateJoke.execute({
        id: 'joke-123',
        text: 'Updated text',
      });

      const updatedJoke = mockRepository.update.mock.calls?.[0]?.[0] as Joke;
      expect(updatedJoke.id.value).toBe(result.id.value);
      expect(updatedJoke.text.value).toBe('Updated text');
    });
  });
});
