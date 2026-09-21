import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be 50 characters or fewer"),
});

export type LoginFormInput = z.infer<typeof LoginSchema>;
