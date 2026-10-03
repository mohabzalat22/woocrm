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
} from './channels/messaging-strategy.interface';
import { MessagingStrategyRegistry } from './registry/messaging-strategy.registry';

@ApiTags('messaging')
@ApiCookieAuth('access_token')
@Controller('workspaces/:workspaceId/messaging')
export class MessagingController {
  constructor(private readonly strategyRegistry: MessagingStrategyRegistry) {}

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
    const strategy = await this.strategyRegistry.getConnectedChannelStrategy(
      workspaceId,
      channelName,
    );

    //MOX: Registry entry point
    const recipient: Recipient = message.recipient;

    if (!(await strategy.isAvailable(recipient))) {
      throw new BadRequestException(
        `Recipient is not available on the ${channelName} channel`,
      );
    }

    const outgoing: OutgoingMessage = {
      workspaceId,
      ...message,
    };

    return strategy.send(outgoing);
  }
}
