import { z } from 'zod';

const IsoDateTimeSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.iso.datetime(),
);

export const WorkspaceChannelResponseSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  channel: z.string(),
  lockedAt: IsoDateTimeSchema,
});
