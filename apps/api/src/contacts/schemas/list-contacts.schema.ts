import { z } from 'zod';
import { CONTACT_STATES } from '@repo/shared-types';

export const ListContactsSchema = z.object({
  search: z.string().trim().optional(),
  state: z.enum(CONTACT_STATES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListContactsInput = z.infer<typeof ListContactsSchema>;
