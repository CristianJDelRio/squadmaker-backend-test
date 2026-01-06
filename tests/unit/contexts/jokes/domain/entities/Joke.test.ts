import { Joke } from '../../../../../../src/contexts/jokes/domain/entities/Joke';

describe('Joke Entity', () => {
  describe('create', () => {
    it('should create a joke with valid data', () => {
      const jokeData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        text: 'Why did the chicken cross the road?',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const joke = Joke.create(jokeData);

      expect(joke.id.value).toBe(jokeData.id);
      expect(joke.text.value).toBe(jokeData.text);
      expect(joke.userId.value).toBe(jokeData.userId);
      expect(joke.categoryId.value).toBe(jokeData.categoryId);
      expect(joke.createdAt).toEqual(jokeData.createdAt);
      expect(joke.updatedAt).toEqual(jokeData.updatedAt);
    });

    it('should throw error when text is empty', () => {
      const jokeData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        text: '',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      expect(() => Joke.create(jokeData)).toThrow('Joke text cannot be empty');
    });

    it('should throw error when text is only whitespace', () => {
      const jokeData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        text: '   ',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      expect(() => Joke.create(jokeData)).toThrow('Joke text cannot be empty');
    });

    it('should throw error when userId is empty', () => {
      const jokeData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        text: 'A funny joke',
        userId: '',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      expect(() => Joke.create(jokeData)).toThrow('User ID cannot be empty');
    });

    it('should throw error when categoryId is empty', () => {
      const jokeData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        text: 'A funny joke',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      expect(() => Joke.create(jokeData)).toThrow(
        'Category ID cannot be empty'
      );
    });
  });

  describe('toPrimitives', () => {
    it('should return joke as plain object', () => {
      const jokeData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        text: 'Why did the chicken cross the road?',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const joke = Joke.create(jokeData);
      const primitives = joke.toPrimitives();

      expect(primitives).toEqual(jokeData);
    });
  });

  describe('updateText', () => {
    it('should return a new joke with updated text', () => {
      const jokeData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        text: 'Original joke',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const joke = Joke.create(jokeData);
      const newText = 'Updated joke';

      const updatedJoke = joke.updateText(newText);

      expect(updatedJoke.text.value).toBe(newText);
      expect(updatedJoke.updatedAt.getTime()).toBeGreaterThan(
        jokeData.updatedAt.getTime()
      );
      expect(joke.text.value).toBe('Original joke');
    });

    it('should throw error when updating to empty text', () => {
      const jokeData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        text: 'Original joke',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const joke = Joke.create(jokeData);

      expect(() => joke.updateText('')).toThrow('Joke text cannot be empty');
    });
  });
});
