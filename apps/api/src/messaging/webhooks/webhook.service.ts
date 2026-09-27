import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { IncomingMessage } from '../channels/message-channel.interface';
import { MessageChannelRegistry } from '../registry/message-channel.registry';
import { InboxService } from '../../inbox/inbox.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly channelRegistry: MessageChannelRegistry,
    private readonly inboxService: InboxService,
  ) {}

  verifySubscription(
    channelName: string,
    mode: string | undefined,
    verifyToken: string | undefined,
    challenge: string | undefined,
  ): string {
    return this.channelRegistry
      .getWebhookChannel(channelName)
      .verifySubscription(mode, verifyToken, challenge);
  }

  assertValidSignature(
    channelName: string,
    signature: string | undefined,
    rawBody: Buffer | undefined,
  ): void {
    this.channelRegistry
      .getWebhookChannel(channelName)
      .assertValidSignature(signature, rawBody);
  }

  async handleEvent(
    channelName: string,
    payload: unknown,
  ): Promise<IncomingMessage | null> {
    const channel = this.channelRegistry.getWebhookChannel(channelName);
    const incomingMessages = channel.parseIncomingMessages?.(payload) ?? [];
    if (incomingMessages.length === 0) {
      const incoming = channel.parseIncoming(payload);
      if (incoming) incomingMessages.push(incoming);
    }
    const statusUpdates = channel.parseStatusUpdates?.(payload) ?? [];
    if (incomingMessages.length === 0 && statusUpdates.length === 0)
      return null;

    const workspaceId = await channel.resolveWorkspaceId?.(payload);
    if (!workspaceId) {
      throw new BadRequestException('Unable to route webhook to a workspace');
    }

    for (const incoming of incomingMessages) {
      await this.inboxService.ingestInbound(workspaceId, incoming); // TODO: FIX CIRCULAR DEPENDENCY
      await channel.onIncoming?.(incoming);
      this.logger.log(
        channelName +
          ' message ' +
          incoming.externalMessageId +
          ' from ' +
          incoming.from.contactId,
      );
    }

    for (const statusUpdate of statusUpdates) {
      await this.inboxService.updateMessageStatus(
        workspaceId,
        channelName,
        statusUpdate,
      );
    }

    return incomingMessages[0] ?? null;
  }
}
