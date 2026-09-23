import { createZodDto } from 'nestjs-zod';
import { WhatsAppConnectionResponseSchema } from '../schemas';

export class WhatsAppConnectionResponseDto extends createZodDto(
  WhatsAppConnectionResponseSchema,
) {}
