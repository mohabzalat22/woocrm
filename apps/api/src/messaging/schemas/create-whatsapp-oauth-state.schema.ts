import { z } from 'zod';
import { WhatsAppOAuthStateSchema } from './whatsapp-oauth-state.schema';

export const CreateWhatsAppOAuthStateSchema = WhatsAppOAuthStateSchema.omit({
  id: true,
  consumedAt: true,
  createdAt: true,
});

export type CreateWhatsAppOAuthStateInput = z.infer<
  typeof CreateWhatsAppOAuthStateSchema
>;
