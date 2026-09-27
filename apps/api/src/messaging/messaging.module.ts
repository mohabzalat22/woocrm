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
import { RolesModule } from '../roles/roles.module';
import { MessageChannelRegistry } from './registry/message-channel.registry';
import { WorkspaceChannelController } from './workspace-channel.controller';
import { WorkspaceChannelRepository } from './workspace-channel.repository';
import { WorkspaceChannelService } from './workspace-channel.service';

@Module({
  imports: [WorkspaceMembersModule, AuthorizationModule, RolesModule],
  controllers: [
    WhatsAppConnectionController,
    WhatsAppOAuthController,
    MessagingController,
    WorkspaceChannelController,
  ],
  providers: [
    WhatsAppConnectionService,
    WhatsAppConnectionRepository,
    MetaWhatsAppClient,
    InMemorySessionWindowStore,
    WhatsAppChannel,
    MessageChannelRegistry,
    WorkspaceChannelRepository,
    WorkspaceChannelService,
  ],
  exports: [MessageChannelRegistry, WorkspaceChannelService],
})
export class MessagingModule {}
