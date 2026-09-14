import { z } from 'zod';
import { WorkspaceMemberSchema } from './workspace-member.schema';

export const UpdateWorkspaceMemberSchema = WorkspaceMemberSchema.omit({
  id: true,
}).partial();

export type UpdateWorkspaceMemberInput = z.infer<
  typeof UpdateWorkspaceMemberSchema
>;
