import { z } from 'zod';

export const CreateNoteSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(500, 'Please make short note less than 500 chars.'),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
