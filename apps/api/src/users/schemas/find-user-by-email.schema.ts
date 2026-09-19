import { z } from 'zod';
import { UserSchema } from './user.schema';

export const FindByEmailUserSchema = UserSchema.omit({
  systemRole: true,
});

export type FindByEmailUserInput = z.infer<typeof FindByEmailUserSchema>;
