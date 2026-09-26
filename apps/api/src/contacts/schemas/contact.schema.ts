import { z } from 'zod';
import { CONTACT_STATES } from '@repo/shared-types';
import { ContactInfoSchema } from './contact-info.schema';

export const ContactStateSchema = z.enum(CONTACT_STATES);

export const ContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: ContactStateSchema,
  contactInfos: z.array(ContactInfoSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ContactsPageSchema = z.object({
  data: z.array(ContactSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
