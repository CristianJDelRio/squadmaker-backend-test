import { DeleteJoke } from '../../../../../src/contexts/jokes/application/DeleteJoke';
import { JokeRepository } from '../../../../../src/contexts/jokes/domain/repositories/JokeRepository';
import { NotFoundError } from '../../../../../src/contexts/shared/domain/errors/NotFoundError';

describe('DeleteJoke Use Case', () => {
  let deleteJoke: DeleteJoke;
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

    deleteJoke = new DeleteJoke(mockRepository);
  });

  describe('execute', () => {
    it('should delete joke when it exists', async () => {
      mockRepository.delete.mockResolvedValue();

      await deleteJoke.execute('joke-123');

      expect(mockRepository.delete).toHaveBeenCalledWith('joke-123');
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when joke does not exist', async () => {
      mockRepository.delete.mockRejectedValue(
        new NotFoundError('Joke with id non-existent not found')
      );

      await expect(deleteJoke.execute('non-existent')).rejects.toThrow(
        NotFoundError
      );

      expect(mockRepository.delete).toHaveBeenCalledWith('non-existent');
    });

    it('should throw NotFoundError with proper message', async () => {
      mockRepository.delete.mockRejectedValue(
        new NotFoundError('Joke with id joke-123 not found')
      );

      await expect(deleteJoke.execute('joke-123')).rejects.toThrow(
        'Joke with id joke-123 not found'
      );
    });

    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Database connection failed');
      mockRepository.delete.mockRejectedValue(repositoryError);

      await expect(deleteJoke.execute('joke-123')).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});
