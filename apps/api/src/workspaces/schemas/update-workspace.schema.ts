import { z } from 'zod';
import { WorkspaceSchema } from './workspace.schema';

export const UpdateWorkspaceSchema = WorkspaceSchema.omit({
  id: true,
}).partial();

export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
