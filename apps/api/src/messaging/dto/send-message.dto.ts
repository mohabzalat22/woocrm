import { createZodDto } from 'nestjs-zod';
import { SendMessageSchema } from '../schemas';

export class SendMessageDto extends createZodDto(SendMessageSchema) {}
