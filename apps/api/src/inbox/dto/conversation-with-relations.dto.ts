import { createZodDto } from 'nestjs-zod';
import { ConversationWithRelationsSchema } from '../schemas';

export class ConversationWithRelationsDto extends createZodDto(
  ConversationWithRelationsSchema,
) {}
