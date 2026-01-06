import { Router, Request, Response } from 'express';

export function createHealthRoutes(): Router {
  const router = Router();

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     description: Returns the health status of the API service
   *     tags:
   *       - Health
   *     responses:
   *       200:
   *         description: Service is healthy and running
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthResponse'
   *             example:
   *               status: ok
   *               timestamp: '2025-01-06T10:30:00.000Z'
   */
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
