import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@repo/shared-types';
import { ZodResponse } from 'nestjs-zod';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import {
  AssignConversationDto,
  ConversationResponseDto,
  ConversationsPageResponseDto,
  CreateMessageDto,
  ListConversationsDto,
} from './dto';
import { InboxService } from './inbox.service';

@ApiTags('inbox')
@ApiCookieAuth('access_token')
@Controller('workspaces/:workspaceId/inbox/conversations')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Get()
  @RequirePermissions(Permission.INBOX_VIEW_OWN)
  @ZodResponse({ status: 200, type: ConversationsPageResponseDto })
  @ApiOperation({ summary: 'List visible conversations' })
  list(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Query() query: ListConversationsDto,
  ) {
    return this.inboxService.listConversations(userId, workspaceId, query);
  }

  @Get(':conversationId')
  @RequirePermissions(Permission.INBOX_VIEW_OWN)
  @ZodResponse({ status: 200, type: ConversationResponseDto })
  @ApiOperation({ summary: 'Get a conversation with its contact and messages' })
  get(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.inboxService.getConversation(
      userId,
      workspaceId,
      conversationId,
    );
  }

  @Post(':conversationId/assign')
  @RequirePermissions(Permission.INBOX_ASSIGN)
  @ZodResponse({ status: 200, type: ConversationResponseDto })
  @ApiOperation({ summary: 'Assign a conversation to a workspace member' })
  assign(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
    @Body() data: AssignConversationDto,
  ) {
    return this.inboxService.assignConversation(
      userId,
      workspaceId,
      conversationId,
      data,
    );
  }

  @Post(':conversationId/resolve')
  @RequirePermissions(Permission.INBOX_VIEW_OWN)
  @ZodResponse({ status: 200, type: ConversationResponseDto })
  @ApiOperation({ summary: 'Resolve a conversation' })
  resolve(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.inboxService.resolveConversation(
      userId,
      workspaceId,
      conversationId,
    );
  }

  @Post(':conversationId/read')
  @RequirePermissions(Permission.INBOX_VIEW_OWN)
  @ZodResponse({ status: 200, type: ConversationResponseDto })
  @ApiOperation({ summary: 'Mark a conversation as read' })
  read(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.inboxService.markAsRead(userId, workspaceId, conversationId);
  }

  @Post(':conversationId/messages')
  @RequirePermissions(Permission.INBOX_SEND_MESSAGE)
  @ZodResponse({ status: 201, type: ConversationResponseDto })
  @ApiOperation({ summary: 'Send and persist an outbound message' })
  sendMessage(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
    @Body() data: CreateMessageDto,
  ) {
    return this.inboxService.sendMessage(
      userId,
      workspaceId,
      conversationId,
      data,
    );
  }
}
