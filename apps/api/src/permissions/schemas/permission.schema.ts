import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
});

export type PermissionInput = z.infer<typeof PermissionSchema>;
