import { z } from 'zod';

export const AccessTokenResponseSchema = z.object({
  accessToken: z.string(),
});
