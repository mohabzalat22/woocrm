import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const InvitationResponseSchema = z.object({
  id: z.string(),
  token: z.string(),
  email: z.email(),
  roleId: z.string(),
  workspaceId: z.string(),
  createdById: z.string(),
  expiresAt: stringToDate.nullable(),
  createdAt: stringToDate,
});

export class InvitationResponseDto extends createZodDto(
  InvitationResponseSchema,
  {
    codec: true,
  },
) {}
