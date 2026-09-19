import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const IsoDateTimeSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.iso.datetime(),
);

export const InvitationResponseSchema = z.object({
  id: z.string(),
  token: z.string(),
  email: z.email(),
  roleId: z.string(),
  workspaceId: z.string(),
  createdById: z.string(),
  expiresAt: IsoDateTimeSchema.nullable(),
  createdAt: IsoDateTimeSchema,
});

export class InvitationResponseDto extends createZodDto(
  InvitationResponseSchema,
) {}
