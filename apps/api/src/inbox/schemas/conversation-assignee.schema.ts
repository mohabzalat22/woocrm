import { z } from 'zod';
import { WorkspaceMemberSchema } from '../../workspace-members/schemas/workspace-member.schema';

export const ConversationAssigneeSchema = WorkspaceMemberSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
  role: z.object({ name: z.string() }),
});
