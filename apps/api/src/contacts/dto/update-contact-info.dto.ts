import { createZodDto } from 'nestjs-zod';
import { UpdateContactInfoSchema } from '../schemas';

export class UpdateContactInfoDto extends createZodDto(
  UpdateContactInfoSchema,
) {}
