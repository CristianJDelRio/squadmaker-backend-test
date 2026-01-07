import { User } from '../entities/User';
import { RoleType } from '../value-objects/UserRole';

export interface TokenPayload {
  sub: string;
  name: string;
  email: string;
  role: RoleType;
  iat: number;
  exp: number;
}

export interface TokenService {
  generate(user: User): string;
  verify(token: string): TokenPayload;
  decode(token: string): TokenPayload | null;
}
