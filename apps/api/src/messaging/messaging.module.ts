import { Module } from '@nestjs/common';
import { WhatsAppConnectionController } from './whatsapp-connection.controller';
import { ChannelOAuthController } from './channel-oauth.controller';
import { MessagingController } from './messaging.controller';
import { WhatsAppConnectionService } from './whatsapp-connection.service';
import { WhatsAppConnectionRepository } from './whatsapp-connection.repository';
import { MetaWhatsAppClient } from './channels/whatsapp/meta.client';
import { WhatsAppMessagingStrategy } from './channels/whatsapp/whatsapp-messaging-channel.strategy';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { RolesModule } from '../roles/roles.module';
import { MessagingStrategyRegistry } from './registry/messaging-strategy.registry';
import { ChannelOAuthStateRepository } from './channel-oauth-state.repository';

@Module({
  imports: [WorkspaceMembersModule, AuthorizationModule, RolesModule],
  controllers: [
    WhatsAppConnectionController,
    ChannelOAuthController,
    MessagingController,
  ],
  providers: [
    WhatsAppConnectionService,
    WhatsAppConnectionRepository,
    MetaWhatsAppClient,
    WhatsAppMessagingStrategy,
    MessagingStrategyRegistry,
    ChannelOAuthStateRepository,
  ],
  exports: [MessagingStrategyRegistry],
})
export class MessagingModule {}
