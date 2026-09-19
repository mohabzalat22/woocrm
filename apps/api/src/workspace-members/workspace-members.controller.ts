import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { WorkspaceMembersService } from './workspace-members.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentWorkspace } from '../common/decorators/current-workspace.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Permission } from '@repo/shared-types';
import {
  CreateWorkspaceMemberDto,
  UpdateWorkspaceMemberDto,
  WorkspaceMemberResponseDto,
} from './dto';
@ApiTags('workspace-members')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('workspaces/:workspaceId/members')
export class WorkspaceMembersController {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @Get()
  @RequirePermissions(Permission.TEAM_VIEW)
  @ApiOperation({ summary: 'List members of a workspace' })
  @ApiParam({ name: 'workspaceId' })
  @ApiOkResponse({ type: [WorkspaceMemberResponseDto] })
  @ApiNotFoundResponse({ description: 'Member not found in this workspace' })
  async findAll(
    @CurrentUser('id') currentUserId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.findAllByWorkspaceId(
      currentUserId,
      workspaceId,
    );
  }

  @Get(':memberId')
  @RequirePermissions(Permission.TEAM_VIEW)
  @ApiOperation({ summary: 'Find a workspace member by id' })
  @ApiParam({ name: 'memberId' })
  @ApiParam({ name: 'workspaceId' })
  @ApiOkResponse({ type: WorkspaceMemberResponseDto })
  async findById(
    @Param('memberId') memberId: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.findById(
      memberId,
      currentUserId,
      workspaceId,
    );
  }

  @Post()
  @RequirePermissions(Permission.TEAM_MANAGE)
  @ApiParam({ name: 'workspaceId' })
  @ApiOperation({ summary: 'Add a member to a workspace' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'Member already exists' })
  @ZodResponse({
    status: 201,
    description: 'Created workspace member',
    type: WorkspaceMemberResponseDto,
  })
  async create(
    @Body() data: CreateWorkspaceMemberDto,
    @CurrentUser('id') currentUserId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.create(
      currentUserId,
      workspaceId,
      data,
    );
  }

  @Patch(':memberId')
  @RequirePermissions(Permission.TEAM_MANAGE)
  @ApiOperation({ summary: 'Update a workspace member' })
  @ApiParam({ name: 'memberId' })
  @ApiParam({ name: 'workspaceId' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({ description: 'Member not found in this workspace' })
  @ApiOkResponse({ type: WorkspaceMemberResponseDto })
  async update(
    @Param('memberId') memberId: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Body() data: UpdateWorkspaceMemberDto,
  ) {
    return await this.workspaceMembersService.updateById(
      memberId,
      currentUserId,
      workspaceId,
      data,
    );
  }

  @Delete(':memberId')
  @RequirePermissions(Permission.TEAM_MANAGE)
  @ApiOperation({ summary: 'Remove a workspace member' })
  @ApiParam({ name: 'memberId' })
  @ApiParam({ name: 'workspaceId' })
  @ApiNotFoundResponse({ description: 'Member not found in this workspace' })
  @ApiOkResponse({ type: WorkspaceMemberResponseDto })
  async delete(
    @Param('memberId') memberId: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.deleteById(
      memberId,
      currentUserId,
      workspaceId,
    );
  }
}
