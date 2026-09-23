import { createZodDto } from 'nestjs-zod';
import { WhatsAppConnectionSchema } from '../schemas';

export class WhatsAppConnectionDto extends createZodDto(
  WhatsAppConnectionSchema,
) {}
