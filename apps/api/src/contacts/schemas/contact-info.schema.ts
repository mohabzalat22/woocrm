import { z } from 'zod';

export const ContactInfoSchema = z.object({
  id: z.string(),
  identity: z.string().trim().min(1, 'Identity is required'),
  source: z.string().trim().min(1, 'Source is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});
