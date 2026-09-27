import { z } from 'zod';
import { ContactSchema } from '../../contacts/schemas/contact.schema';
import { ConversationSchema } from './conversation.schema';
import { ConversationAssigneeSchema } from './conversation-assignee.schema';
import { MessageSchema } from './message.schema';

export const ConversationListRecordSchema = ConversationSchema.extend({
  contact: ContactSchema,
  assignedTo: ConversationAssigneeSchema.nullable(),
  messages: z.array(MessageSchema).optional(),
});

export type ConversationListRecordInput = z.infer<
  typeof ConversationListRecordSchema
>;
