import { z } from 'zod';

export const AssignConversationSchema = z.object({
  memberId: z.string().min(1),
});

export type AssignConversationInput = z.infer<typeof AssignConversationSchema>;
