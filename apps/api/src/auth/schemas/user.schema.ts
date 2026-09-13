import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().min(2).max(50).nullable(),
});

export type UserInput = z.infer<typeof UserSchema>;
