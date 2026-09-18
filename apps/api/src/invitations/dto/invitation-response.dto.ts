import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InvitationResponseSchema = z.object({
  id: z.string(),
  token: z.string(),
  email: z.email(),
  roleId: z.string(),
  workspaceId: z.string(),
  createdById: z.string(),
  expiresAt: z.date().nullable(),
  createdAt: z.date(),
});

export class InvitationResponseDto extends createZodDto(InvitationResponseSchema) {}
