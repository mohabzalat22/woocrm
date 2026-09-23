import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@repo/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { SendMessageDto } from './dto';
import type {
  OutgoingMessage,
  Recipient,
  SendResult,
} from './channels/message-channel.interface';
import { MessageChannelRegistry } from './registry/message-channel.registry';

@ApiTags('messaging')
@ApiCookieAuth('access_token')
@Controller('workspaces/:workspaceId/messaging')
export class MessagingController {
  constructor(private readonly channelRegistry: MessageChannelRegistry) {}

  @Post(':channel/messages')
  @RequirePermissions(Permission.INBOX_SEND_MESSAGE)
  @ApiOperation({ summary: 'Send a message through a registered channel' })
  @ApiBody({ type: SendMessageDto })
  async send(
    @CurrentUser('id') _userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('channel') channelName: string,
    @Body() message: SendMessageDto,
  ): Promise<SendResult> {
    const channel = this.channelRegistry.get(channelName); // REGISTERY

    const recipient: Recipient = message.recipient;

    if (!(await channel.isAvailable(recipient))) {
      throw new BadRequestException(
        `Recipient is not available on the ${channelName} channel`,
      );
    }

    const outgoing: OutgoingMessage = {
      workspaceId,
      ...message,
    };

    return channel.send(outgoing);
  }
}
