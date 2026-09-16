import { z } from 'zod';
export const WorkspaceMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  workspaceId: z.string(),
  createdAt: z.date(),
});

export type WorkspaceMemberInput = z.infer<typeof WorkspaceMemberSchema>;
