import { z } from 'zod';
import { RoleSchema } from '../../workspace-members/schemas/role.schema';

export const RolePermissionResponseSchema = z.object({
  id: z.string(),
  role: RoleSchema,
  permissionId: z.string(),
});
