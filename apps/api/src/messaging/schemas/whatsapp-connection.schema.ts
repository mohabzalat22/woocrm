import { z } from 'zod';
import { stringToDate } from '../../common/types/stringToDate';

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
  accessTokenExpiresAt: stringToDate.nullable(),
  status: WhatsAppConnectionStateSchema,
  lastError: z.string().nullable(),
  createdAt: stringToDate,
  updatedAt: stringToDate,
});

export type WhatsAppConnection = z.infer<typeof WhatsAppConnectionSchema>;
