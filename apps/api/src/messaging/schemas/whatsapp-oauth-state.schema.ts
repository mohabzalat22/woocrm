import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const WhatsAppOAuthStateSchema = z.object({
  id: z.string(),
  stateHash: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  expiresAt: stringToDate,
  consumedAt: stringToDate.nullable(),
  createdAt: stringToDate,
});

export type WhatsAppOAuthState = z.infer<typeof WhatsAppOAuthStateSchema>;
