import { z } from 'zod';
import { RoleEnum } from '../../roles/schemas/role.schema';

export const RoleResponseSchema = z.object({
  id: z.string(),
  name: RoleEnum,
  description: z.string().nullable(),
  workspaceId: z.string(),
});
