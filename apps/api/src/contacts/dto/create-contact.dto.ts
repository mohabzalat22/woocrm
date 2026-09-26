import { createZodDto } from 'nestjs-zod';
import { CreateContactSchema } from '../schemas';

export class CreateContactDto extends createZodDto(CreateContactSchema) {}
