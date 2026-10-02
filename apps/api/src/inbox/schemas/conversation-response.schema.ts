import { z } from 'zod';
import { ContactResponseSchema } from '../../contacts/schemas/contact-response.schema';
import { ConversationStatusSchema } from './conversation-status.schema';
import { ConversationAssigneeResponseSchema } from './conversation-assignee-response.schema';
import { MessageResponseSchema } from './message-response.schema';
import { stringToDate } from '../../common/types/stringToDate';

export const ConversationResponseSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  channel: z.string(),
  contactId: z.string(),
  status: ConversationStatusSchema,
  assignedToId: z.string().nullable(),
  assignedTo: ConversationAssigneeResponseSchema.nullable(),
  lastMessageAt: stringToDate,
  lastReadAt: stringToDate.nullable(),
  unread: z.boolean(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
  contact: ContactResponseSchema,
  lastMessage: MessageResponseSchema.nullable(),
  messages: z.array(MessageResponseSchema).optional(),
});
