import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import type { CreateMessageInput, ListConversationsInput } from './schemas';
import type {
  ConversationListRecordDto,
  ConversationWithRelationsDto,
  MessageWithConversationDto,
  WorkspaceMemberWithRoleDto,
} from './dto';

const contactInclude = {
  contactInfo: true,
} as const;

const assigneeInclude = {
  user: { select: { id: true, name: true, email: true } },
  role: { select: { name: true } },
} as const;

@Injectable()
export class InboxRepository {
  private mapConversation(conversation: any) {
    if (!conversation) return null;

    const assigned = conversation.assignedTo
      ? {
          id: conversation.assignedTo.id,
          userId:
            conversation.assignedTo.userId ?? conversation.assignedTo.user?.id ?? null,
          name:
            conversation.assignedTo.user?.name ?? conversation.assignedTo.name ?? null,
          email:
            conversation.assignedTo.user?.email ?? conversation.assignedTo.email ?? null,
          role:
            typeof conversation.assignedTo.role === 'string'
              ? conversation.assignedTo.role
              : conversation.assignedTo.role?.name ?? null,
        }
      : null;

    const msgs = Array.isArray(conversation.messages) ? conversation.messages : [];
    const lastMessage = msgs.length ? msgs[msgs.length - 1] : null;

    const lastMessageAt = (conversation.lastMessageAt as Date) ?? null;
    const lastReadAt = (conversation.lastReadAt as Date) ?? null;

    return {
      ...conversation,
      assignedTo: assigned,
      unread: this.isUnread(lastMessageAt, lastReadAt),
      lastMessage,
    };
  }

  async findMemberById(
    id: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberWithRoleDto | null> {
    return prisma.workspaceMember.findFirst({
      where: { id, workspaceId },
      include: { role: true },
    });
  }

  async findMember(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberWithRoleDto | null> {
    return prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
      include: { role: true },
    });
  }

  async findConversations(
    workspaceId: string,
    memberId: string,
    roleName: string,
    query: ListConversationsInput,
  ): Promise<{ data: ConversationListRecordDto[]; total: number }> {
    const where = {
      workspaceId,
      ...(roleName === 'AGENT' ? { assignedToId: memberId } : {}),
      ...(query.tab === 'open' ? { status: 'OPEN' as const } : {}),
      ...(query.tab === 'resolved' ? { status: 'RESOLVED' as const } : {}),
    };

    const records = await prisma.conversation.findMany({
      where,
      include: {
        contact: { include: contactInclude },
        assignedTo: { include: assigneeInclude },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
    });

    const filtered =
      query.tab === 'unread'
        ? records.filter((conversation) =>
            this.isUnread(conversation.lastMessageAt, conversation.lastReadAt),
          )
        : records;
    const skip = (query.page - 1) * query.limit; // TODO: use cursor pagination in the future

    return {
      data: filtered.slice(skip, skip + query.limit).map((c) => this.mapConversation(c)),
      total: filtered.length,
    };
  }

  async findConversation(
    id: string,
    workspaceId: string,
  ): Promise<ConversationWithRelationsDto | null> {
    const conv = await prisma.conversation.findFirst({
      where: { id, workspaceId },
      include: {
        contact: { include: contactInclude },
        assignedTo: { include: assigneeInclude },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    return conv ? this.mapConversation(conv) : null;
  }

  async findConversationByExternalMessageId(
    workspaceId: string,
    externalId: string,
  ): Promise<MessageWithConversationDto | null> {
    return prisma.message.findFirst({
      where: {
        externalId,
        conversation: { workspaceId },
      },
      include: { conversation: true },
    });
  }

  async findFailedOutboundMessage(
    messageId: string,
    conversationId: string,
    workspaceId: string,
  ): Promise<MessageWithConversationDto | null> {
    return prisma.message.findFirst({
      where: {
        id: messageId,
        conversationId,
        direction: 'OUTBOUND',
        status: 'FAILED',
        conversation: { workspaceId },
      },
      include: { conversation: true },
    });
  }

  async appendInboundMessage(
    workspaceId: string,
    channel: string,
    contactIdentity: string,
    content: string,
    externalId: string,
    receivedAt: Date,
    raw: unknown,
  ): Promise<ConversationWithRelationsDto | null> {
    return prisma.$transaction(async (tx) => {
      const contact = await tx.contact.findFirst({
        where: {
          workspaceId,
          contactInfo: {
            is: { source: channel, identity: contactIdentity },
          },
        },
      });

      //MOX: if contact is not saved create new one
      const savedContact =
        contact ??
        (await tx.contact.create({
          data: {
            workspaceId,
            name: contactIdentity,
            state: 'NEW',
            contactInfo: {
              create: {
                source: channel,
                identity: contactIdentity,
              },
            },
          },
        }));

      const duplicate = await tx.message.findFirst({
        where: {
          externalId,
          conversation: { workspaceId },
        },
        include: {
          conversation: {
            include: {
              contact: { include: contactInclude },
              assignedTo: { include: assigneeInclude },
              messages: { orderBy: { createdAt: 'asc' } },
            },
          },
        },
      });

      if (duplicate) return this.mapConversation(duplicate.conversation); // if the message is already existing return the conversation it relates to

      const existingConversation = await tx.conversation.findUnique({
        where: { contactId: savedContact.id },
        select: { id: true, workspaceId: true, channel: true },
      });

      if (
        existingConversation &&
        (existingConversation.workspaceId !== workspaceId ||
          existingConversation.channel !== channel)
      ) {
        throw new Error(
          'Conversation channel does not match the workspace channel',
        );
      }

      const conversation = await tx.conversation.upsert({
        where: { contactId: savedContact.id },
        create: {
          workspaceId,
          channel,
          contactId: savedContact.id,
          lastMessageAt: receivedAt,
          messages: {
            create: {
              direction: 'INBOUND',
              content,
              externalId,
              raw: this.toJsonValue(raw),
              createdAt: receivedAt,
            },
          },
        },
        update: {
          lastMessageAt: receivedAt,
          messages: {
            create: {
              direction: 'INBOUND',
              content,
              externalId,
              raw: this.toJsonValue(raw),
              createdAt: receivedAt,
            },
          },
        },
        include: {
          contact: { include: contactInclude },
          assignedTo: { include: assigneeInclude },
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });

      if (!conversation.lastMessageAt || receivedAt > conversation.lastMessageAt) {
        const updated = await tx.conversation.update({
          where: { id: conversation.id },
          data: { lastMessageAt: receivedAt },
          include: {
            contact: { include: contactInclude },
            assignedTo: { include: assigneeInclude },
            messages: { orderBy: { createdAt: 'asc' } },
          },
        });
        return this.mapConversation(updated);
      }

      return this.mapConversation(conversation);
    });
  }

  async assignConversation(
    id: string,
    workspaceId: string,
    memberId: string | null,
  ): Promise<ConversationWithRelationsDto | null> {
    await prisma.conversation.updateMany({
      where: { id, workspaceId },
      data: { assignedToId: memberId },
    });
    return this.findConversation(id, workspaceId);
  }

  async resolveConversation(
    id: string,
    workspaceId: string,
  ): Promise<ConversationWithRelationsDto | null> {
    await prisma.conversation.updateMany({
      where: { id, workspaceId },
      data: { status: 'RESOLVED' },
    });
    return this.findConversation(id, workspaceId);
  }

  async markAsRead(
    id: string,
    workspaceId: string,
    memberId: string,
    readAt: Date,
  ): Promise<ConversationWithRelationsDto | null> {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.conversation.updateMany({
        where: { id, workspaceId, assignedToId: memberId },
        data: { lastReadAt: readAt },
      });

      if (updated.count === 0) return null;

      await tx.message.updateMany({
        where: {
          conversationId: id,
          direction: 'INBOUND',
          createdAt: { lte: readAt },
          status: { in: ['SENT', 'DELIVERED'] },
        },
        data: { status: 'READ' },
      });
      const conv = await tx.conversation.findFirst({
        where: { id, workspaceId },
        include: {
          contact: { include: contactInclude },
          assignedTo: { include: assigneeInclude },
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
      return this.mapConversation(conv);
    });
  }

  async appendOutboundMessage(
    conversationId: string,
    workspaceId: string,
    memberId: string,
    data: CreateMessageInput,
    status: 'SENT' | 'FAILED',
    externalId?: string,
  ): Promise<ConversationWithRelationsDto | null> {
    return prisma.$transaction(async (tx) => {
      const now = new Date();
      await tx.message.create({
        data: {
          conversationId,
          direction: 'OUTBOUND',
          content: data.content,
          senderMemberId: memberId,
          status,
          externalId,
          createdAt: now,
        },
      });
      await tx.conversation.updateMany({
        where: { id: conversationId, workspaceId },
        data: { lastMessageAt: now, lastReadAt: now },
      });
      const conv = await tx.conversation.findFirst({
        where: { id: conversationId, workspaceId },
        include: {
          contact: { include: contactInclude },
          assignedTo: { include: assigneeInclude },
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
      return this.mapConversation(conv);
    });
  }

  async updateFailedOutboundMessage(
    messageId: string,
    conversationId: string,
    workspaceId: string,
    status: 'SENT' | 'FAILED',
    externalId?: string,
  ): Promise<ConversationWithRelationsDto | null> {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.message.updateMany({
        where: {
          id: messageId,
          conversationId,
          direction: 'OUTBOUND',
          status: 'FAILED',
          conversation: { workspaceId },
        },
        data: { status, externalId: externalId ?? null },
      });

      if (!updated.count) return null;

      const conv = await tx.conversation.findFirst({
        where: { id: conversationId, workspaceId },
        include: {
          contact: { include: contactInclude },
          assignedTo: { include: assigneeInclude },
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
      return this.mapConversation(conv);
    });
  }

  async updateMessageStatus(
    workspaceId: string,
    externalId: string,
    status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED',
  ): Promise<MessageWithConversationDto | null> {
    const message = await this.findConversationByExternalMessageId(
      workspaceId,
      externalId,
    );
    if (!message) return null;

    const currentStatuses: ('SENT' | 'DELIVERED')[] =
      status === 'READ'
        ? ['SENT', 'DELIVERED']
        : status === 'DELIVERED'
          ? ['SENT']
          : ['SENT', 'DELIVERED']; // forward status update only

    if (status === 'SENT') return message;

    await prisma.message.updateMany({
      where: {
        id: message.id,
        conversation: { workspaceId },
        status: { in: currentStatuses },
      },
      data: { status },
    });

    return this.findConversationByExternalMessageId(workspaceId, externalId);
  }

  private isUnread(
    lastMessageAt: Date | null,
    lastReadAt: Date | null,
  ): boolean {
    return Boolean(
      lastMessageAt && (!lastReadAt || lastMessageAt > lastReadAt),
    );
  }

  private toJsonValue(
    value: unknown,
  ): object | string | number | boolean | undefined {
    if (value === null || value === undefined) return undefined;
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    }
    return JSON.parse(JSON.stringify(value)) as object;
  }
}
