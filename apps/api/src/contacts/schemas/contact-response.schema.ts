import { z } from 'zod';
import { ContactStateSchema } from './contact.schema';
import { stringToDate } from '../../common/types/stringToDate';

const ContactInfoResponseSchema = z.object({
  id: z.string(),
  identity: z.string(),
  source: z.string(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});

export const ContactResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: ContactStateSchema,
  contactInfo: ContactInfoResponseSchema.nullable(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});

export const ContactsPageResponseSchema = z.object({
  data: z.array(ContactResponseSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
