import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { Permission } from '@repo/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentWorkspace } from '../common/decorators/current-workspace.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CreateInvitationDto, InvitationResponseDto } from './dto';
import { InvitationsService } from './invitations.service';

@ApiTags('invitations')
@ApiCookieAuth('access_token')
@Controller()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('workspaces/:workspaceId/invitations')
  @RequirePermissions(Permission.TEAM_MANAGE)
  @ApiParam({ name: 'workspaceId' })
  @ZodResponse({ status: 201, type: InvitationResponseDto })
  create(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Body() data: CreateInvitationDto,
  ) {
    return this.invitationsService.create(userId, workspaceId, data);
  }

  @Post('invitations/:token/accept')
  @ApiParam({ name: 'token' })
  @ApiOperation({ summary: 'Accept a workspace invitation' })
  accept(
    @Param('token') token: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('email') email: string,
  ) {
    return this.invitationsService.accept(token, userId, email);
  }
}
