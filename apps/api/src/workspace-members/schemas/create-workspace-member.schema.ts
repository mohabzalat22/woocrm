import { z } from 'zod';
import { WorkspaceMemberSchema } from './workspace-member.schema';

export const CreateWorkspaceMemberSchema = WorkspaceMemberSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateWorkspaceMemberInput = z.infer<
  typeof CreateWorkspaceMemberSchema
>;
