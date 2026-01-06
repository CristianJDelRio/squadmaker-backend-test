import request from 'supertest';
import { Application } from 'express';
import { Server } from '../../src/shared/infrastructure/http/Server';
import { WinstonLogger } from '../../src/shared/infrastructure/logger/WinstonLogger';

describe('Math Endpoints E2E', () => {
  let app: Application;

  beforeAll(() => {
    const logger = new WinstonLogger();
    const server = new Server(logger);
    app = server.getApp();
  });

  describe('GET /api/v1/math/lcm', () => {
    it('should calculate LCM of two numbers', async () => {
      const response = await request(app)
        .get('/api/v1/math/lcm')
        .query({ numbers: '12,18' })
        .expect(200);

      expect(response.body).toEqual({
        numbers: [12, 18],
        lcm: 36,
      });
    });

    it('should calculate LCM of three numbers', async () => {
      const response = await request(app)
        .get('/api/v1/math/lcm')
        .query({ numbers: '12,18,24' })
        .expect(200);

      expect(response.body).toEqual({
        numbers: [12, 18, 24],
        lcm: 72,
      });
    });

    it('should calculate LCM of a single number', async () => {
      const response = await request(app)
        .get('/api/v1/math/lcm')
        .query({ numbers: '15' })
        .expect(200);

      expect(response.body).toEqual({
        numbers: [15],
        lcm: 15,
      });
    });

    it('should return 400 when numbers parameter is missing', async () => {
      const response = await request(app).get('/api/v1/math/lcm').expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when numbers array is empty', async () => {
      const response = await request(app)
        .get('/api/v1/math/lcm')
        .query({ numbers: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when numbers contain zero', async () => {
      const response = await request(app)
        .get('/api/v1/math/lcm')
        .query({ numbers: '0,5' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when numbers contain negative values', async () => {
      const response = await request(app)
        .get('/api/v1/math/lcm')
        .query({ numbers: '-5,10' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when numbers are not integers', async () => {
      const response = await request(app)
        .get('/api/v1/math/lcm')
        .query({ numbers: '1.5,2.5' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when numbers contain invalid values', async () => {
      const response = await request(app)
        .get('/api/v1/math/lcm')
        .query({ numbers: 'abc,def' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/math/increment', () => {
    it('should increment a positive number by 1', async () => {
      const response = await request(app)
        .get('/api/v1/math/increment')
        .query({ number: '5' })
        .expect(200);

      expect(response.body).toEqual({
        original: 5,
        incremented: 6,
      });
    });

    it('should increment zero to 1', async () => {
      const response = await request(app)
        .get('/api/v1/math/increment')
        .query({ number: '0' })
        .expect(200);

      expect(response.body).toEqual({
        original: 0,
        incremented: 1,
      });
    });

    it('should increment a negative number by 1', async () => {
      const response = await request(app)
        .get('/api/v1/math/increment')
        .query({ number: '-5' })
        .expect(200);

      expect(response.body).toEqual({
        original: -5,
        incremented: -4,
      });
    });

    it('should handle large numbers', async () => {
      const response = await request(app)
        .get('/api/v1/math/increment')
        .query({ number: '999999' })
        .expect(200);

      expect(response.body).toEqual({
        original: 999999,
        incremented: 1000000,
      });
    });

    it('should return 400 when number parameter is missing', async () => {
      const response = await request(app).get('/api/v1/math/increment').expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when number is not an integer', async () => {
      const response = await request(app)
        .get('/api/v1/math/increment')
        .query({ number: '1.5' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when number is not a valid number', async () => {
      const response = await request(app)
        .get('/api/v1/math/increment')
        .query({ number: 'abc' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
