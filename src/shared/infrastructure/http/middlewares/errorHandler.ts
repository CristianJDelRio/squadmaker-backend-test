import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../domain/errors/AppError';
import { Logger } from '../../logger/Logger';

export function errorHandler(logger: Logger) {
  return (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    if (err instanceof AppError) {
      logger.warn(err.message, {
        statusCode: err.statusCode,
        path: req.path,
      });

      res.status(err.statusCode).json({
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
