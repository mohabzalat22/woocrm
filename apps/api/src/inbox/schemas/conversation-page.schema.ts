import { z } from 'zod';
import { ConversationSchema } from './conversation.schema';

export const ConversationsPageSchema = z.object({
  data: z.array(ConversationSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
