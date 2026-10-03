/**
 * Channel names are intentionally open-ended. A new provider only needs to
 * implement MessagingChannelStrategy and register it with
 * MessagingStrategyRegistry.
 */
export type ChannelName = string;

export interface Recipient {
  contactId: string;
  phone?: string;
  externalUserId?: string;
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
  raw: unknown;
}

export interface MessageStatusUpdate {
  externalMessageId: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  occurredAt?: Date;
}

export interface OutgoingMessage {
  workspaceId: string;
  recipient: Recipient;
  text?: string;
  templateKey?: string;
  templateParams?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface MessagingChannelStrategy {
  readonly channelName: ChannelName;

  /** Whether this provider has an active connection in the workspace. */
  isConnected(workspaceId: string): Promise<boolean>;

  /** Convert a stored contact identity into the provider-specific recipient. */
  createRecipient(contactId: string, identity: string): Recipient;

  send(message: OutgoingMessage): Promise<SendResult>;

  isAvailable(recipient: Recipient): Promise<boolean>;

  parseIncoming(rawPayload: unknown): IncomingMessage | null;

  parseIncomingMessages?(rawPayload: unknown): IncomingMessage[];

  parseStatusUpdates?(rawPayload: unknown): MessageStatusUpdate[];

  resolveWorkspaceId?(rawPayload: unknown): Promise<string | null>;

  onIncoming?(message: IncomingMessage): Promise<void>;
}

export interface MessagingWebhookStrategy extends MessagingChannelStrategy {
  verifySubscription(
    mode: string | undefined,
    verifyToken: string | undefined,
    challenge: string | undefined,
  ): string;

  assertValidSignature(
    signature: string | undefined,
    rawBody: Buffer | undefined,
  ): void;
}

export interface MessagingOAuthStrategy {
  readonly channelName: ChannelName;

  completeAuthorization(state: string, code: string): Promise<string>;
}
