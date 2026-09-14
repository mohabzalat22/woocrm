import { z } from 'zod';
import { WorkspaceSchema } from './workspace.schema';

export const CreateWorkspaceSchema = WorkspaceSchema.omit({
  id: true,
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
