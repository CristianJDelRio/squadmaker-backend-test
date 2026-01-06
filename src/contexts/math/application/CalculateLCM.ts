import { ValidationError } from '../../shared/domain/errors/ValidationError';

export class CalculateLCM {
  execute(numbers: number[]): number {
    this.validate(numbers);

    return numbers.reduce((lcm, num) => this.calculateLCM(lcm, num));
  }

  private validate(numbers: number[]): void {
    if (numbers.length === 0) {
      throw new ValidationError('Numbers array cannot be empty');
    }

    for (const num of numbers) {
      if (!Number.isInteger(num)) {
        throw new ValidationError('Numbers must be positive integers');
      }

      if (num <= 0) {
        throw new ValidationError('Numbers must be positive integers');
      }
    }
  }

  private calculateLCM(a: number, b: number): number {
    return (a * b) / this.calculateGCD(a, b);
  }

  private calculateGCD(a: number, b: number): number {
    return b === 0 ? a : this.calculateGCD(b, a % b);
  }
}
