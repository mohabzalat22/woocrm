import { createZodDto } from 'nestjs-zod';
import { UpdateContactSchema } from '../schemas';

export class UpdateContactDto extends createZodDto(UpdateContactSchema) {}
