import { IncrementNumber } from '../../../../../src/contexts/math/application/IncrementNumber';
import { ValidationError } from '../../../../../src/contexts/shared/domain/errors/ValidationError';

describe('IncrementNumber Use Case', () => {
  let incrementNumber: IncrementNumber;

  beforeEach(() => {
    incrementNumber = new IncrementNumber();
  });

  describe('execute', () => {
    it('should increment a positive number by 1', () => {
      const result = incrementNumber.execute(5);
      expect(result).toBe(6);
    });

    it('should increment zero to 1', () => {
      const result = incrementNumber.execute(0);
      expect(result).toBe(1);
    });

    it('should increment a negative number by 1', () => {
      const result = incrementNumber.execute(-5);
      expect(result).toBe(-4);
    });

    it('should handle large numbers', () => {
      const result = incrementNumber.execute(999999);
      expect(result).toBe(1000000);
    });

    it('should throw ValidationError when number is not an integer', () => {
      expect(() => incrementNumber.execute(1.5)).toThrow(ValidationError);
      expect(() => incrementNumber.execute(1.5)).toThrow('Number must be an integer');
    });

    it('should throw ValidationError when number is NaN', () => {
      expect(() => incrementNumber.execute(NaN)).toThrow(ValidationError);
      expect(() => incrementNumber.execute(NaN)).toThrow('Number must be a valid number');
    });

    it('should throw ValidationError when number is Infinity', () => {
      expect(() => incrementNumber.execute(Infinity)).toThrow(ValidationError);
      expect(() => incrementNumber.execute(Infinity)).toThrow('Number must be a valid number');
    });
  });
});
