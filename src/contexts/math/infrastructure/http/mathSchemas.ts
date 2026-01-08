import { z } from 'zod';

export const LCMQuerySchema = z.object({
  numbers: z.string().min(1, 'numbers parameter is required'),
});

export const IncrementQuerySchema = z.object({
  number: z.string().min(1, 'number parameter is required'),
});

export type LCMQuery = z.infer<typeof LCMQuerySchema>;
export type IncrementQuery = z.infer<typeof IncrementQuerySchema>;
