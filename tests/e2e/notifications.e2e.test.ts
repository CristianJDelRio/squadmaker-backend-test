import request from 'supertest';
import { Application } from 'express';
import { Server } from '../../src/shared/infrastructure/http/Server';
import { WinstonLogger } from '../../src/shared/infrastructure/logger/WinstonLogger';

describe('POST /api/alerta', () => {
  let server: Server;
  let app: Application;

  beforeAll(async () => {
    const logger = new WinstonLogger();
    server = new Server(logger);
    app = server.getApp();
  });

  describe('Success cases', () => {
    it('should send alert via email (default)', async () => {
      const response = await request(app)
        .post('/api/alerta')
        .send({
          recipient: 'user@example.com',
          message: 'System alert: server down',
        })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Alert sent successfully',
      });
    });

    it('should send alert via SMS when specified', async () => {
      const response = await request(app)
        .post('/api/alerta')
        .send({
          recipient: '+1234567890',
          message: 'Urgent: System down',
          channel: 'sms',
        })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Alert sent successfully',
      });
    });

    it('should send alert via email when channel is specified', async () => {
      const response = await request(app)
        .post('/api/alerta')
        .send({
          recipient: 'admin@example.com',
          message: 'Test alert',
          channel: 'email',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Validation errors', () => {
    it('should return 400 when recipient is missing', async () => {
      const response = await request(app)
        .post('/api/alerta')
        .send({
          message: 'Test message',
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when message is missing', async () => {
      const response = await request(app)
        .post('/api/alerta')
        .send({
          recipient: 'user@example.com',
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when recipient is empty', async () => {
      await request(app)
        .post('/api/alerta')
        .send({
          recipient: '',
          message: 'Test',
        })
        .expect(400);
    });

    it('should return 400 when message is empty', async () => {
      await request(app)
        .post('/api/alerta')
        .send({
          recipient: 'user@example.com',
          message: '',
        })
        .expect(400);
    });

    it('should return 400 when channel is invalid', async () => {
      const response = await request(app)
        .post('/api/alerta')
        .send({
          recipient: 'user@example.com',
          message: 'Test',
          channel: 'telegram',
        })
        .expect(400);

      expect(response.body.error).toContain('Validation error');
    });
  });
});
