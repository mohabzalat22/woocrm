import { createZodDto } from 'nestjs-zod';
import { ContactResponseSchema, ContactsPageResponseSchema } from '../schemas';

export class ContactResponseDto extends createZodDto(ContactResponseSchema, {
  codec: true,
}) {}
export class ContactsPageResponseDto extends createZodDto(
  ContactsPageResponseSchema,
  {
    codec: true,
  },
) {}
