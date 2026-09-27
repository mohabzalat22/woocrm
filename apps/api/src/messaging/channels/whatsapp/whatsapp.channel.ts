import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  OutgoingMessage,
  SendResult,
  Recipient,
  IncomingMessage,
  MessageStatusUpdate,
  WebhookMessageChannel,
} from '../message-channel.interface';
import { WhatsAppClient } from './whatsapp.client';
import { buildTemplatePayload } from './whatsapp.templates';
import { whatsappConfig } from '../../config/whatsapp.config';
import { WhatsAppConnectionRepository } from '../../whatsapp-connection.repository';
import { decryptCredential } from '../../security/credential-crypto';

const SESSION_WINDOW_MS = 24 * 60 * 60 * 1000;
const META_SIGNATURE_PREFIX = 'sha256=';

/**
 * Tracks the last time each contact messaged you, so the channel can decide
 * whether it's allowed to send free-form text or must use an approved template.
 * Swap InMemorySessionWindowStore for a DB-backed one in production.
 */
interface GraphApiResponse {
  messaging_product: 'whatsapp';
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
} //TODO: use global types

export interface SessionWindowStore {
  getLastInboundAt(contactId: string): Promise<Date | null>;
  recordInbound(contactId: string, at: Date): Promise<void>;
}

@Injectable()
export class InMemorySessionWindowStore implements SessionWindowStore {
  private readonly lastInbound = new Map<string, Date>(); //TODO: fix it in production to use table format

  async getLastInboundAt(contactId: string): Promise<Date | null> {
    return this.lastInbound.get(contactId) ?? null;
  }

  async recordInbound(contactId: string, at: Date): Promise<void> {
    this.lastInbound.set(contactId, at);
  }
}

/** WhatsApp strategy: send, verify, normalize, and handle WhatsApp webhooks. */
// whatsapp channel + webhooks extending it
@Injectable()
export class WhatsAppChannel implements WebhookMessageChannel {
  readonly name = 'whatsapp' as const;

  constructor(
    private readonly connectionRepository: WhatsAppConnectionRepository,
    private readonly sessionStore: InMemorySessionWindowStore,
  ) {}

  async isAvailable(recipient: Recipient): Promise<boolean> {
    return Boolean(recipient.phone);
  }

  async send(message: OutgoingMessage): Promise<SendResult> {
    const { recipient } = message;

    if (!recipient.phone) {
      return {
        success: false,
        channel: this.name,
        error: 'Recipient has no phone number on file',
      };
    }

    const connection = await this.connectionRepository.findByWorkspaceId(
      message.workspaceId,
    );
    const expired =
      !connection ||
      connection.status !== 'ACTIVE' ||
      (!!connection.accessTokenExpiresAt &&
        connection.accessTokenExpiresAt.getTime() <= Date.now());

    if (expired) {
      return {
        success: false,
        channel: this.name,
        error: 'WhatsApp is not connected for this workspace',
      };
    }

    try {
      const client = new WhatsAppClient(
        decryptCredential(connection.encryptedAccessToken),
        connection.phoneNumberId,
      );
      const lastInbound = await this.sessionStore.getLastInboundAt(
        recipient.contactId,
      );
      const withinSession =
        !!lastInbound && Date.now() - lastInbound.getTime() < SESSION_WINDOW_MS;

      let result: GraphApiResponse; // TODO: fix types

      if (withinSession && message.text) {
        result = await client.sendText(recipient.phone, message.text);
      } else if (message.templateKey) {
        result = await client.sendTemplate(
          recipient.phone,
          buildTemplatePayload(
            message.templateKey,
            message.templateParams ?? {},
          ),
        );
      } else {
        return {
          success: false,
          channel: this.name,
          error:
            'Outside 24h session window and no templateKey provided - cannot send free-form text',
        };
      }

      return {
        success: true,
        channel: this.name,
        externalMessageId: result.messages[0]?.id,
      };
    } catch (err) {
      return {
        success: false,
        channel: this.name,
        error:
          err instanceof Error ? err.message : 'Unknown WhatsApp send error',
      };
    }
  }
  // implementation for webhooks
  verifySubscription(
    mode: string | undefined,
    verifyToken: string | undefined,
    challenge: string | undefined,
  ): string {
    if (
      mode !== 'subscribe' ||
      !challenge ||
      !this.matchesSecret(verifyToken, whatsappConfig.webhookVerifyToken)
    ) {
      throw new ForbiddenException('Invalid WhatsApp webhook verification');
    }

    return challenge;
  }

  assertValidSignature(
    signature: string | undefined,
    rawBody: Buffer | undefined,
  ): void {
    if (
      !rawBody ||
      !whatsappConfig.webhookAppSecret ||
      !this.isValidSignature(
        signature,
        rawBody,
        whatsappConfig.webhookAppSecret,
      )
    ) {
      throw new UnauthorizedException('Invalid WhatsApp webhook signature');
    }
  }

  parseIncoming(rawPayload: unknown): IncomingMessage | null {
    return this.parseIncomingMessages(rawPayload)[0] ?? null;
  }

  parseIncomingMessages(rawPayload: unknown): IncomingMessage[] {
    const value = this.getFirstWebhookValue(rawPayload);
    const messages = value?.messages;
    if (!Array.isArray(messages)) return [];

    return messages.flatMap((candidate) => {
      if (!isRecord(candidate) || typeof candidate.id !== "string" || typeof candidate.from !== "string") {
        return [];
      }

      const timestamp =
        typeof candidate.timestamp === "string"
          ? Number(candidate.timestamp)
          : typeof candidate.timestamp === "number"
            ? candidate.timestamp
            : NaN;
      const text =
        isRecord(candidate.text) && typeof candidate.text.body === "string"
          ? candidate.text.body
          : "";

      return [{
        channel: this.name,
        externalMessageId: candidate.id,
        from: { contactId: candidate.from, phone: candidate.from },
        text,
        receivedAt: Number.isFinite(timestamp)
          ? new Date(timestamp * 1000)
          : new Date(),
        raw: rawPayload,
      }];
    });
  }

  async resolveWorkspaceId(rawPayload: unknown): Promise<string | null> {
    const value = this.getFirstWebhookValue(rawPayload);
    const metadata = value?.metadata;
    const phoneNumberId =
      isRecord(metadata) && typeof metadata.phone_number_id === 'string'
        ? metadata.phone_number_id
        : null;
    if (!phoneNumberId) return null;

    const connection =
      await this.connectionRepository.findByPhoneNumberId(phoneNumberId);
    return connection?.workspaceId ?? null;
  }

  parseStatusUpdates(rawPayload: unknown): MessageStatusUpdate[] {
    const value = this.getFirstWebhookValue(rawPayload);
    if (!Array.isArray(value?.statuses)) return [];

    const statusMap = {
      sent: 'SENT',
      delivered: 'DELIVERED',
      read: 'READ',
      failed: 'FAILED',
    } as const;

    return value.statuses.flatMap((rawStatus): MessageStatusUpdate[] => {
      if (
        !isRecord(rawStatus) ||
        typeof rawStatus.id !== 'string' ||
        typeof rawStatus.status !== 'string'
      ) {
        return [];
      }
      const normalized = statusMap[rawStatus.status as keyof typeof statusMap];
      if (!normalized) return [];
      const timestamp =
        typeof rawStatus.timestamp === 'string'
          ? Number(rawStatus.timestamp)
          : NaN;
      return [
        {
          externalMessageId: rawStatus.id,
          status: normalized,
          occurredAt: Number.isFinite(timestamp)
            ? new Date(timestamp * 1000)
            : undefined,
        },
      ];
    });
  }

  async onIncoming(message: IncomingMessage): Promise<void> {
    await this.sessionStore.recordInbound(
      message.from.contactId,
      message.receivedAt,
    );
  }

  private getFirstWebhookValue(
    payload: unknown,
  ): Record<string, unknown> | null {
    if (!isRecord(payload) || !Array.isArray(payload.entry)) return null;
    const entry = isRecord(payload.entry[0]) ? payload.entry[0] : null;
    const changes = entry && Array.isArray(entry.changes) ? entry.changes : [];
    const change = isRecord(changes[0]) ? changes[0] : null;
    return change && isRecord(change.value) ? change.value : null;
  }

  private isValidSignature(
    signature: string | undefined,
    rawBody: Buffer,
    appSecret: string,
  ): boolean {
    if (!signature?.startsWith(META_SIGNATURE_PREFIX)) return false;

    const expected = createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex');
    const received = Buffer.from(signature.slice(META_SIGNATURE_PREFIX.length));
    const expectedBuffer = Buffer.from(expected);

    return (
      received.length === expectedBuffer.length &&
      timingSafeEqual(received, expectedBuffer)
    );
  }

  private matchesSecret(
    received: string | undefined,
    expected: string | undefined,
  ): boolean {
    if (!received || !expected) return false;
    const receivedBuffer = Buffer.from(received);
    const expectedBuffer = Buffer.from(expected);

    return (
      receivedBuffer.length === expectedBuffer.length &&
      timingSafeEqual(receivedBuffer, expectedBuffer)
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
