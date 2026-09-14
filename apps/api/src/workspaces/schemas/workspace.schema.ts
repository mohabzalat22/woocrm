import { z } from 'zod';

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type WorkspaceInput = z.infer<typeof WorkspaceSchema>;
