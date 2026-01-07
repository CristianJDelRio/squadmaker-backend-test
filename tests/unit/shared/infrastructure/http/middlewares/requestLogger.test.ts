import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../../../../../../src/shared/infrastructure/http/middlewares/requestLogger';
import { Logger } from '../../../../../../src/shared/infrastructure/logger/Logger';

describe('requestLogger middleware', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let middleware: ReturnType<typeof requestLogger>;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockRequest = {
      method: 'GET',
      originalUrl: '/api/test',
      body: {},
      query: {},
      params: {},
      ip: '127.0.0.1',
    };

    mockResponse = {
      statusCode: 200,
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
    middleware = requestLogger(mockLogger);
  });

  describe('request logging', () => {
    it('should log incoming requests', () => {
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogger.info).toHaveBeenCalledWith(
        '→ GET /api/test',
        expect.objectContaining({
          method: 'GET',
          url: '/api/test',
        })
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should log body for POST requests with sensitive fields redacted', () => {
      mockRequest.method = 'POST';
      mockRequest.body = {
        username: 'testuser',
        password: 'secret123',
        token: 'abc123',
        apiKey: 'key123',
        data: 'normal',
      };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogger.info).toHaveBeenCalledWith(
        '→ POST /api/test',
        expect.objectContaining({
          body: {
            username: 'testuser',
            password: '[REDACTED]',
            token: '[REDACTED]',
            apiKey: '[REDACTED]',
            data: 'normal',
          },
        })
      );
    });

    it('should handle null body in POST requests', () => {
      mockRequest.method = 'POST';
      mockRequest.body = null;

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogger.info).toHaveBeenCalledWith(
        '→ POST /api/test',
        expect.objectContaining({
          body: null,
        })
      );
    });

    it('should handle primitive body in POST requests', () => {
      mockRequest.method = 'POST';
      mockRequest.body = 'plain text body';

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogger.info).toHaveBeenCalledWith(
        '→ POST /api/test',
        expect.objectContaining({
          body: 'plain text body',
        })
      );
    });

    it('should not log body for GET requests', () => {
      mockRequest.method = 'GET';
      mockRequest.body = { data: 'should not appear' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogger.info).toHaveBeenCalledWith(
        '→ GET /api/test',
        expect.objectContaining({
          body: undefined,
        })
      );
    });

    it('should log query params when present', () => {
      mockRequest.query = { page: '1', limit: '10' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogger.info).toHaveBeenCalledWith(
        '→ GET /api/test',
        expect.objectContaining({
          query: { page: '1', limit: '10' },
        })
      );
    });

    it('should redact api_key and secret fields', () => {
      mockRequest.method = 'PUT';
      mockRequest.body = {
        api_key: 'should-be-redacted',
        secret: 'also-redacted',
        authorization: 'bearer-token',
        normalField: 'visible',
      };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogger.info).toHaveBeenCalledWith(
        '→ PUT /api/test',
        expect.objectContaining({
          body: {
            api_key: '[REDACTED]',
            secret: '[REDACTED]',
            authorization: '[REDACTED]',
            normalField: 'visible',
          },
        })
      );
    });
  });

  describe('response logging', () => {
    it('should log response with duration', () => {
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Simulate sending response
      (mockResponse.send as jest.Mock).call(mockResponse, '{"result":"ok"}');

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringMatching(/← GET \/api\/test 200 \d+ms/),
        expect.objectContaining({
          statusCode: 200,
        })
      );
    });

    it('should log error level for 4xx responses', () => {
      mockResponse.statusCode = 400;

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      (mockResponse.send as jest.Mock).call(mockResponse, '{"error":"bad"}');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringMatching(/← GET \/api\/test 400 \d+ms/),
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });

    it('should log error level for 5xx responses', () => {
      mockResponse.statusCode = 500;

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      (mockResponse.send as jest.Mock).call(mockResponse, '{"error":"server"}');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringMatching(/← GET \/api\/test 500 \d+ms/),
        expect.objectContaining({
          statusCode: 500,
        })
      );
    });
  });
});
