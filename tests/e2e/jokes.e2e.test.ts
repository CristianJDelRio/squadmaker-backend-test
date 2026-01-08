import request from 'supertest';
import { Application } from 'express';
import { PrismaClient } from '@prisma/client';
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
} from '../../src/contexts/jokes/infrastructure/http/jokeSchemas';

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

  describe('GET /api/v1/jokes/paired', () => {
    it('should fetch paired jokes from external APIs and combine them', async () => {
      const response = await request(app)
        .get('/api/v1/jokes/paired')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);

      response.body.forEach(
        (joke: { chuck: string; dad: string; combined: string }) => {
          expect(joke).toHaveProperty('chuck');
          expect(joke).toHaveProperty('dad');
          expect(joke).toHaveProperty('combined');
          expect(typeof joke.chuck).toBe('string');
          expect(typeof joke.dad).toBe('string');
          expect(typeof joke.combined).toBe('string');
        }
      );
    }, 30000);
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
      expect(response.body.error).toContain(
        'Invalid parameter. Must be a joke type (\"chuck\" or \"dad\") or a valid UUID'
      );
    });

    it('should get joke by UUID', async () => {
      const newJoke: CreateJokeRequest = {
        text: 'Joke to fetch by UUID',
        userId: testUserId,
        categoryId: testCategoryId,
      };

      const createResponse = await request(app)
        .post('/api/v1/jokes')
        .send(newJoke)
        .expect(201);

      const jokeId: string = createResponse.body.id;

      const getResponse = await request(app)
        .get(`/api/v1/jokes/${jokeId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(jokeId);
      expect(getResponse.body.text).toBe('Joke to fetch by UUID');
    });

    it('should return 404 when UUID joke not found', async () => {
      const nonExistentUUID = '550e8400-e29b-41d4-a716-446655440000';

      await request(app).get(`/api/v1/jokes/${nonExistentUUID}`).expect(404);
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

    it('should return error when userId does not exist', async () => {
      const jokeWithInvalidUser: CreateJokeRequest = {
        text: 'Valid joke text',
        userId: '00000000-0000-0000-0000-000000000000',
        categoryId: testCategoryId,
      };

      const response = await request(app)
        .post('/api/v1/jokes')
        .send(jokeWithInvalidUser);

      // Should return 404 or 500 depending on error handling
      expect([404, 500]).toContain(response.status);
    });

    it('should return error when categoryId does not exist', async () => {
      const jokeWithInvalidCategory: CreateJokeRequest = {
        text: 'Valid joke text',
        userId: testUserId,
        categoryId: '00000000-0000-0000-0000-000000000000',
      };

      const response = await request(app)
        .post('/api/v1/jokes')
        .send(jokeWithInvalidCategory);

      // Should return 404 or 500 depending on error handling
      expect([404, 500]).toContain(response.status);
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

    it('should filter by userName (SQL query)', async () => {
      const response = await request(app)
        .get('/api/v1/jokes?userName=test-user-e2e')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by categoryName (SQL query)', async () => {
      const response = await request(app)
        .get('/api/v1/jokes?categoryName=test-category-e2e')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by userName and categoryName (SQL query)', async () => {
      const response = await request(app)
        .get(
          '/api/v1/jokes?userName=test-user-e2e&categoryName=test-category-e2e'
        )
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return empty array for non-existent userName', async () => {
      const response = await request(app)
        .get('/api/v1/jokes?userName=non-existent-user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return empty array for non-existent categoryName', async () => {
      const response = await request(app)
        .get('/api/v1/jokes?categoryName=non-existent-category')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
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

    it('should return 400 when text is missing in update', async () => {
      const newJoke: CreateJokeRequest = {
        text: 'Original joke for update validation',
        userId: testUserId,
        categoryId: testCategoryId,
      };

      const createResponse = await request(app)
        .post('/api/v1/jokes')
        .send(newJoke)
        .expect(201);

      const jokeId: string = createResponse.body.id;

      const response = await request(app)
        .put(`/api/v1/jokes/${jokeId}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text is empty string', async () => {
      const newJoke: CreateJokeRequest = {
        text: 'Original joke for empty text validation',
        userId: testUserId,
        categoryId: testCategoryId,
      };

      const createResponse = await request(app)
        .post('/api/v1/jokes')
        .send(newJoke)
        .expect(201);

      const jokeId: string = createResponse.body.id;

      const response = await request(app)
        .put(`/api/v1/jokes/${jokeId}`)
        .send({ text: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
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
