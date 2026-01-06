import { JokeText } from '../../../../../../src/contexts/jokes/domain/value-objects/JokeText';
import { ValidationError } from '../../../../../../src/contexts/shared/domain/errors/ValidationError';

describe('JokeText', () => {
  describe('constructor', () => {
    it('should create a JokeText with a valid value', () => {
      const jokeText = new JokeText('This is a funny joke');

      expect(jokeText.value).toBe('This is a funny joke');
    });

    it('should create a JokeText with a long joke', () => {
      const longJoke =
        'Chuck Norris can divide by zero. When he does, the universe creates a new dimension just to handle the result.';
      const jokeText = new JokeText(longJoke);

      expect(jokeText.value).toBe(longJoke);
    });
  });

  describe('validation', () => {
    it('should throw ValidationError when value is empty string', () => {
      expect(() => new JokeText('')).toThrow(ValidationError);
      expect(() => new JokeText('')).toThrow('Joke text cannot be empty');
    });

    it('should throw ValidationError when value is only whitespace', () => {
      expect(() => new JokeText('   ')).toThrow(ValidationError);
      expect(() => new JokeText('   ')).toThrow('Joke text cannot be empty');
    });

    it('should throw ValidationError when value is null-like', () => {
      expect(() => new JokeText(null as unknown as string)).toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError when value is undefined-like', () => {
      expect(() => new JokeText(undefined as unknown as string)).toThrow(
        ValidationError
      );
    });
  });

  describe('equals', () => {
    it('should return true when comparing JokeTexts with same value', () => {
      const jokeText1 = new JokeText('Same joke text');
      const jokeText2 = new JokeText('Same joke text');

      expect(jokeText1.equals(jokeText2)).toBe(true);
    });

    it('should return false when comparing JokeTexts with different values', () => {
      const jokeText1 = new JokeText('First joke');
      const jokeText2 = new JokeText('Second joke');

      expect(jokeText1.equals(jokeText2)).toBe(false);
    });

    it('should be case-sensitive', () => {
      const jokeText1 = new JokeText('Joke');
      const jokeText2 = new JokeText('joke');

      expect(jokeText1.equals(jokeText2)).toBe(false);
    });

    it('should be symmetric (a.equals(b) === b.equals(a))', () => {
      const jokeText1 = new JokeText('Symmetric test');
      const jokeText2 = new JokeText('Symmetric test');

      expect(jokeText1.equals(jokeText2)).toBe(jokeText2.equals(jokeText1));
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      const jokeText = new JokeText('Why did the chicken cross the road?');

      expect(jokeText.toString()).toBe('Why did the chicken cross the road?');
    });

    it('should return same value as the value property', () => {
      const jokeText = new JokeText('Consistency is key');

      expect(jokeText.toString()).toBe(jokeText.value);
    });
  });
});
