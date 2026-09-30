import { z } from 'zod';

export const NoteSchema = z.object({
  id: z.string(),
  content: z
    .string()
    .min(1)
    .max(500, 'Please make short note less than 500 chars.'),
  conversationId: z.string(),
  workspaceMemberId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
