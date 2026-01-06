import { ValidationError } from '../../../contexts/shared/domain/errors/ValidationError';
import { NotFoundError } from '../../../contexts/shared/domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../contexts/shared/domain/errors/UnauthorizedError';

export class HttpErrorMapper {
  static toStatusCode(error: Error): number {
    if (error instanceof ValidationError) {
      return 400;
    }

    if (error instanceof NotFoundError) {
      return 404;
    }

    if (error instanceof UnauthorizedError) {
      return 401;
    }

    return 500;
  }

  static toErrorResponse(error: Error): {
    message: string;
    statusCode: number;
  } {
    const statusCode = this.toStatusCode(error);

    return {
      message: error.message,
      statusCode,
    };
  }
}
