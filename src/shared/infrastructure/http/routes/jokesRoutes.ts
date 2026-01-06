import { Router, Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaJokeRepository } from '../../../../contexts/jokes/infrastructure/persistence/PrismaJokeRepository';
import { getPrismaClient } from '../../../../contexts/shared/infrastructure/persistence/prisma/PrismaClientSingleton';
import { CreateJoke } from '../../../../contexts/jokes/application/CreateJoke';
// import { GetJoke } from '../../../../contexts/jokes/application/GetJoke';
import { GetJokes } from '../../../../contexts/jokes/application/GetJokes';
import { UpdateJoke } from '../../../../contexts/jokes/application/UpdateJoke';
import { DeleteJoke } from '../../../../contexts/jokes/application/DeleteJoke';
import { FetchExternalJoke } from '../../../../contexts/jokes/application/FetchExternalJoke';
import { ChuckNorrisApiService } from '../../../../contexts/jokes/infrastructure/external-apis/ChuckNorrisApiService';
import { DadJokesApiService } from '../../../../contexts/jokes/infrastructure/external-apis/DadJokesApiService';
import {
  CreateJokeRequestSchema,
  UpdateJokeRequestSchema,
  GetJokesQuerySchema,
  JokeTypeParamSchema,
} from '../validation/jokeSchemas';

export function createJokesRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  const repository = new PrismaJokeRepository(prisma);

  const chuckNorrisService = new ChuckNorrisApiService();
  const dadJokesService = new DadJokesApiService();

  const createJoke = new CreateJoke(repository);
  // const getJoke = new GetJoke(repository); TODO: Implement if needed
  const getJokes = new GetJokes(repository);
  const updateJoke = new UpdateJoke(repository);
  const deleteJoke = new DeleteJoke(repository);
  const fetchExternalJoke = new FetchExternalJoke(
    chuckNorrisService,
    dadJokesService
  );

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

  router.get(
    '/:type',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedParams = JokeTypeParamSchema.parse(req.params);
        const joke = await fetchExternalJoke.execute(validatedParams.type);
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
