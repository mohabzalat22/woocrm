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

import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../common/guards/auth-guard';
import { CreateWorkspaceInput } from './schemas/create-workspace.schema';
import { UpdateWorkspaceInput } from './schemas/update-workspace.schema';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get(':id')
  async finById(@Param('id') id: string, @CurrentUser() userId: string) {
    return await this.workspacesService.findById(id, userId);
  }

  @Get()
  async findAll(@CurrentUser() userId: string) {
    return await this.workspacesService.findAll(userId);
  }

  @Post()
  async create(
    @CurrentUser() userId: string,
    @Body() data: CreateWorkspaceInput,
  ) {
    return await this.workspacesService.create(userId, data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body() data: UpdateWorkspaceInput,
  ) {
    return await this.workspacesService.updateById(id, userId, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() userId: string) {
    return await this.workspacesService.deleteById(id, userId);
  }
}
