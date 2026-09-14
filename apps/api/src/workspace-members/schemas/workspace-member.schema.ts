import { z } from 'zod';
import { RoleSchema } from './role.schema';

export const WorkspaceMemberSchema = z.object({
  id: z.string(),
  role: RoleSchema,
  userId: z.string(),
  workspaceId: z.string(),
});

export type WorkspaceMemberInput = z.infer<typeof WorkspaceMemberSchema>;
