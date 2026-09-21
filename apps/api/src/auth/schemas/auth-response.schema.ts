import { z } from 'zod';
import { UserResponseSchema } from './user-response.schema';

export const AuthResponseSchema = z.object({
  user: UserResponseSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
