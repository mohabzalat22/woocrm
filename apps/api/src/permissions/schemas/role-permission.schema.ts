import { z } from 'zod';

export const RolePermissionSchema = z.object({
  id: z.string(),
  roleId: z.string(),
  permissionId: z.string(),
});

export type RolePermissionInput = z.infer<typeof RolePermissionSchema>;
