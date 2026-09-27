import { z } from 'zod';

export const SetWorkspaceChannelSchema = z.object({
  channel: z.string().trim().min(1).max(64),
});

export type SetWorkspaceChannelInput = z.infer<
  typeof SetWorkspaceChannelSchema
>;
