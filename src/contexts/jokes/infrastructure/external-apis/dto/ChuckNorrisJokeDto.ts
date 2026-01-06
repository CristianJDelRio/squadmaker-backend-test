import { z } from 'zod';

export const ChuckNorrisJokeSchema = z.object({
  icon_url: z.string(),
  id: z.string(),
  url: z.string(),
  value: z.string(),
});

export type ChuckNorrisJokeDto = z.infer<typeof ChuckNorrisJokeSchema>;
