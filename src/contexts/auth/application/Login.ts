import { UserRepository } from '../domain/repositories/UserRepository';
import { TokenService } from '../domain/services/TokenService';
import { UnauthorizedError } from '../../../contexts/shared/domain/errors/UnauthorizedError';
import { RoleType } from '../domain/value-objects/UserRole';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: RoleType;
  };
  token: string;
}

export class Login {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.tokenService.generate(user);

    return {
      user: user.toPrimitives(),
      token,
    };
  }
}
