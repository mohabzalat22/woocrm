import { z } from 'zod';
import { PermissionSchema } from './permission.schema';

export const UpdatePermissionSchema = PermissionSchema.omit({
  id: true,
  createdAt: true,
  workspaceId: true,
}).partial();

export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>;
