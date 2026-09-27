import { z } from 'zod';
import { ConversationStatusSchema } from './conversation-status.schema';

export const ConversationSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  channel: z.string(),
  contactId: z.string(),
  status: ConversationStatusSchema,
  assignedToId: z.string().nullable(),
  lastMessageAt: z.date().nullable(),
  lastReadAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ConversationInput = z.infer<typeof ConversationSchema>;
