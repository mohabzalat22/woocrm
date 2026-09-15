import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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

import { JwtAuthGuard } from '../common/guards/auth-guard';
import { WorkspaceMembersService } from './workspace-members.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentWorkspace } from '../common/decorators/current-workspace.decorator';
import { WorkspaceMemberResponseDto } from './dto';
import { CreateWorkspaceMemberInput } from './schemas/create-workspace-member.schema';
import { UpdateWorkspaceMemberInput } from './schemas/update-workspace-member.schema';

@ApiTags('workspace-members')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('workspace-members')
@UseGuards(JwtAuthGuard)
export class WorkspaceMembersController {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @Get('workspaces/:workspaceId')
  @ApiOperation({ summary: 'List members of a workspace' })
  @ApiParam({ name: 'workspaceId' })
  @ApiOkResponse({ type: [WorkspaceMemberResponseDto] })
  @ApiNotFoundResponse({ description: 'Member not found in this workspace' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.findAllByWorkspaceId(
      userId,
      workspaceId,
    );
  }

  @Get(':id/workspaces/:workspaceId')
  @ApiOperation({ summary: 'Find a workspace member by id' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'workspaceId' })
  @ApiOkResponse({ type: WorkspaceMemberResponseDto })
  async findById(
    @Param('id') id: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.findById(id, workspaceId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a member to a workspace' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'Member already exists' })
  @ZodResponse({
    status: 201,
    description: 'Created workspace member',
    type: WorkspaceMemberResponseDto,
  })
  async create(@Body() data: CreateWorkspaceMemberInput) {
    return await this.workspaceMembersService.create(data);
  }

  @Patch(':id/workspaces/:workspaceId')
  @ApiOperation({ summary: 'Update a workspace member' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'workspaceId' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({ description: 'Member not found in this workspace' })
  @ApiOkResponse({ type: WorkspaceMemberResponseDto })
  async update(
    @Param('id') id: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Body() data: UpdateWorkspaceMemberInput,
  ) {
    return await this.workspaceMembersService.updateById(id, workspaceId, data);
  }

  @Delete(':id/workspaces/:workspaceId')
  @ApiOperation({ summary: 'Remove a workspace member' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'workspaceId' })
  @ApiNotFoundResponse({ description: 'Member not found in this workspace' })
  @ApiOkResponse({ type: WorkspaceMemberResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.deleteById(id, workspaceId);
  }
}
