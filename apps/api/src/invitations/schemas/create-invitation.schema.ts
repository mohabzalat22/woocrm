import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const CreateInvitationSchema = z.object({
  email: z.email(),
  roleId: z.string().min(1),
  expiresAt: stringToDate,
});

export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;
