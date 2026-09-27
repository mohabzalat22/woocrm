import { createZodDto } from 'nestjs-zod';
import { AssignConversationSchema } from '../schemas';

export class AssignConversationDto extends createZodDto(
  AssignConversationSchema,
) {}
