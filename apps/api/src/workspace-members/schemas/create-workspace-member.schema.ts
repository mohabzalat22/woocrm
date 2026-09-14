import { z } from 'zod';
import { WorkspaceMemberSchema } from './workspace-member.schema';

export const CreateWorkspaceMemberSchema = WorkspaceMemberSchema.omit({
  id: true,
});

export type CreateWorkspaceMemberInput = z.infer<
  typeof CreateWorkspaceMemberSchema
>;
