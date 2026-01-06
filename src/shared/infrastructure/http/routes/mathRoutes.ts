import { Router, Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CalculateLCM } from '../../../../contexts/math/application/CalculateLCM';
import { IncrementNumber } from '../../../../contexts/math/application/IncrementNumber';
import {
  LCMQuerySchema,
  IncrementQuerySchema,
} from '../validation/mathSchemas';

export function createMathRoutes(): Router {
  const router = Router();

  const calculateLCM = new CalculateLCM();
  const incrementNumber = new IncrementNumber();

  /**
   * @swagger
   * /api/v1/math/lcm:
   *   get:
   *     summary: Calculate LCM (Least Common Multiple)
   *     description: Calculates the least common multiple of the provided numbers
   *     tags:
   *       - Math
   *     parameters:
   *       - in: query
   *         name: numbers
   *         required: true
   *         schema:
   *           type: string
   *           example: "12,18"
   *         description: Comma-separated list of positive integers
   *     responses:
   *       200:
   *         description: LCM calculated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 numbers:
   *                   type: array
   *                   items:
   *                     type: integer
   *                   example: [12, 18]
   *                 lcm:
   *                   type: integer
   *                   example: 36
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  router.get('/lcm', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = LCMQuerySchema.parse(req.query);

      const numbersStr = query.numbers.trim();
      if (numbersStr === '') {
        return res.status(400).json({
          error: 'Numbers array cannot be empty',
        });
      }

      const parsedNumbers: number[] = [];
      for (const n of numbersStr.split(',')) {
        const num = Number(n.trim());
        if (isNaN(num)) {
          return res.status(400).json({
            error: `Invalid number: ${n.trim()}`,
          });
        }
        parsedNumbers.push(num);
      }

      const lcm = calculateLCM.execute(parsedNumbers);

      return res.status(200).json({
        numbers: parsedNumbers,
        lcm,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues,
        });
      }
      return next(error);
    }
  });

  /**
   * @swagger
   * /api/v1/math/increment:
   *   get:
   *     summary: Increment a number
   *     description: Increments the provided number by 1
   *     tags:
   *       - Math
   *     parameters:
   *       - in: query
   *         name: number
   *         required: true
   *         schema:
   *           type: integer
   *           example: 5
   *         description: The number to increment
   *     responses:
   *       200:
   *         description: Number incremented successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 original:
   *                   type: integer
   *                   example: 5
   *                 incremented:
   *                   type: integer
   *                   example: 6
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  router.get(
    '/increment',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = IncrementQuerySchema.parse(req.query);

        const num = Number(query.number);
        if (isNaN(num)) {
          return res.status(400).json({
            error: 'Number must be a valid number',
          });
        }

        const incremented = incrementNumber.execute(num);

        return res.status(200).json({
          original: num,
          incremented,
        });
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            error: 'Validation failed',
            details: error.issues,
          });
        }
        return next(error);
      }
    }
  );

  return router;
}
