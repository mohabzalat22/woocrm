import { z } from 'zod';
import { INBOX_TABS } from '@repo/shared-types';

export const ListConversationsSchema = z.object({
  tab: z.enum(INBOX_TABS).default('open'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(25),
});

export type ListConversationsInput = z.infer<typeof ListConversationsSchema>;
