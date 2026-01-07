import { Router, Request, Response } from 'express';
import { Login } from '../../application/Login';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { JwtService } from '../services/JwtService';
import { authenticateJwt } from './middlewares/authenticateJwt';
import { requireRole } from './middlewares/requireRole';
import { User } from '../../domain/entities/User';
import { env } from '../../../../shared/infrastructure/config/env';
import { loginSchema } from './authSchemas';
import { ZodError } from 'zod';
import { UnauthorizedError } from '../../../../contexts/shared/domain/errors/UnauthorizedError';
import { AuthenticatedRequest } from './types/AuthenticatedRequest';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: password123
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: 550e8400-e29b-41d4-a716-446655440000
 *             name:
 *               type: string
 *               example: john doe
 *             email:
 *               type: string
 *               example: user@example.com
 *             role:
 *               type: string
 *               enum: [user, admin]
 *               example: user
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     UserInfo:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export const createAuthRoutes = (): Router => {
  const router = Router();
  const userRepository = new InMemoryUserRepository();
  const jwtService = new JwtService(env.jwtSecret, env.jwtExpiresIn);
  const loginUseCase = new Login(userRepository, jwtService);

  seedMockUsers(userRepository);

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: User login
   *     description: Authenticate user with email and password, returns JWT token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Validation error
   *                 details:
   *                   type: array
   *                   items:
   *                     type: object
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Invalid credentials
   */
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const result = await loginUseCase.execute({
        email: validatedData.email,
        password: validatedData.password,
      });

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.issues,
        });
        return;
      }

      if (error instanceof UnauthorizedError) {
        res.status(401).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * @swagger
   * /api/usuario:
   *   get:
   *     summary: Get user area (protected)
   *     description: Access user area - requires valid JWT with 'user' role
   *     tags: [Authentication]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: User area accessed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserInfo'
   *       401:
   *         description: Unauthorized - No token or invalid token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       403:
   *         description: Forbidden - Insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  router.get(
    '/usuario',
    authenticateJwt(jwtService),
    requireRole('user'),
    (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      res.status(200).json({
        message: 'Welcome to the user area',
        user: {
          id: authReq.user.sub,
          name: authReq.user.name,
          email: authReq.user.email,
          role: authReq.user.role,
        },
      });
    }
  );

  /**
   * @swagger
   * /api/admin:
   *   get:
   *     summary: Get admin area (protected)
   *     description: Access admin area - requires valid JWT with 'admin' role
   *     tags: [Authentication]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Admin area accessed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserInfo'
   *       401:
   *         description: Unauthorized - No token or invalid token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       403:
   *         description: Forbidden - Insufficient permissions (requires admin role)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  router.get(
    '/admin',
    authenticateJwt(jwtService),
    requireRole('admin'),
    (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      res.status(200).json({
        message: 'Welcome to the admin area',
        user: {
          id: authReq.user.sub,
          name: authReq.user.name,
          email: authReq.user.email,
          role: authReq.user.role,
        },
      });
    }
  );

  return router;
};

function seedMockUsers(repository: InMemoryUserRepository): void {
  const mockUsers = [
    User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    }),
    User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    }),
    User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password456',
      role: 'user',
    }),
  ];

  mockUsers.forEach((user) => repository.save(user));
}
