import { createZodDto } from 'nestjs-zod';
import { CreateMessageSchema } from '../schemas';

export class CreateMessageDto extends createZodDto(CreateMessageSchema) {}
