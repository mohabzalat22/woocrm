import { z } from 'zod';
import { UserSchema } from './user.schema';

export const UpdateUserSchema = UserSchema.extend({
  password: z.string().min(8).max(50),
})
  .omit({
    id: true,
  })
  .partial();

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
