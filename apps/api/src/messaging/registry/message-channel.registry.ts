import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  ChannelName,
  MessageChannel,
  WebhookMessageChannel,
} from '../channels/message-channel.interface';
import { WhatsAppChannel } from '../channels/whatsapp/whatsapp.channel';

/**
 * Strategy registry for messaging providers.
 *
 * The application layer never needs to know whether a message is sent through
 * WhatsApp, Slack, or a future provider. Adding a provider means registering
 * its strategy here and adding its Nest provider in MessagingModule.
 */
@Injectable()
export class MessageChannelRegistry {
  private readonly channels = new Map<ChannelName, MessageChannel>(); // TODO: MAYBE COULD BE ENHANCED

  constructor(whatsAppChannel: WhatsAppChannel) {
    this.register(whatsAppChannel); // TODO: check the registery here
  }

  register(channel: MessageChannel): void {
    if (this.channels.has(channel.name)) {
      throw new Error(
        `Messaging channel is already registered: ${channel.name}`,
      );
    }

    this.channels.set(channel.name, channel);
  }

  get(name: string): MessageChannel {
    const channel = this.channels.get(name);

    if (!channel) {
      throw new BadRequestException(`Unsupported messaging channel: ${name}`);
    }

    return channel;
  }

  async getConnectedChannel(
    workspaceId: string,
    name: string,
  ): Promise<MessageChannel> {
    const channel = this.get(name);

    if (!(await channel.isConnected(workspaceId))) {
      throw new BadRequestException(
        `Messaging channel is not connected for this workspace: ${name}`,
      );
    }

    return channel;
  }

  /** Return every registered provider connected to the workspace. */
  async getConnectedChannels(workspaceId: string): Promise<MessageChannel[]> {
    const channels = await Promise.all(
      [...this.channels.values()].map(async (channel) =>
        (await channel.isConnected(workspaceId)) ? channel : null,
      ),
    );

    return channels.filter(
      (channel): channel is MessageChannel => channel !== null,
    );
  }

  getWebhookChannel(name: string): WebhookMessageChannel {
    const channel = this.get(name);

    if (!isWebhookMessageChannel(channel)) {
      throw new BadRequestException(
        `Messaging channel does not support webhooks: ${name}`,
      );
    }

    return channel;
  }
}

function isWebhookMessageChannel(
  channel: MessageChannel,
): channel is WebhookMessageChannel {
  return (
    typeof (channel as Partial<WebhookMessageChannel>).verifySubscription ===
      'function' &&
    typeof (channel as Partial<WebhookMessageChannel>).assertValidSignature ===
      'function'
  );
}
