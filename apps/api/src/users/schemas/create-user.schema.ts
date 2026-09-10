import { z } from 'zod';
import { UserSchema } from './user.schema';

export const CreateUserSchema = UserSchema.extend({
  password: z.string().min(8).max(50),
}).omit({
  id: true,
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
