import { z } from 'zod';
import { ContactInfoSchema } from './contact-info.schema';

export const CreateContactInfoSchema = ContactInfoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateContactInfoInput = z.infer<typeof CreateContactInfoSchema>;
