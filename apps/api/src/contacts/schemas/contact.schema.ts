import { z } from 'zod';
import { CONTACT_STATES } from '@repo/shared-types';
import { ContactInfoSchema } from './contact-info.schema';
import { stringToDate } from '../../common/types/stringToDate';

export const ContactStateSchema = z.enum(CONTACT_STATES);

export const ContactSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'Name is required'),
  state: ContactStateSchema,
  contactInfo: ContactInfoSchema.nullable(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
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
