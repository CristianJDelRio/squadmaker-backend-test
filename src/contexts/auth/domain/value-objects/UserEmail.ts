import { ValidationError } from '../../../shared/domain/errors/ValidationError';

export class UserEmail {
  public readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.toLowerCase().trim();
  }

  private validate(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new ValidationError('Invalid email format');
    }
  }

  public toString(): string {
    return this.value;
  }
}
