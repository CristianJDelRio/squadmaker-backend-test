import { Login } from '../../../../../../src/contexts/auth/application/Login';
import { InMemoryUserRepository } from '../../../../../../src/contexts/auth/infrastructure/repositories/InMemoryUserRepository';
import { JwtService } from '../../../../../../src/contexts/auth/infrastructure/services/JwtService';
import { User } from '../../../../../../src/contexts/auth/domain/entities/User';
import { UnauthorizedError } from '../../../../../../src/contexts/shared/domain/errors/UnauthorizedError';

describe('Login Use Case', () => {
  let login: Login;
  let userRepository: InMemoryUserRepository;
  let jwtService: JwtService;
  let testUser: User;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    jwtService = new JwtService('test-secret-key-minimum-32-characters-long');
    login = new Login(userRepository, jwtService);

    testUser = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });
    await userRepository.save(testUser);
  });

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      const result = await login.execute({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(testUser.id.value);
      expect(result.user.name).toBe('john doe');
      expect(result.user.email).toBe('john@example.com');
      expect(result.user.role).toBe('user');
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('should login successfully with case-insensitive email', async () => {
      const result = await login.execute({
        email: 'JOHN@EXAMPLE.COM',
        password: 'password123',
      });

      expect(result.user.email).toBe('john@example.com');
      expect(result.token).toBeDefined();
    });

    it('should fail with non-existent email', async () => {
      await expect(
        login.execute({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should fail with incorrect password', async () => {
      await expect(
        login.execute({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should return a valid JWT token', async () => {
      const result = await login.execute({
        email: 'john@example.com',
        password: 'password123',
      });

      const payload = jwtService.verify(result.token);

      expect(payload.sub).toBe(testUser.id.value);
      expect(payload.name).toBe('john doe');
      expect(payload.email).toBe('john@example.com');
      expect(payload.role).toBe('user');
    });

    it('should not return password in user object', async () => {
      const result = await login.execute({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result.user).not.toHaveProperty('password');
    });

    it('should work with admin user', async () => {
      const adminUser = User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      });
      await userRepository.save(adminUser);

      const result = await login.execute({
        email: 'admin@example.com',
        password: 'admin123',
      });

      expect(result.user.role).toBe('admin');
      const payload = jwtService.verify(result.token);
      expect(payload.role).toBe('admin');
    });
  });
});
