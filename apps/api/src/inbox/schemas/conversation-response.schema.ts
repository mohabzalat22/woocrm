import { z } from 'zod';
import { ContactResponseSchema } from '../../contacts/schemas/contact-response.schema';
import { ConversationStatusSchema } from './conversation-status.schema';
import { ConversationAssigneeResponseSchema } from './conversation-assignee-response.schema';
import {
  IsoDateTimeSchema,
  NullableIsoDateTimeSchema,
} from './iso-date-time.schema';
import { MessageResponseSchema } from './message-response.schema';

export const ConversationResponseSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  channel: z.string(),
  contactId: z.string(),
  status: ConversationStatusSchema,
  assignedToId: z.string().nullable(),
  assignedTo: ConversationAssigneeResponseSchema.nullable(),
  lastMessageAt: NullableIsoDateTimeSchema,
  lastReadAt: NullableIsoDateTimeSchema,
  unread: z.boolean(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  contact: ContactResponseSchema,
  lastMessage: MessageResponseSchema.nullable(),
  messages: z.array(MessageResponseSchema).optional(),
});
