import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const ChannelOAuthStateSchema = z.object({
  id: z.string(),
  channel: z.string(),
  stateHash: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  expiresAt: stringToDate,
  consumedAt: stringToDate.nullable(),
  createdAt: stringToDate,
});

export type ChannelOAuthState = z.infer<typeof ChannelOAuthStateSchema>;
