import { Controller, Param, Sse } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from '@repo/shared-types';
import { Observable } from 'rxjs';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { InboxEventsService } from './inbox-events.service';

@ApiTags('inbox')
@ApiCookieAuth('access_token')
@Controller('workspaces/:workspaceId/inbox')
export class InboxEventsController {
  constructor(private readonly inboxEventsService: InboxEventsService) {}

  @Sse('events')
  @RequirePermissions(Permission.INBOX_VIEW_OWN)
  stream(@Param('workspaceId') workspaceId: string): Observable<MessageEvent> {
    return this.inboxEventsService.stream(workspaceId);
  }
}
