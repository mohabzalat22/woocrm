import { z } from 'zod';

export const UserResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  systemRole: z.enum(['USER', 'ADMIN']),
});
