import request from 'supertest';
import { Application } from 'express';
import { Server } from '../../src/shared/infrastructure/http/Server';
import { WinstonLogger } from '../../src/shared/infrastructure/logger/WinstonLogger';

describe('Health Check E2E', () => {
  let app: Application;

  beforeAll(() => {
    const logger = new WinstonLogger();
    const server = new Server(logger);
    app = server.getApp();
  });

  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
      });
    });

    it('should return a valid ISO timestamp', async () => {
      const response = await request(app).get('/health').expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });
  });
});
