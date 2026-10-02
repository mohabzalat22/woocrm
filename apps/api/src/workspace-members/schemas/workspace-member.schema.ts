import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const WorkspaceMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  workspaceId: z.string(),
  createdAt: stringToDate,
});

export type WorkspaceMemberInput = z.infer<typeof WorkspaceMemberSchema>;
