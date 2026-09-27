import { createZodDto } from 'nestjs-zod';
import { MessageWithConversationSchema } from '../schemas';

export class MessageWithConversationDto extends createZodDto(
  MessageWithConversationSchema,
) {}
