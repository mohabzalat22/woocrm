import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const PermissionResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: stringToDate,
});
