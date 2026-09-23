import { Injectable, Logger } from '@nestjs/common';
import type { IncomingMessage } from '../channels/message-channel.interface';
import { MessageChannelRegistry } from '../registry/message-channel.registry';

@Injectable()
export class WhatsAppWebhookService {
  private readonly logger = new Logger(WhatsAppWebhookService.name);

  constructor(private readonly channelRegistry: MessageChannelRegistry) {}

  verifySubscription(
    mode: string | undefined,
    verifyToken: string | undefined,
    challenge: string | undefined,
  ): string {
    return this.channelRegistry
      .getWebhookChannel('whatsapp')
      .verifySubscription(mode, verifyToken, challenge);
  }

  assertValidSignature(
    signature: string | undefined,
    rawBody: Buffer | undefined,
  ): void {
    this.channelRegistry
      .getWebhookChannel('whatsapp')
      .assertValidSignature(signature, rawBody);
  }

  async handleEvent(payload: unknown): Promise<IncomingMessage | null> {
    const channel = this.channelRegistry.getWebhookChannel('whatsapp');
    const incoming = channel.parseIncoming(payload);

    this.logger.debug(JSON.stringify(payload));
    this.logger.debug(
      `Received WhatsApp webhook event; normalizedMessage=${Boolean(incoming)}`,
    );

    if (incoming) {
      await channel.onIncoming?.(incoming);
      this.logger.log(
        `WhatsApp message ${incoming.externalMessageId} from ${incoming.from.contactId}`,
      );
    }

    return incoming;
  }
}
