import { createZodDto } from 'nestjs-zod';
import { ConversationSchema } from '../schemas';

export class ConversationDto extends createZodDto(ConversationSchema) {}
