import { ValidationError } from '../../shared/domain/errors/ValidationError';

export class IncrementNumber {
  execute(number: number): number {
    this.validate(number);
    return number + 1;
  }

  private validate(number: number): void {
    if (!Number.isFinite(number)) {
      throw new ValidationError('Number must be a valid number');
    }

    if (!Number.isInteger(number)) {
      throw new ValidationError('Number must be an integer');
    }
  }
}
