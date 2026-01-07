import { Router, Request, Response } from 'express';
import { sendAlertSchema } from './notificationSchemas';
import { SendAlert } from '../../application/SendAlert';
import { NotifierFactory } from '../factories/NotifierFactory';
import { Logger } from '../../../../shared/infrastructure/logger/Logger';
import { ZodError } from 'zod';
import { $ZodIssue } from 'zod/v4/core';

export function createNotificationRoutes(logger: Logger): Router {
  const router = Router();

  /**
   * @swagger
   * /api/alerta:
   *   post:
   *     summary: Send an alert notification
   *     description: Send an alert via email or SMS to a specified recipient
   *     tags: [Notifications]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SendAlertRequest'
   *     responses:
   *       200:
   *         description: Alert sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SendAlertResponse'
   *       400:
   *         description: Validation error or invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post(
    '/alerta',
    async (
      req: Request,
      res: Response
    ): Promise<void | Response<{ error: string; details?: $ZodIssue }>> => {
      try {
        const validatedData = sendAlertSchema.parse(req.body);
        const { recipient, message, channel } = validatedData;

        const notifier = NotifierFactory.create(channel, logger);
        const sendAlert = new SendAlert(notifier);

        await sendAlert.execute(recipient, message);

        res.status(200).json({
          success: true,
          message: 'Alert sent successfully',
        });
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            error: 'Validation error',
            details: error.issues,
          });
        }

        if (error instanceof Error) {
          return res.status(400).json({
            error: error.message,
          });
        }

        res.status(500).json({
          error: 'Internal server error',
        });
      }
    }
  );

  return router;
}
