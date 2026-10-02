import { z } from 'zod';
import { ConversationStatusSchema } from './conversation-status.schema';
import { stringToDate } from '../../common/types/stringToDate';

export const ConversationSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  channel: z.string(),
  contactId: z.string(),
  status: ConversationStatusSchema,
  assignedToId: z.string().nullable(),
  lastMessageAt: stringToDate.nullable(),
  lastReadAt: stringToDate.nullable(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});

export type ConversationInput = z.infer<typeof ConversationSchema>;
