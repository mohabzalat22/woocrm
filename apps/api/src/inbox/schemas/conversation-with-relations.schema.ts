import { z } from 'zod';
import { ConversationListRecordSchema } from './conversation-list-record.schema';
import { MessageSchema } from './message.schema';

export const ConversationWithRelationsSchema =
  ConversationListRecordSchema.extend({
    messages: z.array(MessageSchema),
  });

export type ConversationWithRelationsInput = z.infer<
  typeof ConversationWithRelationsSchema
>;
