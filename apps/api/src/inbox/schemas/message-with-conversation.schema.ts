import { z } from 'zod';
import { MessageSchema } from './message.schema';
import { ConversationSchema } from './conversation.schema';

export const MessageWithConversationSchema = MessageSchema.extend({
  conversation: ConversationSchema,
});

export type MessageWithConversationInput = z.infer<
  typeof MessageWithConversationSchema
>;
