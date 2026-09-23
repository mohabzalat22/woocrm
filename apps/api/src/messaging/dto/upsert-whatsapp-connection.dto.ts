import { createZodDto } from 'nestjs-zod';
import { UpsertWhatsAppConnectionSchema } from '../schemas';

export class UpsertWhatsAppConnectionDto extends createZodDto(
  UpsertWhatsAppConnectionSchema,
) {}
