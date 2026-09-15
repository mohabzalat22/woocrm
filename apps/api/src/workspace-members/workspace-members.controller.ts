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
import { JwtAuthGuard } from '../common/guards/auth-guard';

import { WorkspaceMembersService } from './workspace-members.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateWorkspaceMemberInput } from './schemas/create-workspace-member.schema';
import { UpdateWorkspaceMemberInput } from './schemas/update-workspace-member.schema';
import { CurrentWorkspace } from '@/common/decorators/current-workspace.decorator';
@Controller('workspace-members')
@UseGuards(JwtAuthGuard)
export class WorkspaceMembersController {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @Get(':id/workspaces/:workspaceId')
  async findById(
    @Param('id') id: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.findById(id, workspaceId);
  }

  @Get('/workspaces/:workspaceId')
  async findAll(
    @CurrentUser() userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.findAllByWorkspaceId(
      userId,
      workspaceId,
    );
  }

  @Post()
  async create(@Body() data: CreateWorkspaceMemberInput) {
    return await this.workspaceMembersService.create(data);
  }

  @Patch(':id/workspaces/:workspaceId')
  async update(
    @Param('id') id: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Body() data: UpdateWorkspaceMemberInput,
  ) {
    return await this.workspaceMembersService.updateById(id, workspaceId, data);
  }

  @Delete(':id/workspaces/:workspaceId')
  async delete(
    @Param('id') id: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    return await this.workspaceMembersService.deleteById(id, workspaceId);
  }
}
