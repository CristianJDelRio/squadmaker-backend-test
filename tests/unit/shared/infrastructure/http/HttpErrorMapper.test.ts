import { HttpErrorMapper } from '../../../../../src/shared/infrastructure/http/HttpErrorMapper';
import { ValidationError } from '../../../../../src/contexts/shared/domain/errors/ValidationError';
import { NotFoundError } from '../../../../../src/contexts/shared/domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../../../src/contexts/shared/domain/errors/UnauthorizedError';

describe('HttpErrorMapper', () => {
  describe('toStatusCode', () => {
    it('should return 400 for ValidationError', () => {
      const error = new ValidationError('Invalid input');

      const statusCode = HttpErrorMapper.toStatusCode(error);

      expect(statusCode).toBe(400);
    });

    it('should return 404 for NotFoundError', () => {
      const error = new NotFoundError('Resource not found');

      const statusCode = HttpErrorMapper.toStatusCode(error);

      expect(statusCode).toBe(404);
    });

    it('should return 401 for UnauthorizedError', () => {
      const error = new UnauthorizedError('Not authorized');

      const statusCode = HttpErrorMapper.toStatusCode(error);

      expect(statusCode).toBe(401);
    });

    it('should return 500 for generic Error', () => {
      const error = new Error('Something went wrong');

      const statusCode = HttpErrorMapper.toStatusCode(error);

      expect(statusCode).toBe(500);
    });

    it('should return 500 for unknown error types', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }
      const error = new CustomError('Custom error');

      const statusCode = HttpErrorMapper.toStatusCode(error);

      expect(statusCode).toBe(500);
    });
  });

  describe('toErrorResponse', () => {
    it('should return error response with 400 for ValidationError', () => {
      const error = new ValidationError('Field is required');

      const response = HttpErrorMapper.toErrorResponse(error);

      expect(response).toEqual({
        message: 'Field is required',
        statusCode: 400,
      });
    });

    it('should return error response with 404 for NotFoundError', () => {
      const error = new NotFoundError('Joke not found');

      const response = HttpErrorMapper.toErrorResponse(error);

      expect(response).toEqual({
        message: 'Joke not found',
        statusCode: 404,
      });
    });

    it('should return error response with 401 for UnauthorizedError', () => {
      const error = new UnauthorizedError('Invalid token');

      const response = HttpErrorMapper.toErrorResponse(error);

      expect(response).toEqual({
        message: 'Invalid token',
        statusCode: 401,
      });
    });

    it('should return error response with 500 for generic Error', () => {
      const error = new Error('Internal server error');

      const response = HttpErrorMapper.toErrorResponse(error);

      expect(response).toEqual({
        message: 'Internal server error',
        statusCode: 500,
      });
    });
  });
});

