import { CalculateLCM } from '../../../../../src/contexts/math/application/CalculateLCM';
import { ValidationError } from '../../../../../src/contexts/shared/domain/errors/ValidationError';

describe('CalculateLCM Use Case', () => {
  let calculateLCM: CalculateLCM;

  beforeEach(() => {
    calculateLCM = new CalculateLCM();
  });

  describe('execute', () => {
    it('should calculate LCM of two numbers', () => {
      const result = calculateLCM.execute([12, 18]);
      expect(result).toBe(36);
    });

    it('should calculate LCM of three numbers', () => {
      const result = calculateLCM.execute([12, 18, 24]);
      expect(result).toBe(72);
    });

    it('should return the number itself for single element', () => {
      const result = calculateLCM.execute([15]);
      expect(result).toBe(15);
    });

    it('should handle prime numbers', () => {
      const result = calculateLCM.execute([7, 11]);
      expect(result).toBe(77);
    });

    it('should handle when one number divides another', () => {
      const result = calculateLCM.execute([6, 12]);
      expect(result).toBe(12);
    });

    it('should handle multiple numbers with common factors', () => {
      const result = calculateLCM.execute([4, 6, 8]);
      expect(result).toBe(24);
    });

    it('should throw ValidationError when array is empty', () => {
      expect(() => calculateLCM.execute([])).toThrow(ValidationError);
      expect(() => calculateLCM.execute([])).toThrow(
        'Numbers array cannot be empty'
      );
    });

    it('should throw ValidationError when numbers contain zero', () => {
      expect(() => calculateLCM.execute([0, 5])).toThrow(ValidationError);
      expect(() => calculateLCM.execute([0, 5])).toThrow(
        'Numbers must be positive integers'
      );
    });

    it('should throw ValidationError when numbers contain negative values', () => {
      expect(() => calculateLCM.execute([-5, 10])).toThrow(ValidationError);
      expect(() => calculateLCM.execute([-5, 10])).toThrow(
        'Numbers must be positive integers'
      );
    });

    it('should throw ValidationError when numbers are not integers', () => {
      expect(() => calculateLCM.execute([1.5, 2.5])).toThrow(ValidationError);
      expect(() => calculateLCM.execute([1.5, 2.5])).toThrow(
        'Numbers must be positive integers'
      );
    });
  });
});
