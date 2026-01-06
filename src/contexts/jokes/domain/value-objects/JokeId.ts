import { ValidationError } from '../../../shared/domain/errors/ValidationError';

export class JokeId {
  public readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Joke ID cannot be empty');
    }
  }

  equals(other: JokeId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
