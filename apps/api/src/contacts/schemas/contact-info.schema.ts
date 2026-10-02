import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const ContactInfoSchema = z.object({
  id: z.string(),
  identity: z.string().trim().min(1, 'Identity is required'),
  source: z.string().trim(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});
