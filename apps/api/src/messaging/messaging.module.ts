import { Module } from '@nestjs/common';
import { WhatsAppConnectionController } from './whatsapp-connection.controller';
import { WhatsAppOAuthController } from './whatsapp-oauth.controller';
import { WhatsAppConnectionService } from './whatsapp-connection.service';
import { WhatsAppConnectionRepository } from './whatsapp-connection.repository';
import { MetaWhatsAppClient } from './channels/whatsapp/meta.client';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [WorkspaceMembersModule, AuthorizationModule],
  controllers: [WhatsAppConnectionController, WhatsAppOAuthController],
  providers: [
    WhatsAppConnectionService,
    WhatsAppConnectionRepository,
    MetaWhatsAppClient,
  ],
  exports: [WhatsAppConnectionService],
})
export class MessagingModule {}
