import bcrypt from 'bcryptjs';
import { ValidationError } from '../../../shared/domain/errors/ValidationError';

export class UserPassword {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(plainPassword: string): UserPassword {
    if (plainPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);
    return new UserPassword(hashedPassword);
  }

  public static fromHash(hashedPassword: string): UserPassword {
    return new UserPassword(hashedPassword);
  }

  public async verify(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.value);
  }
}
