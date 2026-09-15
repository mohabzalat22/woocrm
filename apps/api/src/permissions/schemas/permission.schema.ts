import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  describtion: z.string().optional(),
  createdAt: z.date(),
});

export type PermissionInput = z.infer<typeof PermissionSchema>;
