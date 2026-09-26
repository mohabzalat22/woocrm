import { z } from 'zod';
import { ContactSchema } from './contact.schema';
import { CreateContactInfoSchema } from './create-contact-info.schema';

export const UpdateContactSchema = ContactSchema.omit({
  id: true,
  contactInfos: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    contactInfos: z.array(CreateContactInfoSchema), // fixing nested dates
  })
  .partial();

export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
