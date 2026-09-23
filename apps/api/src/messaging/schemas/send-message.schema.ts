import { z } from 'zod';

const RecipientSchema = z.object({
  contactId: z.string().min(1),
  phone: z.string().min(1).optional(),
  slackUserId: z.string().min(1).optional(),
});

export const SendMessageSchema = z
  .object({
    recipient: RecipientSchema,
    text: z.string().min(1).optional(),
    templateKey: z.string().min(1).optional(),
    templateParams: z.record(z.string(), z.string()).optional(),
  })
  .refine((message) => Boolean(message.text || message.templateKey), {
    message: 'Either text or templateKey is required',
    path: ['text'],
  });

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
