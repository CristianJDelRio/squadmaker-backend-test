import { Request, Response, NextFunction } from 'express';
import { requireRole } from '../../../../../../../src/contexts/auth/infrastructure/http/middlewares/requireRole';
import { AuthenticatedRequest } from '../../../../../../../src/contexts/auth/infrastructure/http/types/AuthenticatedRequest';

describe('requireRole Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: undefined,
    } as unknown as AuthenticatedRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next when user has required role', () => {
    (req as AuthenticatedRequest).user = {
      sub: 'user-id',
      name: 'john doe',
      email: 'john@example.com',
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 3600,
    };

    const middleware = requireRole('admin');
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 403 when user does not have required role', () => {
    (req as AuthenticatedRequest).user = {
      sub: 'user-id',
      name: 'john doe',
      email: 'john@example.com',
      role: 'user',
      iat: Date.now(),
      exp: Date.now() + 3600,
    };

    const middleware = requireRole('admin');
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden: insufficient permissions',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when user is not authenticated', () => {
    const middleware = requireRole('admin');
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should work with user role', () => {
    (req as AuthenticatedRequest).user = {
      sub: 'user-id',
      name: 'john doe',
      email: 'john@example.com',
      role: 'user',
      iat: Date.now(),
      exp: Date.now() + 3600,
    };

    const middleware = requireRole('user');
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
