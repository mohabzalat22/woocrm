import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import type {
  AssignConversationDto,
  ConversationDto,
  ConversationWithRelationsDto,
  ConversationsPageDto,
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
  ): Promise<ConversationsPageDto> {
    const access = await this.requireMemberAccess(userId, workspaceId);
    const result = await this.inboxRepository.findConversations(
      workspaceId,
      access.member.id,
      access.roleName,
      query,
    );

    return {
      data: result.data,
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
  ): Promise<ConversationDto> {
    const conversation = await this.requireAccessibleConversation(
      userId,
      workspaceId,
      id,
    );
    return conversation;
  }

  async assignConversation(
    userId: string,
    workspaceId: string,
    id: string,
    data: AssignConversationDto,
  ): Promise<ConversationDto> {
    await this.requireAccessibleConversation(userId, workspaceId, id);
    if (data.memberId) {
      const target = await this.inboxRepository.findMemberById(
        data.memberId,
        workspaceId,
      );
      if (!target) {
        throw new BadRequestException('Assignee must belong to this workspace');
      }
    }

    const conversation = await this.inboxRepository.assignConversation(
      id,
      workspaceId,
      data.memberId,
    );
    if (!conversation) throw new NotFoundException('Conversation not found');
    this.inboxEvents.publish(workspaceId, 'conversation.updated', id);
    return conversation;
  }

  async resolveConversation(
    userId: string,
    workspaceId: string,
    id: string,
  ): Promise<ConversationDto> {
    await this.requireAccessibleConversation(userId, workspaceId, id);
    const resolved = await this.inboxRepository.resolveConversation(
      id,
      workspaceId,
    );
    if (!resolved) throw new NotFoundException('Conversation not found');
    this.inboxEvents.publish(workspaceId, 'conversation.updated', id);
    return resolved;
  }

  async markAsRead(
    userId: string,
    workspaceId: string,
    id: string,
  ): Promise<ConversationDto> {
    const conversation = await this.requireAccessibleConversation(userId, workspaceId, id);
    
    if (!conversation.assignedToId) {
      throw new ForbiddenException('Conversation is not assigned to a user');
    }

    const assignedToMemberId = conversation.assignedToId;

    const targetConversation = await this.inboxRepository.markAsRead(
      id,
      workspaceId,
      assignedToMemberId,
      new Date(),
    );
    if (!targetConversation) throw new NotFoundException('Conversation not found');
    this.inboxEvents.publish(workspaceId, 'conversation.updated', id);
    return targetConversation;
  }

  async sendMessage(
    userId: string,
    workspaceId: string,
    id: string,
    data: CreateMessageDto,
  ): Promise<ConversationDto> {
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
    return saved;
  }

  async retryMessage(
    userId: string,
    workspaceId: string,
    conversationId: string,
    messageId: string,
  ): Promise<ConversationDto> {
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
      result.externalMessageId, //MOX same as identity for all
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
    return updated;
  }

  async ingestInbound(
    workspaceId: string,
    message: IncomingMessage,
  ): Promise<ConversationDto> {
    const channel = await this.channelRegistry.getConnectedChannel(
      workspaceId,
      message.channel,
    );
    const conversation = await this.inboxRepository.appendInboundMessage(
      workspaceId,
      channel.name,
      message.from.contactId, // contact id is identity here
      message.text,
      message.externalMessageId, // TODO: fix interfaces external message id of external id or external contact id
      message.receivedAt,
      message.raw,
    );

    if (!conversation) {
      throw new NotFoundException(
        'Contact was not found for this inbound message',
      );
    }
    this.inboxEvents.publish(workspaceId, 'message.created', conversation.id);
    return conversation;
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
}
