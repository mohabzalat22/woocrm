import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  ChannelName,
  MessagingChannelStrategy,
  MessagingOAuthStrategy,
  MessagingWebhookStrategy,
} from '../channels/messaging-strategy.interface';
import { WhatsAppMessagingStrategy } from '../channels/whatsapp/whatsapp-messaging-channel.strategy';

/**
 * Registry for messaging channel strategies.
 *
 * The application layer never needs to know whether a message is sent through
 * WhatsApp, Slack, or a future provider. Adding a provider means registering
 * its strategy here and adding its Nest provider in MessagingModule.
 */
@Injectable()
export class MessagingStrategyRegistry {
  private readonly strategies = new Map<
    ChannelName,
    MessagingChannelStrategy
  >();

  constructor(whatsAppStrategy: WhatsAppMessagingStrategy) {
    this.register(whatsAppStrategy);
  }

  register(strategy: MessagingChannelStrategy): void {
    if (this.strategies.has(strategy.channelName)) {
      throw new Error(
        `Messaging strategy is already registered: ${strategy.channelName}`,
      );
    }

    this.strategies.set(strategy.channelName, strategy);
  }

  getChannelStrategy(channelName: string): MessagingChannelStrategy {
    const strategy = this.strategies.get(channelName);

    if (!strategy) {
      throw new BadRequestException(
        `Unsupported messaging channel: ${channelName}`,
      );
    }

    return strategy;
  }

  async getConnectedChannelStrategy(
    workspaceId: string,
    channelName: string,
  ): Promise<MessagingChannelStrategy> {
    const strategy = this.getChannelStrategy(channelName);

    if (!(await strategy.isConnected(workspaceId))) {
      throw new BadRequestException(
        `Messaging channel is not connected for this workspace: ${channelName}`,
      );
    }

    return strategy;
  }

  /** Return every registered provider connected to the workspace. */
  async getConnectedChannelStrategies(
    workspaceId: string,
  ): Promise<MessagingChannelStrategy[]> {
    const strategies = await Promise.all(
      [...this.strategies.values()].map(async (strategy) =>
        (await strategy.isConnected(workspaceId)) ? strategy : null,
      ),
    );

    return strategies.filter(
      (strategy): strategy is MessagingChannelStrategy => strategy !== null,
    );
  }

  getWebhookChannelStrategy(channelName: string): MessagingWebhookStrategy {
    const strategy = this.getChannelStrategy(channelName);

    if (!isMessagingWebhookChannelStrategy(strategy)) {
      throw new BadRequestException(
        `Messaging channel does not support webhooks: ${channelName}`,
      );
    }

    return strategy;
  }

  getOAuthChannelStrategy(channelName: string): MessagingOAuthStrategy {
    const strategy = this.getChannelStrategy(channelName);

    if (!isMessagingOAuthChannelStrategy(strategy)) {
      throw new BadRequestException(
        `Messaging channel does not support OAuth: ${channelName}`,
      );
    }

    return strategy;
  }
}

function isMessagingWebhookChannelStrategy(
  strategy: MessagingChannelStrategy,
): strategy is MessagingWebhookStrategy {
  return (
    typeof (strategy as Partial<MessagingWebhookStrategy>)
      .verifySubscription === 'function' &&
    typeof (strategy as Partial<MessagingWebhookStrategy>)
      .assertValidSignature === 'function'
  );
}

function isMessagingOAuthChannelStrategy(
  strategy: MessagingChannelStrategy,
): strategy is MessagingChannelStrategy & MessagingOAuthStrategy {
  return (
    typeof (strategy as Partial<MessagingOAuthStrategy>)
      .completeAuthorization === 'function'
  );
}
