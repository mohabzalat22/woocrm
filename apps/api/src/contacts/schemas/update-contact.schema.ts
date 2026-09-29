import { z } from 'zod';
import { ContactSchema } from './contact.schema';
import { CreateContactInfoSchema } from './create-contact-info.schema';

export const UpdateContactSchema = ContactSchema.omit({
  id: true,
  contactInfo: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    contactInfo: CreateContactInfoSchema.nullable().optional(),
  })
  .partial();

export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
