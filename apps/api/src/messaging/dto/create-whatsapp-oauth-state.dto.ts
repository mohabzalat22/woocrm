import { createZodDto } from 'nestjs-zod';
import { CreateWhatsAppOAuthStateSchema } from '../schemas';

export class CreateWhatsAppOAuthStateDto extends createZodDto(
  CreateWhatsAppOAuthStateSchema,
) {}
