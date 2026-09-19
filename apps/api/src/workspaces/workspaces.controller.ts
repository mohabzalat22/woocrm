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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { WorkspacesService } from './workspaces.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PlatformRoles } from '../common/decorators/platform-roles.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, SystemRole } from '@repo/shared-types';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceResponseDto,
} from './dto';
@ApiTags('workspaces')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ApiOperation({ summary: 'List workspaces for the authenticated user' })
  @ApiOkResponse({
    type: [WorkspaceResponseDto],
    description: 'User workspaces',
  })
  async findAll(@CurrentUser('id') userId: string) {
    return await this.workspacesService.findAll(userId);
  }

  @Get(':workspaceId')
  @ApiOperation({ summary: 'Find a workspace by id' })
  @ApiParam({
    name: 'workspaceId',
    example: '04916981-b958-4ba6-854c-d99c47f25cd3',
  })
  @ApiOkResponse({ type: WorkspaceResponseDto, description: 'Workspace' })
  @ApiNotFoundResponse({ description: 'Workspace not found' })
  async findById(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.workspacesService.findById(workspaceId, userId);
  }

  @Post()
  @PlatformRoles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Create a workspace' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ZodResponse({
    status: 201,
    description: 'Created workspace',
    type: WorkspaceResponseDto,
  })
  async create(
    @CurrentUser('id') userId: string,
    @Body() data: CreateWorkspaceDto,
  ) {
    return await this.workspacesService.create(userId, data);
  }

  @Patch(':workspaceId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a workspace by id' })
  @ApiParam({
    name: 'workspaceId',
    example: '04916981-b958-4ba6-854c-d99c47f25cd3',
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiOkResponse({
    type: WorkspaceResponseDto,
    description: 'Updated workspace',
  })
  async update(
    @Param('workspaceId') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: UpdateWorkspaceDto,
  ) {
    return await this.workspacesService.updateById(id, userId, data);
  }

  @Delete(':workspaceId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a workspace by id' })
  @ApiParam({
    name: 'workspaceId',
    example: '04916981-b958-4ba6-854c-d99c47f25cd3',
  })
  @ApiOkResponse({
    type: WorkspaceResponseDto,
    description: 'Deleted workspace',
  })
  async delete(
    @Param('workspaceId') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.workspacesService.deleteById(id, userId);
  }
}
