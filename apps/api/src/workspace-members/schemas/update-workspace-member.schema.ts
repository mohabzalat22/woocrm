import { z } from 'zod';
import { WorkspaceMemberSchema } from './workspace-member.schema';

export const UpdateWorkspaceMemberSchema = WorkspaceMemberSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
  workspaceId: true,
}).partial(); // only roleID could be updated

export type UpdateWorkspaceMemberInput = z.infer<
  typeof UpdateWorkspaceMemberSchema
>;
