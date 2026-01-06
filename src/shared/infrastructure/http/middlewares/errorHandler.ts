import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../../contexts/shared/domain/errors/DomainError';
import { HttpErrorMapper } from '../HttpErrorMapper';
import { Logger } from '../../logger/Logger';

export function errorHandler(logger: Logger) {
  return (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    if (err instanceof DomainError) {
      const statusCode = HttpErrorMapper.toStatusCode(err);

      logger.warn(err.message, {
        statusCode,
        path: req.path,
        errorType: err.name,
      });

      res.status(statusCode).json({
        error: err.message,
      });
      return;
    }

    logger.error('Unhandled error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
    });

    res.status(500).json({
      error: 'Internal server error',
    });
  };
}
