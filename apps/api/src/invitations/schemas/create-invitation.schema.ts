import { z } from 'zod';

const InvitationDateSchema = z.iso
  .datetime()
  .transform((value) => new Date(value));

export const CreateInvitationSchema = z.object({
  email: z.email(),
  roleId: z.string().min(1),
  expiresAt: InvitationDateSchema.optional(),
});

export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;
