import { z } from 'zod';

export const RoleEnum = z.enum(['ADMIN', 'MANAGER', 'AGENT']);

export const RoleSchema = z.object({
  id: z.string(),
  name: RoleEnum,
  description: z.string().nullable(),
  workspaceId: z.string(),
});

export type RoleInput = z.infer<typeof RoleSchema>;
