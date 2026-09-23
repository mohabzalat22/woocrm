import { z } from 'zod';

export const WhatsAppConnectionStateSchema = z.enum([
  'ACTIVE',
  'EXPIRED',
  'REVOKED',
]);

export const WhatsAppConnectionSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  metaUserId: z.string().nullable(),
  metaBusinessAccountId: z.string(),
  whatsappBusinessAccountId: z.string(),
  phoneNumberId: z.string(),
  displayPhoneNumber: z.string().nullable(),
  verifiedName: z.string().nullable(),
  businessName: z.string().nullable(),
  encryptedAccessToken: z.string(),
  accessTokenExpiresAt: z.date().nullable(),
  status: WhatsAppConnectionStateSchema,
  lastError: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WhatsAppConnection = z.infer<typeof WhatsAppConnectionSchema>;
