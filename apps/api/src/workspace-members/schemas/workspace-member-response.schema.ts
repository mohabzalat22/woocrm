import { z } from 'zod';
import { RoleSchema } from './role.schema';

const IsoDateTimeSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.iso.datetime(),
);

export const WorkspaceMemberResponseSchema = z.object({
  id: z.string(),
  role: RoleSchema,
  userId: z.string(),
  workspaceId: z.string(),
  createdAt: IsoDateTimeSchema,
});
