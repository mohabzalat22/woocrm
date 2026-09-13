import { z } from 'zod';

export const AccessTokenSchema = z.object({
  accessToken: z.string(),
});

export type AccessTokenInput = z.infer<typeof AccessTokenSchema>;
