import { z } from 'zod';

export const CreateJokeRequestSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty'),
  userId: z.string().min(1, 'UserId cannot be empty'),
  categoryId: z.string().min(1, 'CategoryId cannot be empty'),
});

export const UpdateJokeRequestSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty'),
});

export const GetJokesQuerySchema = z.object({
  userId: z.string().optional(),
  categoryId: z.string().optional(),
});

export const JokeTypeParamSchema = z.object({
  type: z.enum(['Chuck', 'chuck', 'Dad', 'dad'], {
    message: 'Invalid joke type. Must be "Chuck" or "Dad"',
  }),
});

export type CreateJokeRequest = z.infer<typeof CreateJokeRequestSchema>;
export type UpdateJokeRequest = z.infer<typeof UpdateJokeRequestSchema>;
export type GetJokesQuery = z.infer<typeof GetJokesQuerySchema>;
export type JokeTypeParam = z.infer<typeof JokeTypeParamSchema>;
