import { z } from 'zod';

export const DadJokeSchema = z.object({
  id: z.string(),
  joke: z.string(),
  status: z.number(),
});

export type DadJokeDto = z.infer<typeof DadJokeSchema>;
