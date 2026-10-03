import { z } from 'zod';
import { ChannelOAuthStateSchema } from './channel-oauth-state.schema';

export const CreateChannelOAuthStateSchema = ChannelOAuthStateSchema.omit({
  id: true,
  consumedAt: true,
  createdAt: true,
});

export type CreateChannelOAuthStateInput = z.infer<
  typeof CreateChannelOAuthStateSchema
>;
