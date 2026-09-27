import { z } from 'zod';

export const CreateMessageSchema = z.object({
  content: z.string().trim().min(1).max(10000),
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
