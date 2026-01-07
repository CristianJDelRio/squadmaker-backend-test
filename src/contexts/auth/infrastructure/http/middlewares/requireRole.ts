import { Request, Response, NextFunction } from 'express';
import { RoleType } from '../../../domain/value-objects/UserRole';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const requireRole =
  (requiredRole: RoleType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (authReq.user.role !== requiredRole) {
      res.status(403).json({ error: 'Forbidden: insufficient permissions' });
      return;
    }

    next();
  };
