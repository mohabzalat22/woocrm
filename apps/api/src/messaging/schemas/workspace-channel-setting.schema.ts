import { z } from 'zod';

export const WorkspaceChannelSettingSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  channel: z.string(),
  lockedAt: z.date(),
});

export type WorkspaceChannelSettingInput = z.infer<
  typeof WorkspaceChannelSettingSchema
>;
