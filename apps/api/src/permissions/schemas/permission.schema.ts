import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  workspaceId: z.string(),
  createdAt: stringToDate,
});

export type PermissionInput = z.infer<typeof PermissionSchema>;
