import { CategoryId } from '../../../../../../src/contexts/shared/domain/value-objects/CategoryId';
import { ValidationError } from '../../../../../../src/contexts/shared/domain/errors/ValidationError';

describe('CategoryId', () => {
  describe('constructor', () => {
    it('should create a CategoryId with a valid value', () => {
      const categoryId = new CategoryId('category-123');

      expect(categoryId.value).toBe('category-123');
    });

    it('should create a CategoryId with a UUID', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const categoryId = new CategoryId(uuid);

      expect(categoryId.value).toBe(uuid);
    });
  });

  describe('validation', () => {
    it('should throw ValidationError when value is empty string', () => {
      expect(() => new CategoryId('')).toThrow(ValidationError);
      expect(() => new CategoryId('')).toThrow('Category ID cannot be empty');
    });

    it('should throw ValidationError when value is only whitespace', () => {
      expect(() => new CategoryId('   ')).toThrow(ValidationError);
      expect(() => new CategoryId('   ')).toThrow(
        'Category ID cannot be empty'
      );
    });

    it('should throw ValidationError when value is null-like', () => {
      expect(() => new CategoryId(null as unknown as string)).toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError when value is undefined-like', () => {
      expect(() => new CategoryId(undefined as unknown as string)).toThrow(
        ValidationError
      );
    });
  });

  describe('equals', () => {
    it('should return true when comparing CategoryIds with same value', () => {
      const categoryId1 = new CategoryId('same-category');
      const categoryId2 = new CategoryId('same-category');

      expect(categoryId1.equals(categoryId2)).toBe(true);
    });

    it('should return false when comparing CategoryIds with different values', () => {
      const categoryId1 = new CategoryId('category-one');
      const categoryId2 = new CategoryId('category-two');

      expect(categoryId1.equals(categoryId2)).toBe(false);
    });

    it('should be symmetric (a.equals(b) === b.equals(a))', () => {
      const categoryId1 = new CategoryId('symmetric-id');
      const categoryId2 = new CategoryId('symmetric-id');

      expect(categoryId1.equals(categoryId2)).toBe(
        categoryId2.equals(categoryId1)
      );
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      const categoryId = new CategoryId('test-category-456');

      expect(categoryId.toString()).toBe('test-category-456');
    });

    it('should return same value as the value property', () => {
      const categoryId = new CategoryId('consistency-test');

      expect(categoryId.toString()).toBe(categoryId.value);
    });
  });
});
