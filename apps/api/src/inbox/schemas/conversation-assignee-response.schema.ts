import { z } from 'zod';

export const ConversationAssigneeResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  role: z.string(),
});
