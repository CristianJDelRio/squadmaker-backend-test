import request from 'supertest';
import { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Server } from '../../src/shared/infrastructure/http/Server';
import { WinstonLogger } from '../../src/shared/infrastructure/logger/WinstonLogger';
import {
  getTestPrismaClient,
  closeTestPrismaClient,
  cleanDatabase,
  cleanAllDatabase,
  seedTestData,
} from '../helpers/test-database';
import { setPrismaClient } from '../../src/contexts/shared/infrastructure/persistence/prisma/PrismaClientSingleton';
import {
  CreateJokeRequest,
  UpdateJokeRequest,
} from '../../src/shared/infrastructure/http/validation/jokeSchemas';

dotenv.config({
  path: path.resolve(__dirname, '../../.env.test'),
  override: true,
});

describe('Jokes API E2E', () => {
  let app: Application;
  let prisma: PrismaClient;
  let testUserId: string;
  let testCategoryId: string;

  beforeAll(async () => {
    prisma = getTestPrismaClient();
    setPrismaClient(prisma);

    const { user, category } = await seedTestData(prisma);
    testUserId = user.id;
    testCategoryId = category.id;

    const logger = new WinstonLogger();
    const server = new Server(logger);
    app = server.getApp();
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    await cleanAllDatabase(prisma);
    await closeTestPrismaClient();
  });

  describe('GET /api/v1/jokes/:type', () => {
    it('should fetch Chuck Norris joke', async () => {
      const response = await request(app)
        .get('/api/v1/jokes/Chuck')
        .expect(200);

      expect(response.body).toHaveProperty('joke');
      expect(typeof response.body.joke).toBe('string');
      expect(response.body.joke.length).toBeGreaterThan(0);
    });

    it('should fetch Dad joke', async () => {
      const response = await request(app).get('/api/v1/jokes/Dad').expect(200);

      expect(response.body).toHaveProperty('joke');
      expect(typeof response.body.joke).toBe('string');
      expect(response.body.joke.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', async () => {
      const response = await request(app)
        .get('/api/v1/jokes/chuck')
        .expect(200);

      expect(response.body).toHaveProperty('joke');
    });

    it('should return 400 for invalid type', async () => {
      const response = await request(app)
        .get('/api/v1/jokes/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid joke type');
    });
  });

  describe('POST /api/v1/jokes', () => {
    it('should create a new joke', async () => {
      const newJoke: CreateJokeRequest = {
        text: 'This is a test joke',
        userId: testUserId,
        categoryId: testCategoryId,
      };

      const response = await request(app)
        .post('/api/v1/jokes')
        .send(newJoke)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.text).toBe(newJoke.text);
      expect(response.body.userId).toBe(newJoke.userId);
      expect(response.body.categoryId).toBe(newJoke.categoryId);
    });

    it('should return 400 when text is missing', async () => {
      const invalidJoke: Omit<CreateJokeRequest, 'text'> = {
        userId: testUserId,
        categoryId: testCategoryId,
      };

      await request(app).post('/api/v1/jokes').send(invalidJoke).expect(400);
    });
  });

  describe('GET /api/v1/jokes', () => {
    it('should return list of jokes', async () => {
      const response = await request(app).get('/api/v1/jokes').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by userId', async () => {
      const response = await request(app)
        .get(`/api/v1/jokes?userId=${testUserId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by categoryId', async () => {
      const response = await request(app)
        .get(`/api/v1/jokes?categoryId=${testCategoryId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/v1/jokes/:id', () => {
    it('should update a joke', async () => {
      const newJoke: CreateJokeRequest = {
        text: 'Original joke',
        userId: testUserId,
        categoryId: testCategoryId,
      };

      const createResponse = await request(app)
        .post('/api/v1/jokes')
        .send(newJoke)
        .expect(201);

      const jokeId: string = createResponse.body.id;

      const updateData: UpdateJokeRequest = { text: 'Updated joke' };

      const updateResponse = await request(app)
        .put(`/api/v1/jokes/${jokeId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.id).toBe(jokeId);
      expect(updateResponse.body.text).toBe('Updated joke');
    });

    it('should return 404 for non-existent joke', async () => {
      const updateData: UpdateJokeRequest = { text: 'Updated joke' };

      await request(app)
        .put('/api/v1/jokes/non-existent-id')
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/v1/jokes/:id', () => {
    it('should delete a joke', async () => {
      const newJoke: CreateJokeRequest = {
        text: 'Joke to delete',
        userId: testUserId,
        categoryId: testCategoryId,
      };

      const createResponse = await request(app)
        .post('/api/v1/jokes')
        .send(newJoke)
        .expect(201);

      const jokeId: string = createResponse.body.id;

      await request(app).delete(`/api/v1/jokes/${jokeId}`).expect(204);
    });

    it('should return 404 for non-existent joke', async () => {
      await request(app).delete('/api/v1/jokes/non-existent-id').expect(404);
    });
  });
});
