import { createZodDto } from 'nestjs-zod';
import { ContactInfoSchema } from '../schemas';

export class ContactInfoDto extends createZodDto(ContactInfoSchema) {}
