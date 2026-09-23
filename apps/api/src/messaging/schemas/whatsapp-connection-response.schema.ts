import { z } from 'zod';

const WhatsAppConnectionStateSchema = z.enum(['ACTIVE', 'EXPIRED', 'REVOKED']);

export const WhatsAppConnectionResponseSchema = z.object({
  connected: z.boolean(),
  status: WhatsAppConnectionStateSchema.nullable(),
  businessName: z.string().nullable(),
  verifiedName: z.string().nullable(),
  displayPhoneNumber: z.string().nullable(),
  phoneNumberId: z.string().nullable(),
  whatsappBusinessAccountId: z.string().nullable(),
});
