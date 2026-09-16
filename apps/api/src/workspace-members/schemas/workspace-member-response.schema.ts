import { z } from 'zod';

const IsoDateTimeSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.iso.datetime(),
);

export const WorkspaceMemberResponseSchema = z.object({
  id: z.string(),
  roleId: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  createdAt: IsoDateTimeSchema,
});
