import { z } from 'zod';
import { ContactInfoSchema } from './contact-info.schema';

export const UpdateContactInfoSchema = ContactInfoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UpdateContactInfoInput = z.infer<typeof UpdateContactInfoSchema>;
