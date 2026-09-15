import { z } from 'zod';

export const WorkspaceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});
