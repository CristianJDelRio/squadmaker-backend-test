import { z } from 'zod';

export const sendAlertSchema = z.object({
  recipient: z.string().min(1, 'Recipient cannot be empty'),
  message: z.string().min(1, 'Message cannot be empty'),
  channel: z.enum(['email', 'sms']).optional().default('email'),
});

export type SendAlertRequest = z.infer<typeof sendAlertSchema>;
