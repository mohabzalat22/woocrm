// messaging/channels/whatsapp/whatsapp.channel.ts

import {
  MessageChannel,
  OutgoingMessage,
  SendResult,
  Recipient,
  IncomingMessage,
} from '../message-channel.interface';
import { WhatsAppClient } from './whatsapp.client';
import { buildTemplatePayload } from './whatsapp.templates';

const SESSION_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Tracks the last time each contact messaged you, so the channel can decide
 * whether it's allowed to send free-form text or must use an approved template.
 * Swap InMemorySessionWindowStore for a DB-backed one in production.
 */
export interface SessionWindowStore {
  getLastInboundAt(contactId: string): Promise<Date | null>;
  recordInbound(contactId: string, at: Date): Promise<void>;
}

export class InMemorySessionWindowStore implements SessionWindowStore {
  private lastInbound = new Map<string, Date>(); //TODO: fix it in production to use table format

  async getLastInboundAt(contactId: string): Promise<Date | null> {
    return this.lastInbound.get(contactId) ?? null;
  }

  async recordInbound(contactId: string, at: Date): Promise<void> {
    this.lastInbound.set(contactId, at);
  }
}

export class WhatsAppChannel implements MessageChannel {
  readonly name = 'whatsapp' as const;

  constructor(
    private client: WhatsAppClient,
    private sessionStore: SessionWindowStore,
  ) {}

  async isAvailable(recipient: Recipient): Promise<boolean> {
    return !!recipient.phone;
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

    try {
      const lastInbound = await this.sessionStore.getLastInboundAt(
        recipient.contactId,
      );
      const withinSession =
        !!lastInbound && Date.now() - lastInbound.getTime() < SESSION_WINDOW_MS;

      let result; // TODO: fix types

      if (withinSession && message.text) {
        result = await this.client.sendText(recipient.phone, message.text);
      } else if (message.templateKey) {
        const templatePayload = buildTemplatePayload(
          message.templateKey,
          message.templateParams ?? {},
        );
        result = await this.client.sendTemplate(
          recipient.phone,
          templatePayload,
        );
      } else {
        return {
          success: false,
          channel: this.name,
          error:
            'Outside 24h session window and no templateKey provided — cannot send free-form text',
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

  parseIncoming(rawPayload: any): IncomingMessage | null {
    // Meta webhook shape: entry[0].changes[0].value.messages[0]
    const value = rawPayload?.entry?.[0]?.changes?.[0]?.value;
    const msg = value?.messages?.[0];
    if (!msg) return null; // e.g. a status/delivery-receipt payload, not a message

    const phone = msg.from as string;

    return {
      channel: this.name,
      externalMessageId: msg.id,
      from: { contactId: phone, phone },
      text: msg.text?.body ?? '',
      receivedAt: new Date(Number(msg.timestamp) * 1000),
      raw: rawPayload,
    };
  }
}
