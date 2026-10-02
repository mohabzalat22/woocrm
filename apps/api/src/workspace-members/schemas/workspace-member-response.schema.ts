import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const WorkspaceMemberResponseSchema = z.object({
  id: z.string(),
  roleId: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  createdAt: stringToDate,
});
