import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@repo/shared-types';
import { ZodResponse } from 'nestjs-zod';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { SetWorkspaceChannelDto } from './dto/set-workspace-channel.dto';
import { WorkspaceChannelResponseDto } from './dto/workspace-channel-response.dto';
import { WorkspaceChannelService } from './workspace-channel.service';

@ApiTags('settings')
@ApiCookieAuth('access_token')
@Controller('workspaces/:workspaceId/settings/channel')
export class WorkspaceChannelController {
  constructor(
    private readonly workspaceChannelService: WorkspaceChannelService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get the workspace messaging channel' })
  get(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.workspaceChannelService.getChannel(userId, workspaceId);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ZodResponse({ status: 201, type: WorkspaceChannelResponseDto })
  @ApiOperation({ summary: 'Set the workspace messaging channel once' })
  set(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Body() data: SetWorkspaceChannelDto,
  ) {
    return this.workspaceChannelService.setChannel(userId, workspaceId, data);
  }
}
