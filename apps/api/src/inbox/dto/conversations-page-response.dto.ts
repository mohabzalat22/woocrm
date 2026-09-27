import { createZodDto } from 'nestjs-zod';
import { ConversationsPageResponseSchema } from '../schemas';

export class ConversationsPageResponseDto extends createZodDto(
  ConversationsPageResponseSchema,
) {}
