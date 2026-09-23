export type ChannelName = 'whatsapp' | 'slack';

export interface Recipient {
  contactId: string; // platform based
  phone?: string; // E.164 format, e.g. "+15551234567" — required for WhatsApp
  slackUserId?: string;
}

export interface SendResult {
  success: boolean;
  channel: ChannelName;
  externalMessageId?: string;
  error?: string;
}

export interface IncomingMessage {
  channel: ChannelName;
  externalMessageId: string;
  from: Recipient;
  text: string;
  receivedAt: Date;
  raw: unknown; // original webhook payload, kept for debugging/audit
}

export interface OutgoingMessage {
  recipient: Recipient;
  text?: string;
  /** WhatsApp-only: required when sending outside the 24h session window. */
  templateKey?: string;
  templateParams?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface MessageChannel {
  readonly name: ChannelName;

  send(message: OutgoingMessage): Promise<SendResult>;

  isAvailable(recipient: Recipient): Promise<boolean>;

  /**
   * Normalizes a raw inbound webhook payload for this channel into the
   * shared IncomingMessage shape. Returns null for payloads that aren't
   * actual messages (delivery receipts, status updates, etc.).
   */
  parseIncoming(rawPayload: unknown): IncomingMessage | null;
}
