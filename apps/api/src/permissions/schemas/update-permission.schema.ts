import { z } from 'zod';
import { PermissionSchema } from './permission.schema';

export const UpdatePermissionSchema = PermissionSchema.omit({
  id: true,
  createdAt: true,
});

export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>;
