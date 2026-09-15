import { z } from 'zod';
import { RoleSchema } from '@/workspace-members/schemas/role.schema';

export const RolePermissionSchema = z.object({
  id: z.string(),
  role: RoleSchema,
  permissionId: z.string(),
});

export type RolePermissionInput = z.infer<typeof RolePermissionSchema>;
