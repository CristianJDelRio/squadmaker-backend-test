import { ValidationError } from '../../../shared/domain/errors/ValidationError';
import { UserId } from '../value-objects/UserId';
import { UserEmail } from '../value-objects/UserEmail';
import { UserPassword } from '../value-objects/UserPassword';
import { UserRole, RoleType } from '../value-objects/UserRole';

interface UserProps {
  name: string;
  email: string;
  password: string;
  role: RoleType;
}

interface UserData {
  id: UserId;
  name: string;
  email: UserEmail;
  password: UserPassword;
  role: UserRole;
}

export class User {
  public readonly id: UserId;
  public readonly name: string;
  public readonly email: UserEmail;
  public readonly password: UserPassword;
  public readonly role: UserRole;

  private constructor(data: UserData) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
  }

  public static create(props: UserProps): User {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError('User name cannot be empty');
    }

    const id = new UserId();
    const email = new UserEmail(props.email);
    const password = UserPassword.create(props.password);
    const role = new UserRole(props.role);

    return new User({
      id,
      name: props.name.trim().toLowerCase(),
      email,
      password,
      role,
    });
  }

  public static fromPrimitives(data: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: RoleType;
  }): User {
    const id = new UserId(data.id);
    const email = new UserEmail(data.email);
    const password = UserPassword.fromHash(data.password);
    const role = new UserRole(data.role);

    return new User({
      id,
      name: data.name,
      email,
      password,
      role,
    });
  }

  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return this.password.verify(plainPassword);
  }

  public toPrimitives(): {
    id: string;
    name: string;
    email: string;
    role: RoleType;
  } {
    return {
      id: this.id.value,
      name: this.name,
      email: this.email.value,
      role: this.role.value,
    };
  }
}
