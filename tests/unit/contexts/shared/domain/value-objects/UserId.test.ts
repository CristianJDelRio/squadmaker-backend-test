import { UserId } from '../../../../../../src/contexts/shared/domain/value-objects/UserId';
import { ValidationError } from '../../../../../../src/contexts/shared/domain/errors/ValidationError';

describe('UserId', () => {
  describe('constructor', () => {
    it('should create a UserId with a valid value', () => {
      const userId = new UserId('user-123');

      expect(userId.value).toBe('user-123');
    });

    it('should create a UserId with a UUID', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const userId = new UserId(uuid);

      expect(userId.value).toBe(uuid);
    });
  });

  describe('validation', () => {
    it('should throw ValidationError when value is empty string', () => {
      expect(() => new UserId('')).toThrow(ValidationError);
      expect(() => new UserId('')).toThrow('User ID cannot be empty');
    });

    it('should throw ValidationError when value is only whitespace', () => {
      expect(() => new UserId('   ')).toThrow(ValidationError);
      expect(() => new UserId('   ')).toThrow('User ID cannot be empty');
    });

    it('should throw ValidationError when value is null-like', () => {
      expect(() => new UserId(null as unknown as string)).toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError when value is undefined-like', () => {
      expect(() => new UserId(undefined as unknown as string)).toThrow(
        ValidationError
      );
    });
  });

  describe('equals', () => {
    it('should return true when comparing UserIds with same value', () => {
      const userId1 = new UserId('same-user');
      const userId2 = new UserId('same-user');

      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false when comparing UserIds with different values', () => {
      const userId1 = new UserId('user-one');
      const userId2 = new UserId('user-two');

      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should be symmetric (a.equals(b) === b.equals(a))', () => {
      const userId1 = new UserId('symmetric-id');
      const userId2 = new UserId('symmetric-id');

      expect(userId1.equals(userId2)).toBe(userId2.equals(userId1));
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      const userId = new UserId('test-user-456');

      expect(userId.toString()).toBe('test-user-456');
    });

    it('should return same value as the value property', () => {
      const userId = new UserId('consistency-test');

      expect(userId.toString()).toBe(userId.value);
    });
  });
});
