import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

export const NoteSchema = z.object({
  id: z.string(),
  content: z
    .string()
    .min(1)
    .max(500, 'Please make short note less than 500 chars.'),
  conversationId: z.string(),
  workspaceMemberId: z.string(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});
