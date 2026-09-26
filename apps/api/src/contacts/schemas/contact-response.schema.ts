import { z } from 'zod';
import { ContactStateSchema } from './contact.schema';

const IsoDateTimeSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.iso.datetime(),
);

const ContactInfoResponseSchema = z.object({
  id: z.string(),
  identity: z.string(),
  source: z.string(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export const ContactResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: ContactStateSchema,
  contactInfos: z.array(ContactInfoResponseSchema),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
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
