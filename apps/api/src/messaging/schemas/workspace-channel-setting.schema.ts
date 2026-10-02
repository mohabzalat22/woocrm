import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const WorkspaceChannelSettingSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  channel: z.string(),
  lockedAt: stringToDate,
});

export type WorkspaceChannelSettingInput = z.infer<
  typeof WorkspaceChannelSettingSchema
>;
