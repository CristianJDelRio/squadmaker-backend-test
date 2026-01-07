import { GetJokesByQuery } from '../../../../../src/contexts/jokes/application/GetJokesByQuery';
import { JokeRepository } from '../../../../../src/contexts/jokes/domain/repositories/JokeRepository';
import { Joke } from '../../../../../src/contexts/jokes/domain/entities/Joke';

describe('GetJokesByQuery', () => {
  let repository: jest.Mocked<JokeRepository>;
  let useCase: GetJokesByQuery;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findByCategoryId: jest.fn(),
      findByUserIdAndCategoryId: jest.fn(),
      findByUserName: jest.fn(),
      findByCategoryName: jest.fn(),
      findByUserNameAndCategoryName: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    useCase = new GetJokesByQuery(repository);
  });

  describe('when querying by user name only', () => {
    it('should call findByUserName and return jokes', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-1',
          text: 'Test joke 1',
          userId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Joke.create({
          id: 'joke-2',
          text: 'Test joke 2',
          userId: 'user-1',
          categoryId: 'cat-2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      repository.findByUserName.mockResolvedValue(mockJokes);

      const result = await useCase.execute({ userName: 'manolito' });

      expect(repository.findByUserName).toHaveBeenCalledWith('manolito');
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockJokes[0]);
      expect(result[1]).toBe(mockJokes[1]);
    });

    it('should return empty array when no jokes found', async () => {
      repository.findByUserName.mockResolvedValue([]);

      const result = await useCase.execute({ userName: 'unknown' });

      expect(repository.findByUserName).toHaveBeenCalledWith('unknown');
      expect(result).toEqual([]);
    });
  });

  describe('when querying by category name only', () => {
    it('should call findByCategoryName and return jokes', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-3',
          text: 'Dark humor joke',
          userId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      repository.findByCategoryName.mockResolvedValue(mockJokes);

      const result = await useCase.execute({ categoryName: 'humor negro' });

      expect(repository.findByCategoryName).toHaveBeenCalledWith('humor negro');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockJokes[0]);
    });

    it('should return empty array when no jokes found', async () => {
      repository.findByCategoryName.mockResolvedValue([]);

      const result = await useCase.execute({ categoryName: 'unknown' });

      expect(repository.findByCategoryName).toHaveBeenCalledWith('unknown');
      expect(result).toEqual([]);
    });
  });

  describe('when querying by both user name and category name', () => {
    it('should call findByUserNameAndCategoryName and return jokes', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-4',
          text: 'Specific joke',
          userId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Joke.create({
          id: 'joke-5',
          text: 'Another specific joke',
          userId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      repository.findByUserNameAndCategoryName.mockResolvedValue(mockJokes);

      const result = await useCase.execute({
        userName: 'manolito',
        categoryName: 'humor negro',
      });

      expect(repository.findByUserNameAndCategoryName).toHaveBeenCalledWith(
        'manolito',
        'humor negro'
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockJokes[0]);
      expect(result[1]).toBe(mockJokes[1]);
    });

    it('should return empty array when no jokes found', async () => {
      repository.findByUserNameAndCategoryName.mockResolvedValue([]);

      const result = await useCase.execute({
        userName: 'unknown',
        categoryName: 'unknown',
      });

      expect(repository.findByUserNameAndCategoryName).toHaveBeenCalledWith(
        'unknown',
        'unknown'
      );
      expect(result).toEqual([]);
    });
  });

  describe('when querying by userId only', () => {
    it('should call findByUserId and return jokes', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-6',
          text: 'User ID joke',
          userId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      repository.findByUserId.mockResolvedValue(mockJokes);

      const result = await useCase.execute({ userId: 'user-1' });

      expect(repository.findByUserId).toHaveBeenCalledWith('user-1');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockJokes[0]);
    });
  });

  describe('when querying by categoryId only', () => {
    it('should call findByCategoryId and return jokes', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-7',
          text: 'Category ID joke',
          userId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      repository.findByCategoryId.mockResolvedValue(mockJokes);

      const result = await useCase.execute({ categoryId: 'cat-1' });

      expect(repository.findByCategoryId).toHaveBeenCalledWith('cat-1');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockJokes[0]);
    });
  });

  describe('when querying by both userId and categoryId', () => {
    it('should call findByUserIdAndCategoryId and return jokes', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-8',
          text: 'User and Category ID joke',
          userId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      repository.findByUserIdAndCategoryId.mockResolvedValue(mockJokes);

      const result = await useCase.execute({
        userId: 'user-1',
        categoryId: 'cat-1',
      });

      expect(repository.findByUserIdAndCategoryId).toHaveBeenCalledWith(
        'user-1',
        'cat-1'
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockJokes[0]);
    });
  });

  describe('when no query parameters provided', () => {
    it('should call findAll and return all jokes', async () => {
      const mockJokes = [
        Joke.create({
          id: 'joke-9',
          text: 'All jokes 1',
          userId: 'user-1',
          categoryId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        Joke.create({
          id: 'joke-10',
          text: 'All jokes 2',
          userId: 'user-2',
          categoryId: 'cat-2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      repository.findAll.mockResolvedValue(mockJokes);

      const result = await useCase.execute({});

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockJokes[0]);
      expect(result[1]).toBe(mockJokes[1]);
    });
  });
});
