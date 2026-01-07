import { JwtService } from '../../../../../src/contexts/auth/infrastructure/services/JwtService';
import { User } from '../../../../../src/contexts/auth/domain/entities/User';

describe('JwtService', () => {
  let jwtService: JwtService;
  let testUser: User;

  beforeEach(() => {
    jwtService = new JwtService('test-secret-key-minimum-32-characters-long');
    testUser = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });
  });

  describe('generate', () => {
    it('should generate a valid JWT token', () => {
      const token = jwtService.generate(testUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format: header.payload.signature
    });

    it('should generate different tokens for different users', () => {
      const user2 = User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
        role: 'admin',
      });

      const token1 = jwtService.generate(testUser);
      const token2 = jwtService.generate(user2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('verify', () => {
    it('should verify a valid token', () => {
      const token = jwtService.generate(testUser);

      const payload = jwtService.verify(token);

      expect(payload).toBeDefined();
      expect(payload.sub).toBe(testUser.id.value);
      expect(payload.name).toBe(testUser.name);
      expect(payload.email).toBe(testUser.email.value);
      expect(payload.role).toBe(testUser.role.value);
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        jwtService.verify('invalid.token.here');
      }).toThrow();
    });

    it('should throw error for token with invalid signature', () => {
      const token = jwtService.generate(testUser);
      const tamperedToken = token.slice(0, -10) + 'tampered123';

      expect(() => {
        jwtService.verify(tamperedToken);
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      const shortLivedService = new JwtService(
        'test-secret-key-minimum-32-characters-long',
        '-1s' // Already expired
      );

      const token = shortLivedService.generate(testUser);

      expect(() => {
        shortLivedService.verify(token);
      }).toThrow();
    });
  });

  describe('decode', () => {
    it('should decode token payload without verification', () => {
      const token = jwtService.generate(testUser);

      const payload = jwtService.decode(token);

      expect(payload).toBeDefined();
      expect(payload?.sub).toBe(testUser.id.value);
      expect(payload?.name).toBe(testUser.name);
      expect(payload?.email).toBe(testUser.email.value);
      expect(payload?.role).toBe(testUser.role.value);
    });

    it('should return null for invalid token format', () => {
      const payload = jwtService.decode('not-a-valid-token');

      expect(payload).toBeNull();
    });
  });

  describe('token expiration', () => {
    it('should include expiration time in token', () => {
      const token = jwtService.generate(testUser);
      const payload = jwtService.verify(token);

      expect(payload.exp).toBeDefined();
      expect(payload.exp).toBeGreaterThan(payload.iat);
    });

    it('should respect custom expiration time', () => {
      const customService = new JwtService(
        'test-secret-key-minimum-32-characters-long',
        '1h'
      );

      const token = customService.generate(testUser);
      const payload = customService.verify(token);

      const expectedExpiration = payload.iat + 3600; // 1 hour in seconds
      expect(payload.exp).toBe(expectedExpiration);
    });
  });
});
