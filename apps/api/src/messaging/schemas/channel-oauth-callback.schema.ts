import { z } from 'zod';

export const ChannelOAuthCallbackSchema = z.object({
  state: z.string().min(1).max(256).optional(),
  code: z.string().min(1).optional(),
  error: z.string().min(1).optional(),
});

export type ChannelOAuthCallbackInput = z.infer<
  typeof ChannelOAuthCallbackSchema
>;
