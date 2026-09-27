import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module';
import { MessagingModule } from '../messaging/messaging.module';
import { InboxEventsController } from './inbox-events.controller';
import { InboxEventsService } from './inbox-events.service';
import { InboxController } from './inbox.controller';
import { InboxRepository } from './inbox.repository';
import { InboxService } from './inbox.service';
import { WebhookController } from '../messaging/webhooks/webhook.controller';
import { WebhookService } from '../messaging/webhooks/webhook.service';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  imports: [AuthorizationModule, MessagingModule, ContactsModule],
  controllers: [InboxController, InboxEventsController, WebhookController],
  providers: [
    InboxRepository,
    InboxService,
    InboxEventsService,
    WebhookService,
  ],
  exports: [InboxService],
})
export class InboxModule {}
