import { Router, Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaJokeRepository } from '../../../../contexts/jokes/infrastructure/persistence/PrismaJokeRepository';
import { getPrismaClient } from '../../../../contexts/shared/infrastructure/persistence/prisma/PrismaClientSingleton';
import { CreateJoke } from '../../../../contexts/jokes/application/CreateJoke';
import { GetJoke } from '../../../../contexts/jokes/application/GetJoke';
import { GetJokes } from '../../../../contexts/jokes/application/GetJokes';
import { UpdateJoke } from '../../../../contexts/jokes/application/UpdateJoke';
import { DeleteJoke } from '../../../../contexts/jokes/application/DeleteJoke';
import { FetchExternalJoke } from '../../../../contexts/jokes/application/FetchExternalJoke';
import { ChuckNorrisApiService } from '../../../../contexts/jokes/infrastructure/external-apis/ChuckNorrisApiService';
import { DadJokesApiService } from '../../../../contexts/jokes/infrastructure/external-apis/DadJokesApiService';
import { FetchPairedJokes } from '../../../../contexts/paired-jokes/application/FetchPairedJokes';
import { ClaudeApiService } from '../../../../contexts/paired-jokes/infrastructure/external-apis/ClaudeApiService';
import {
  CreateJokeRequestSchema,
  UpdateJokeRequestSchema,
  GetJokesQuerySchema,
  JokeTypeParamSchema,
} from '../validation/jokeSchemas';

function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function createJokesRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  const repository = new PrismaJokeRepository(prisma);

  const chuckNorrisService = new ChuckNorrisApiService();
  const dadJokesService = new DadJokesApiService();
  const claudeService = new ClaudeApiService();

  const createJoke = new CreateJoke(repository);
  const getJoke = new GetJoke(repository);
  const getJokes = new GetJokes(repository);
  const updateJoke = new UpdateJoke(repository);
  const deleteJoke = new DeleteJoke(repository);
  const fetchExternalJoke = new FetchExternalJoke(
    chuckNorrisService,
    dadJokesService
  );
  const fetchPairedJokes = new FetchPairedJokes(
    chuckNorrisService,
    dadJokesService,
    claudeService
  );

  /**
   * @swagger
   * /api/v1/jokes:
   *   post:
   *     summary: Create a new joke
   *     description: Creates a new joke in the database
   *     tags:
   *       - Jokes
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateJokeRequest'
   *     responses:
   *       201:
   *         description: Joke created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Joke'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   */
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateJokeRequestSchema.parse(req.body);
      const joke = await createJoke.execute(validatedData);
      res.status(201).json(joke.toPrimitives());
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ error: error?.issues?.[0]?.message || 'Validation error' });
      }
      return next(error);
    }
  });

  /**
   * @swagger
   * /api/v1/jokes:
   *   get:
   *     summary: List all jokes
   *     description: Retrieves a list of jokes with optional filtering by userId and categoryId
   *     tags:
   *       - Jokes
   *     parameters:
   *       - in: query
   *         name: userId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter jokes by user ID
   *         example: '123e4567-e89b-12d3-a456-426614174000'
   *       - in: query
   *         name: categoryId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter jokes by category ID
   *         example: '987fcdeb-51a2-43f7-b890-123456789abc'
   *     responses:
   *       200:
   *         description: List of jokes retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Joke'
   *       400:
   *         description: Validation error in query parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   */
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = GetJokesQuerySchema.parse(req.query);
      const jokes = await getJokes.execute(validatedQuery);
      res.json(jokes.map((joke) => joke.toPrimitives()));
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ error: error?.issues?.[0]?.message || 'Validation error' });
      }
      return next(error);
    }
  });

  /**
   * @swagger
   * /api/v1/jokes/paired:
   *   get:
   *     summary: Fetch 5 paired jokes
   *     description: Fetches 5 Chuck Norris jokes and 5 Dad Jokes in parallel, then combines each pair using Claude AI
   *     tags:
   *       - Jokes
   *     responses:
   *       200:
   *         description: Array of 5 paired jokes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   chuck:
   *                     type: string
   *                     example: Chuck Norris can divide by zero.
   *                   dad:
   *                     type: string
   *                     example: Why did the scarecrow win an award? He was outstanding in his field.
   *                   combined:
   *                     type: string
   *                     example: Chuck Norris can divide by zero while being outstanding in his field.
   *       500:
   *         description: Error fetching or combining jokes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get(
    '/paired',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const pairedJokes = await fetchPairedJokes.execute();
        res.json(pairedJokes.map((joke) => joke.toPrimitives()));
      } catch (error) {
        return next(error);
      }
    }
  );

  /**
   * @swagger
   * /api/v1/jokes/{typeOrId}:
   *   get:
   *     summary: Get a joke by ID or fetch from external API
   *     description: Fetches a joke from the database by UUID, or fetches a random joke from an external API (Chuck Norris or Dad Jokes) if type is 'chuck' or 'dad'
   *     tags:
   *       - Jokes
   *     parameters:
   *       - in: path
   *         name: typeOrId
   *         required: true
   *         schema:
   *           type: string
   *         description: Either a joke UUID or an external API type ('chuck' or 'dad')
   *         examples:
   *           uuid:
   *             value: '550e8400-e29b-41d4-a716-446655440000'
   *             summary: Get joke by ID
   *           chuck:
   *             value: 'chuck'
   *             summary: Fetch Chuck Norris joke
   *           dad:
   *             value: 'dad'
   *             summary: Fetch Dad joke
   *     responses:
   *       200:
   *         description: Joke retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               oneOf:
   *                 - $ref: '#/components/schemas/Joke'
   *                 - type: object
   *                   properties:
   *                     joke:
   *                       type: string
   *                       example: Chuck Norris can divide by zero.
   *       400:
   *         description: Invalid joke type or ID format
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   *       404:
   *         description: Joke not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Error fetching from external API
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get(
    '/:type',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedParams = JokeTypeParamSchema.parse(req.params);
        const { type } = validatedParams;

        if (isUUID(type)) {
          const joke = await getJoke.execute(type);
          return res.json(joke.toPrimitives());
        }

        const joke = await fetchExternalJoke.execute(
          type.toLowerCase() as 'chuck' | 'dad'
        );
        res.json({ joke });
      } catch (error) {
        if (error instanceof ZodError) {
          return res
            .status(400)
            .json({ error: error?.issues?.[0]?.message || 'Validation error' });
        }
        return next(error);
      }
    }
  );

  /**
   * @swagger
   * /api/v1/jokes/{id}:
   *   put:
   *     summary: Update a joke
   *     description: Updates the text of an existing joke by ID
   *     tags:
   *       - Jokes
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The joke ID
   *         example: '550e8400-e29b-41d4-a716-446655440000'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateJokeRequest'
   *     responses:
   *       200:
   *         description: Joke updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Joke'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   *       404:
   *         description: Joke not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const validatedData = UpdateJokeRequestSchema.parse(req.body);
        const joke = await updateJoke.execute({
          id: id!,
          text: validatedData.text,
        });
        res.json(joke.toPrimitives());
      } catch (error) {
        if (error instanceof ZodError) {
          return res
            .status(400)
            .json({ error: error?.issues?.[0]?.message || 'Validation error' });
        }
        return next(error);
      }
    }
  );

  /**
   * @swagger
   * /api/v1/jokes/{id}:
   *   delete:
   *     summary: Delete a joke
   *     description: Deletes an existing joke by ID
   *     tags:
   *       - Jokes
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The joke ID to delete
   *         example: '550e8400-e29b-41d4-a716-446655440000'
   *     responses:
   *       204:
   *         description: Joke deleted successfully
   *       404:
   *         description: Joke not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        await deleteJoke.execute(id as string);
        res.status(204).send();
      } catch (error) {
        return next(error);
      }
    }
  );

  return router;
}
