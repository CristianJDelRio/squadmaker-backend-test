import { ValidationError } from '../../../shared/domain/errors/ValidationError';

export type RoleType = 'user' | 'admin';

export class UserRole {
  public readonly value: RoleType;

  constructor(value: RoleType) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (value !== 'user' && value !== 'admin') {
      throw new ValidationError('Invalid role');
    }
  }

  public toString(): string {
    return this.value;
  }

  public isAdmin(): boolean {
    return this.value === 'admin';
  }

  public isUser(): boolean {
    return this.value === 'user';
  }
}
