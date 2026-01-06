import { JokeId } from '../../../../../../src/contexts/jokes/domain/value-objects/JokeId';
import { ValidationError } from '../../../../../../src/contexts/shared/domain/errors/ValidationError';

describe('JokeId', () => {
  describe('constructor', () => {
    it('should create a JokeId with a valid value', () => {
      const jokeId = new JokeId('valid-id-123');

      expect(jokeId.value).toBe('valid-id-123');
    });

    it('should create a JokeId with a UUID', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const jokeId = new JokeId(uuid);

      expect(jokeId.value).toBe(uuid);
    });
  });

  describe('validation', () => {
    it('should throw ValidationError when value is empty string', () => {
      expect(() => new JokeId('')).toThrow(ValidationError);
      expect(() => new JokeId('')).toThrow('Joke ID cannot be empty');
    });

    it('should throw ValidationError when value is only whitespace', () => {
      expect(() => new JokeId('   ')).toThrow(ValidationError);
      expect(() => new JokeId('   ')).toThrow('Joke ID cannot be empty');
    });

    it('should throw ValidationError when value is null-like', () => {
      expect(() => new JokeId(null as unknown as string)).toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError when value is undefined-like', () => {
      expect(() => new JokeId(undefined as unknown as string)).toThrow(
        ValidationError
      );
    });
  });

  describe('equals', () => {
    it('should return true when comparing JokeIds with same value', () => {
      const jokeId1 = new JokeId('same-id');
      const jokeId2 = new JokeId('same-id');

      expect(jokeId1.equals(jokeId2)).toBe(true);
    });

    it('should return false when comparing JokeIds with different values', () => {
      const jokeId1 = new JokeId('id-one');
      const jokeId2 = new JokeId('id-two');

      expect(jokeId1.equals(jokeId2)).toBe(false);
    });

    it('should be symmetric (a.equals(b) === b.equals(a))', () => {
      const jokeId1 = new JokeId('symmetric-id');
      const jokeId2 = new JokeId('symmetric-id');

      expect(jokeId1.equals(jokeId2)).toBe(jokeId2.equals(jokeId1));
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      const jokeId = new JokeId('test-id-456');

      expect(jokeId.toString()).toBe('test-id-456');
    });

    it('should return same value as the value property', () => {
      const jokeId = new JokeId('consistency-test');

      expect(jokeId.toString()).toBe(jokeId.value);
    });
  });
});
