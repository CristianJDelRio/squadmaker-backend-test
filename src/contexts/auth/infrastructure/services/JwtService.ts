import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../../domain/entities/User';
import { TokenService, TokenPayload } from '../../domain/services/TokenService';

export class JwtService implements TokenService {
  private readonly secret: string;
  private readonly expiresIn: string | number;

  constructor(secret: string, expiresIn: string = '24h') {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  public generate(user: User): string {
    const payload = {
      sub: user.id.value,
      name: user.name,
      email: user.email.value,
      role: user.role.value,
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as SignOptions);
  }

  public verify(token: string): TokenPayload {
    try {
      const payload = jwt.verify(token, this.secret) as TokenPayload;
      return payload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      throw error;
    }
  }

  public decode(token: string): TokenPayload | null {
    try {
      const payload = jwt.decode(token) as TokenPayload | null;
      return payload;
    } catch {
      return null;
    }
  }
}
