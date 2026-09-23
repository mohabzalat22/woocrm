import { Module } from '@nestjs/common';
import { WhatsAppConnectionController } from './whatsapp-connection.controller';
import { WhatsAppOAuthController } from './whatsapp-oauth.controller';
import { MessagingController } from './messaging.controller';
import { WhatsAppConnectionService } from './whatsapp-connection.service';
import { WhatsAppConnectionRepository } from './whatsapp-connection.repository';
import { MetaWhatsAppClient } from './channels/whatsapp/meta.client';
import {
  WhatsAppChannel,
  InMemorySessionWindowStore,
} from './channels/whatsapp/whatsapp.channel';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { WhatsAppWebhookController } from './webhooks/whatsapp-webhook.controller';
import { WhatsAppWebhookService } from './webhooks/whatsapp-webhook.service';
import { MessageChannelRegistry } from './registry/message-channel.registry';

@Module({
  imports: [WorkspaceMembersModule, AuthorizationModule],
  controllers: [
    WhatsAppConnectionController,
    WhatsAppOAuthController,
    MessagingController,
    WhatsAppWebhookController,
  ],
  providers: [
    WhatsAppConnectionService,
    WhatsAppConnectionRepository,
    MetaWhatsAppClient,
    InMemorySessionWindowStore,
    WhatsAppChannel,
    MessageChannelRegistry,
    WhatsAppWebhookService,
  ],
  exports: [WhatsAppConnectionService, MessageChannelRegistry],
})
export class MessagingModule {}
