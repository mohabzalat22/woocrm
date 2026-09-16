import { z } from 'zod';

export const RolePermissionResponseSchema = z.object({
  id: z.string(),
  roleId: z.string(),
  permissionId: z.string(),
});
