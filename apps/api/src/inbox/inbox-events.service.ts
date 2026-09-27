import { Injectable } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { filter, map, Observable, startWith, Subject } from 'rxjs';

export type InboxEventType =
  | 'message.created'
  | 'message.status.updated'
  | 'conversation.updated';

export type InboxEvent = {
  workspaceId: string;
  type: InboxEventType;
  conversationId: string;
};

@Injectable()
export class InboxEventsService {
  private readonly events = new Subject<InboxEvent>();

  stream(workspaceId: string): Observable<MessageEvent> {
    return this.events.pipe(
      filter((event) => event.workspaceId === workspaceId),
      map((event) => ({
        type: event.type,
        data: {
          conversationId: event.conversationId,
        },
      })),
      startWith({
        type: 'inbox.connected',
        data: { workspaceId },
      }),
    );
  }

  publish(
    workspaceId: string,
    type: InboxEventType,
    conversationId: string,
  ): void {
    this.events.next({ workspaceId, type, conversationId });
  }
}
