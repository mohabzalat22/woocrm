import { z } from 'zod';
import { ContactSchema } from './contact.schema';
import { CreateContactInfoSchema } from './create-contact-info.schema';

export const CreateContactSchema = ContactSchema.omit({
  id: true,
  contactInfo: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  contactInfo: CreateContactInfoSchema.optional(),
});

export type CreateContactInput = z.infer<typeof CreateContactSchema>;
