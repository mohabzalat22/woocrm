import { Module } from '@nestjs/common';
import { WhatsAppConnectionController } from './whatsapp-connection.controller';
import { ChannelOAuthController } from './channel-oauth.controller';
import { MessagingController } from './messaging.controller';
import { WhatsAppConnectionService } from './whatsapp-connection.service';
import { WhatsAppConnectionRepository } from './whatsapp-connection.repository';
import { MetaWhatsAppClient } from './channels/whatsapp/meta.client';
import { WhatsAppChannel } from './channels/whatsapp/whatsapp.channel';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { RolesModule } from '../roles/roles.module';
import { MessageChannelRegistry } from './registry/message-channel.registry';
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
    WhatsAppChannel,
    MessageChannelRegistry,
    ChannelOAuthStateRepository
  ],
  exports: [MessageChannelRegistry],
})
export class MessagingModule {}
