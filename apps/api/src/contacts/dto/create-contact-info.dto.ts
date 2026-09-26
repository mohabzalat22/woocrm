import { createZodDto } from 'nestjs-zod';
import { CreateContactInfoSchema } from '../schemas';

export class CreateContactInfoDto extends createZodDto(
  CreateContactInfoSchema,
) {}
