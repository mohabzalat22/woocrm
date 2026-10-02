import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const WorkspaceChannelResponseSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  channel: z.string(),
  lockedAt: stringToDate,
});
