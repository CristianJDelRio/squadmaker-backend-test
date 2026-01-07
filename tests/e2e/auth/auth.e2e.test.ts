import request from 'supertest';
import { Server } from '../../../src/shared/infrastructure/http/Server';
import { WinstonLogger } from '../../../src/shared/infrastructure/logger/WinstonLogger';
import { Application } from 'express';

describe('Auth API E2E Tests', () => {
  let server: Server;
  let app: Application;

  beforeAll(async () => {
    const logger = new WinstonLogger();
    server = new Server(logger);
    app = server.getApp();
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid user credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('user@example.com');
      expect(response.body.user.role).toBe('user');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should login successfully with valid admin credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'admin@example.com',
        password: 'admin123',
      });

      expect(response.status).toBe(200);
      expect(response.body.user.role).toBe('admin');
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation error');
    });

    it('should return 400 with short password', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@example.com',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation error');
    });
  });

  describe('GET /api/usuario', () => {
    let userToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'user@example.com',
        password: 'password123',
      });
      userToken = loginResponse.body.token;
    });

    it('should access user area with valid user token', async () => {
      const response = await request(app)
        .get('/api/usuario')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Welcome to the user area');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.role).toBe('user');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/usuario');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('No token provided');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/usuario')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('GET /api/admin', () => {
    let adminToken: string;
    let userToken: string;

    beforeAll(async () => {
      const adminLogin = await request(app).post('/auth/login').send({
        email: 'admin@example.com',
        password: 'admin123',
      });
      adminToken = adminLogin.body.token;

      const userLogin = await request(app).post('/auth/login').send({
        email: 'user@example.com',
        password: 'password123',
      });
      userToken = userLogin.body.token;
    });

    it('should access admin area with valid admin token', async () => {
      const response = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Welcome to the admin area');
      expect(response.body.user.role).toBe('admin');
    });

    it('should return 403 when user tries to access admin area', async () => {
      const response = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden: insufficient permissions');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/admin');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('No token provided');
    });
  });
});
