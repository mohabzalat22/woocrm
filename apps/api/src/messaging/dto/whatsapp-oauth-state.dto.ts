import { createZodDto } from 'nestjs-zod';
import { WhatsAppOAuthStateSchema } from '../schemas';

export class WhatsAppOAuthStateDto extends createZodDto(
  WhatsAppOAuthStateSchema,
) {}
