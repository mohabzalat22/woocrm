export interface WhatsAppConnectionStatus {
  connected: boolean;
  status: "ACTIVE" | "EXPIRED" | "REVOKED" | null;
  businessName: string | null;
  verifiedName: string | null;
  displayPhoneNumber: string | null;
  phoneNumberId: string | null;
  whatsappBusinessAccountId: string | null;
}
