import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../../domain/services/TokenService';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const authenticateJwt =
  (tokenService: TokenService) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const payload = tokenService.verify(token);
      (req as AuthenticatedRequest).user = payload;
      next();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid or expired token';
      res.status(401).json({ error: errorMessage });
    }
  };
