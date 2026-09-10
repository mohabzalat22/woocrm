import { z } from 'zod';
import { UserSchema } from './user.schema';

export const UserWithPasswordSchema = UserSchema.extend({
  password: z.string().min(8).max(50),
});

export type CreateUserWithPasswordInput = z.infer<
  typeof UserWithPasswordSchema
>;
