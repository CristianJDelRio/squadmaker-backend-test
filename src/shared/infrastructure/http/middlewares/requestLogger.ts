import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../logger/Logger';

export const requestLogger = (logger: Logger) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const { method, originalUrl, body, query, params } = req;

    logger.info(`→ ${method} ${originalUrl}`, {
      method,
      url: originalUrl,
      query: Object.keys(query).length > 0 ? query : undefined,
      params: Object.keys(params).length > 0 ? params : undefined,
      body: shouldLogBody(req) ? sanitizeBody(body) : undefined,
      ip: req.ip,
    });

    const originalSend = res.send;
    res.send = function (data): Response {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      const logMethod = statusCode >= 400 ? 'error' : 'info';
      logger[logMethod](
        `← ${method} ${originalUrl} ${statusCode} ${duration}ms`,
        {
          method,
          url: originalUrl,
          statusCode,
          duration: `${duration}ms`,
        }
      );

      return originalSend.call(this, data);
    };

    next();
  };
};

function shouldLogBody(req: Request): boolean {
  const method = req.method.toUpperCase();
  return ['POST', 'PUT', 'PATCH'].includes(method);
}

function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body } as Record<string, unknown>;

  const sensitiveFields = [
    'password',
    'token',
    'apiKey',
    'api_key',
    'secret',
    'authorization',
  ];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}
