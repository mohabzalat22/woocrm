import { z } from 'zod';

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(80),
});

export type WorkspaceInput = z.infer<typeof WorkspaceSchema>;
