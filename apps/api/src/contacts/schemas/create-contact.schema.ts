import { z } from 'zod';
import { ContactSchema } from './contact.schema';
import { CreateContactInfoSchema } from './create-contact-info.schema';

export const CreateContactSchema = ContactSchema.omit({
  id: true,
  contactInfos: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  contactInfos: z.array(CreateContactInfoSchema), // fixing nested dates
});

export type CreateContactInput = z.infer<typeof CreateContactSchema>;
