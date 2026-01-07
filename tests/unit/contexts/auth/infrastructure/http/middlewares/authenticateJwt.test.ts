import { Request, Response, NextFunction } from 'express';
import { authenticateJwt } from '../../../../../../../src/contexts/auth/infrastructure/http/middlewares/authenticateJwt';
import { JwtService } from '../../../../../../../src/contexts/auth/infrastructure/services/JwtService';
import { User } from '../../../../../../../src/contexts/auth/domain/entities/User';
import { AuthenticatedRequest } from '../../../../../../../src/contexts/auth/infrastructure/http/types/AuthenticatedRequest';

describe('authenticateJwt Middleware', () => {
  let jwtService: JwtService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jwtService = new JwtService('test-secret-key-minimum-32-characters-long');
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should attach user payload to request when token is valid', () => {
    const testUser = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    const token = jwtService.generate(testUser);
    req.headers = { authorization: `Bearer ${token}` };

    const middleware = authenticateJwt(jwtService);
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect((req as AuthenticatedRequest).user).toBeDefined();
    expect((req as AuthenticatedRequest).user.sub).toBe(testUser.id.value);
    expect((req as AuthenticatedRequest).user.email).toBe('john@example.com');
  });

  it('should return 401 when no authorization header is present', () => {
    const middleware = authenticateJwt(jwtService);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header is malformed', () => {
    req.headers = { authorization: 'InvalidFormat' };

    const middleware = authenticateJwt(jwtService);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    req.headers = { authorization: 'Bearer invalid.token.here' };

    const middleware = authenticateJwt(jwtService);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is expired', () => {
    const shortLivedService = new JwtService(
      'test-secret-key-minimum-32-characters-long',
      '-1s'
    );

    const testUser = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    const expiredToken = shortLivedService.generate(testUser);
    req.headers = { authorization: `Bearer ${expiredToken}` };

    const middleware = authenticateJwt(jwtService);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid token',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should work with lowercase "bearer" prefix', () => {
    const testUser = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    const token = jwtService.generate(testUser);
    req.headers = { authorization: `bearer ${token}` };

    const middleware = authenticateJwt(jwtService);
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect((req as AuthenticatedRequest).user).toBeDefined();
  });
});
