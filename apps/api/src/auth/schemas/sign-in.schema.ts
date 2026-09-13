import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
});

export type SignInInput = z.infer<typeof SignInSchema>;
