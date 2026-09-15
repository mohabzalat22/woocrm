import { z } from 'zod';
import { PermissionSchema } from './permission.schema';

export const CreatePermissionSchema = PermissionSchema.omit({
  id: true,
  createdAt: true,
});

export type CreatePermissionInput = z.infer<typeof CreatePermissionSchema>;
