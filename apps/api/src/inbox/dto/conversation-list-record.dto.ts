import { createZodDto } from 'nestjs-zod';
import { ConversationListRecordSchema } from '../schemas';

export class ConversationListRecordDto extends createZodDto(
  ConversationListRecordSchema,
) {}
