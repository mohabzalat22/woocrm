import { z } from 'zod';

export const WhatsAppOAuthStateSchema = z.object({
  id: z.string(),
  stateHash: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
  consumedAt: z.date().nullable(),
  createdAt: z.date(),
});

export type WhatsAppOAuthState = z.infer<typeof WhatsAppOAuthStateSchema>;
