import { z } from 'zod';

export const UpdatePermissionSchema = z
  .object({
    description: z.string().nullable().optional(),
  })
  .strict();

export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>;
