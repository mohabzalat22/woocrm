import { z } from 'zod';
import { MessageDirectionSchema } from './message-direction.schema';
import { MessageStatusSchema } from './message-status.schema';
import { stringToDate } from '../../common/types/stringToDate';

export const MessageResponseSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  direction: MessageDirectionSchema,
  content: z.string(),
  status: MessageStatusSchema,
  senderMemberId: z.string().nullable(),
  externalId: z.string().nullable(),
  createdAt: stringToDate,
});
