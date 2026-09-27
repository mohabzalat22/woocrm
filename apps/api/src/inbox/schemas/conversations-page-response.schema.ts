import { z } from 'zod';
import { ConversationResponseSchema } from './conversation-response.schema';

export const ConversationsPageResponseSchema = z.object({
  data: z.array(ConversationResponseSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
