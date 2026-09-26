import { createZodDto } from 'nestjs-zod';
import { ContactSchema, ContactsPageSchema } from '../schemas';

export class ContactDto extends createZodDto(ContactSchema) {}
export class ContactsPageDto extends createZodDto(ContactsPageSchema) {}
