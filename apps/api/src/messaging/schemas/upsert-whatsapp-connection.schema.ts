import { z } from 'zod';
import { WhatsAppConnectionSchema } from './whatsapp-connection.schema';

export const UpsertWhatsAppConnectionSchema = WhatsAppConnectionSchema.omit({
  id: true,
  workspaceId: true,
  status: true,
  lastError: true,
  createdAt: true,
  updatedAt: true,
});

export type UpsertWhatsAppConnectionInput = z.infer<
  typeof UpsertWhatsAppConnectionSchema
>;
