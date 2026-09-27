import { createZodDto } from 'nestjs-zod';
import { ListConversationsSchema } from '../schemas';

export class ListConversationsDto extends createZodDto(
  ListConversationsSchema,
) {}
