import { createZodDto } from 'nestjs-zod';
import { WhatsAppOAuthCallbackSchema } from '../schemas';

export class WhatsAppOAuthCallbackDto extends createZodDto(
  WhatsAppOAuthCallbackSchema,
) {}
