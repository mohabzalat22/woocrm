import { createZodDto } from 'nestjs-zod';
import { ConversationResponseSchema } from '../schemas';

export class ConversationResponseDto extends createZodDto(
  ConversationResponseSchema,
  {
    codec: true,
  },
) {}
