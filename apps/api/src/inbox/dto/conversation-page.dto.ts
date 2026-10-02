import { createZodDto } from 'nestjs-zod';
import { ConversationsPageSchema } from '../schemas';

export class ConversationsPageDto extends createZodDto(
  ConversationsPageSchema,
) {}
