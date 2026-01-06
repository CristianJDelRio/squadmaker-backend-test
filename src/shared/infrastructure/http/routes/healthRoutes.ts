import { Router, Request, Response } from 'express';

export function createHealthRoutes(): Router {
  const router = Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
