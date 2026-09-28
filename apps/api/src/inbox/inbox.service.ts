import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import type {
  AssignConversationDto,
  ConversationListRecordDto,
  ConversationResponseDto,
  ConversationWithRelationsDto,
  ConversationsPageResponseDto,
  CreateMessageDto,
  ListConversationsDto,
  WorkspaceMemberWithRoleDto,
} from './dto';

import type {
  IncomingMessage,
  MessageStatusUpdate,
} from '../messaging/channels/message-channel.interface';

import { MessageChannelRegistry } from '../messaging/registry/message-channel.registry';
import { WorkspaceContextService } from '../authorization/workspace-context.service';
import { InboxRepository } from './inbox.repository';
import { InboxEventsService } from './inbox-events.service';
import { ContactsService } from '../contacts/contacts.service';

@Injectable()
export class InboxService {
  private readonly logger = new Logger(InboxService.name);

  constructor(
    private readonly inboxRepository: InboxRepository,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly channelRegistry: MessageChannelRegistry,
    private readonly ContactsService: ContactsService,
    private readonly inboxEvents: InboxEventsService,
  ) {}

  async listConversations(
    userId: string,
    workspaceId: string,
    query: ListConversationsDto,
  ): Promise<ConversationsPageResponseDto> {
    const access = await this.requireMemberAccess(userId, workspaceId);
    const result = await this.inboxRepository.findConversations(
      workspaceId,
      access.member.id,
      access.roleName,
      query,
    );

    return {
      data: result.data.map((conversation) => this.toResponse(conversation)),
      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    };
  }

  async getConversation(
    userId: string,
    workspaceId: string,
    id: string,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.requireAccessibleConversation(
      userId,
      workspaceId,
      id,
    );
    return this.toResponse(conversation, true);
  }

  async assignConversation(
    userId: string,
    workspaceId: string,
    id: string,
    data: AssignConversationDto,
  ): Promise<ConversationResponseDto> {
    await this.requireAccessibleConversation(userId, workspaceId, id);
    const target = await this.inboxRepository.findMemberById(
      data.memberId,
      workspaceId,
    );
    if (!target)
      throw new BadRequestException('Assignee must belong to this workspace');

    const conversation = await this.inboxRepository.assignConversation(
      id,
      workspaceId,
      target.id,
    );
    if (!conversation) throw new NotFoundException('Conversation not found');
    this.inboxEvents.publish(workspaceId, 'conversation.updated', id);
    return this.toResponse(conversation, true);
  }

  async resolveConversation(
    userId: string,
    workspaceId: string,
    id: string,
  ): Promise<ConversationResponseDto> {
    await this.requireAccessibleConversation(userId, workspaceId, id);
    const resolved = await this.inboxRepository.resolveConversation(
      id,
      workspaceId,
    );
    if (!resolved) throw new NotFoundException('Conversation not found');
    this.inboxEvents.publish(workspaceId, 'conversation.updated', id);
    return this.toResponse(resolved, true);
  }

  async markAsRead(
    userId: string,
    workspaceId: string,
    id: string,
  ): Promise<ConversationResponseDto> {
    await this.requireAccessibleConversation(userId, workspaceId, id);
    const conversation = await this.inboxRepository.markAsRead(
      id,
      workspaceId,
      new Date(),
    );
    if (!conversation) throw new NotFoundException('Conversation not found');
    this.inboxEvents.publish(workspaceId, 'conversation.updated', id);
    return this.toResponse(conversation, true);
  }

  async sendMessage(
    userId: string,
    workspaceId: string,
    id: string,
    data: CreateMessageDto,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.requireAccessibleConversation(
      userId,
      workspaceId,
      id,
    );

    const channel = await this.channelRegistry.getConnectedChannel(
      workspaceId,
      conversation.channel,
    );

    const contactInfo = await this.ContactsService.findContactChannelIdentity(
      conversation.contactId,
      conversation.channel,
    );

    if (!contactInfo) {
      throw new BadRequestException(
        'Contact has no identity for the workspace channel',
      );
    }

    const result = await channel.send({
      workspaceId,
      recipient: channel.createRecipient(
        conversation.contactId,
        contactInfo.identity,
      ),
      text: data.content,
    });

    const saved = await this.inboxRepository.appendOutboundMessage(
      id,
      workspaceId,
      (await this.requireMemberAccess(userId, workspaceId)).member.id,
      data,
      result.success ? 'SENT' : 'FAILED',
      result.externalMessageId,
    );

    if (!saved) throw new NotFoundException('Conversation not found');

    this.inboxEvents.publish(workspaceId, 'message.created', id); // to update ui using sse
    return this.toResponse(saved, true);
  }

  async retryMessage(
    userId: string,
    workspaceId: string,
    conversationId: string,
    messageId: string,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.requireAccessibleConversation(
      userId,
      workspaceId,
      conversationId,
    );

    const failedMessage = await this.inboxRepository.findFailedOutboundMessage(
      messageId,
      conversationId,
      workspaceId,
    );

    if (!failedMessage) {
      throw new NotFoundException('Failed outbound message not found');
    }

    const channel = await this.channelRegistry.getConnectedChannel(
      workspaceId,
      conversation.channel,
    );

    const contactInfo = await this.ContactsService.findContactChannelIdentity(
      conversation.contactId,
      conversation.channel,
    );

    if (!contactInfo) {
      throw new BadRequestException(
        'Contact has no identity for the workspace channel',
      );
    }

    const result = await channel.send({
      workspaceId,
      recipient: channel.createRecipient(
        conversation.contactId,
        contactInfo.identity,
      ),
      text: failedMessage.content,
    });

    const updated = await this.inboxRepository.updateFailedOutboundMessage(
      messageId,
      conversationId,
      workspaceId,
      result.success ? 'SENT' : 'FAILED',
      result.externalMessageId,
    );

    if (!updated) {
      throw new NotFoundException('Failed outbound message not found');
    }

    this.inboxEvents.publish(
      workspaceId,
      'message.status.updated',
      conversationId,
    );
    if (!result.success) {
      throw new BadRequestException(result.error ?? 'Message retry failed');
    }
    return this.toResponse(updated, true);
  }

  async ingestInbound(
    workspaceId: string,
    message: IncomingMessage,
  ): Promise<ConversationResponseDto> {
    const channel = await this.channelRegistry.getConnectedChannel(
      workspaceId,
      message.channel,
    );
    const conversation = await this.inboxRepository.appendInboundMessage(
      workspaceId,
      channel.name,
      message.from.contactId,
      message.text,
      message.externalMessageId,
      message.receivedAt,
      message.raw,
    );

    if (!conversation) {
      throw new NotFoundException(
        'Contact was not found for this inbound message',
      );
    }
    this.inboxEvents.publish(workspaceId, 'message.created', conversation.id);
    return this.toResponse(conversation, true);
  }

  async updateMessageStatus(
    workspaceId: string,
    channel: string,
    update: MessageStatusUpdate,
  ): Promise<void> {
    await this.channelRegistry.getConnectedChannel(workspaceId, channel);
    const message =
      await this.inboxRepository.findConversationByExternalMessageId(
        workspaceId,
        update.externalMessageId,
      );

    if (!message) {
      this.logger.warn(
        `Ignoring status for unknown message ${update.externalMessageId}`,
      );
      return;
    }

    const current = message.status;
    if (!this.canAdvanceStatus(current, update.status)) return; // TODO: create failed re-sending message

    await this.inboxRepository.updateMessageStatus(
      workspaceId,
      update.externalMessageId,
      update.status,
    );

    this.inboxEvents.publish(
      workspaceId,
      'message.status.updated',
      message.conversation.id,
    );
  }

  private async requireAccessibleConversation(
    userId: string,
    workspaceId: string,
    id: string,
  ): Promise<ConversationWithRelationsDto> {
    const access = await this.requireMemberAccess(userId, workspaceId);
    const conversation = await this.inboxRepository.findConversation(
      id,
      workspaceId,
    );

    if (!conversation) throw new NotFoundException('Conversation not found');

    if (
      access.roleName === 'AGENT' &&
      conversation.assignedToId !== access.member.id
    ) {
      throw new ForbiddenException('Conversation is not assigned to you');
    }

    return conversation;
  }

  private async requireMemberAccess(
    userId: string,
    workspaceId: string,
  ): Promise<{
    member: WorkspaceMemberWithRoleDto;
    roleName: 'ADMIN' | 'MANAGER' | 'AGENT';
  }> {
    const member = await this.inboxRepository.findMember(userId, workspaceId);

    if (!member) {
      await this.workspaceContext.requireMembership(userId, workspaceId);
      throw new ForbiddenException('Unauthorized request');
    }

    return { member, roleName: member.role.name };
  }

  private canAdvanceStatus(
    current: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED',
    next: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED',
  ): boolean {
    if (current === 'READ' || current === 'FAILED') return false;
    if (next === 'FAILED') return true;
    const rank = { SENT: 0, DELIVERED: 1, READ: 2 } as const;
    return rank[next] > rank[current];
  }

  private toResponse(
    conversation: ConversationWithRelationsDto | ConversationListRecordDto,
    includeMessages = false,
  ): ConversationResponseDto {
    const messages =
      'messages' in conversation ? conversation.messages : undefined;
    const lastMessage = messages?.[messages.length - 1];

    return {
      id: conversation.id,
      workspaceId: conversation.workspaceId,
      channel: conversation.channel,
      contactId: conversation.contactId,
      status: conversation.status,
      assignedToId: conversation.assignedToId,
      assignedTo: conversation.assignedTo
        ? this.toAssigneeResponse(conversation.assignedTo)
        : null,
      lastMessageAt: this.toIsoDateOrNull(conversation.lastMessageAt),
      lastReadAt: this.toIsoDateOrNull(conversation.lastReadAt),
      unread: Boolean(
        conversation.lastMessageAt &&
          (!conversation.lastReadAt ||
            conversation.lastMessageAt > conversation.lastReadAt),
      ),
      createdAt: this.toIsoDate(conversation.createdAt),
      updatedAt: this.toIsoDate(conversation.updatedAt),
      lastMessage: lastMessage ? this.toMessageResponse(lastMessage) : null,
      contact: this.toContactResponse(conversation.contact),
      ...(includeMessages && messages
        ? {
            messages: messages.map((message) =>
              this.toMessageResponse(message),
            ),
          }
        : {}),
    };
  }

  private toAssigneeResponse(
    assignee: NonNullable<ConversationListRecordDto['assignedTo']>,
  ) {
    return {
      id: assignee.id,
      userId: assignee.userId,
      name: assignee.user.name,
      email: assignee.user.email,
      role: assignee.role.name,
    };
  }

  private toMessageResponse(
    message: ConversationWithRelationsDto['messages'][number],
  ) {
    return {
      id: message.id,
      conversationId: message.conversationId,
      direction: message.direction,
      content: message.content,
      status: message.status,
      senderMemberId: message.senderMemberId,
      externalId: message.externalId,
      createdAt: this.toIsoDate(message.createdAt),
    };
  }

  private toContactResponse(contact: ConversationListRecordDto['contact']) {
    return {
      ...contact,
      createdAt: this.toIsoDate(contact.createdAt),
      updatedAt: this.toIsoDate(contact.updatedAt),
      contactInfos: contact.contactInfos.map((info) => ({
        ...info,
        createdAt: this.toIsoDate(info.createdAt),
        updatedAt: this.toIsoDate(info.updatedAt),
      })),
    };
  }

  private toIsoDate(value: Date): string {
    return value.toISOString();
  }

  private toIsoDateOrNull(value: Date | null): string | null {
    return value ? this.toIsoDate(value) : null;
  }
}
