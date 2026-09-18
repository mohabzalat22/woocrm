import { z } from 'zod';

export const CreateInvitationSchema = z.object({
  email: z.email(),
  roleId: z.string().min(1),
  expiresAt: z.coerce.date().optional(),
});

export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;
