import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Squadmaker REST API',
      version: '1.0.0',
      description:
        'A REST API for joke management with external API integrations, mathematical operations, and AI-powered joke fusion using Claude API',
      contact: {
        name: 'API Support',
        email: 'support@squadmaker.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Development server',
      },
      {
        url: 'https://squadmaker-backend-test-production.up.railway.app',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Jokes',
        description: 'Joke management endpoints',
      },
      {
        name: 'Math',
        description: 'Mathematical operations endpoints',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Resource not found',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 404,
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Validation error message',
              example: 'Validation failed',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
              example: 400,
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['text'],
                  },
                  message: {
                    type: 'string',
                    example: 'Text must be at least 1 character',
                  },
                },
              },
            },
          },
        },
        Joke: {
          type: 'object',
          required: ['id', 'text', 'userId', 'categoryId', 'createdAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the joke',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            text: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'The joke text content',
              example:
                'Why did the chicken cross the road? To get to the other side!',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the user who created the joke',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the joke category',
              example: '987fcdeb-51a2-43f7-b890-123456789abc',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the joke was created',
              example: '2025-01-06T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the joke was last updated',
              example: '2025-01-06T15:45:00.000Z',
            },
          },
        },
        CreateJokeRequest: {
          type: 'object',
          required: ['text', 'userId', 'categoryId'],
          properties: {
            text: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'The joke text content',
              example:
                'Why did the chicken cross the road? To get to the other side!',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the user creating the joke',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the joke category',
              example: '987fcdeb-51a2-43f7-b890-123456789abc',
            },
          },
        },
        UpdateJokeRequest: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'Updated joke text content',
              example: 'Updated: Why did the chicken cross the road?',
            },
          },
        },
        JokesList: {
          type: 'object',
          properties: {
            jokes: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Joke',
              },
            },
            total: {
              type: 'integer',
              description: 'Total number of jokes',
              example: 42,
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
              description: 'Health status of the service',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Current server timestamp',
              example: '2025-01-06T10:30:00.000Z',
            },
          },
        },
      },
    },
  },
  apis: ['./src/**/*.ts', './dist/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
