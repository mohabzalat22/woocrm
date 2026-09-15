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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { JwtAuthGuard } from '../common/guards/auth-guard';
import { PermissionsService } from './permissions.service';
import { PermissionResponseDto, RolePermissionResponseDto } from './dto';
import { RoleInput } from '..//workspace-members/schemas/role.schema';
import { UpdatePermissionInput } from './schemas/update-permission.schema';
import { CreatePermissionInput } from './schemas/create-permission.schema';

@ApiTags('permissions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all permissions' })
  @ApiOkResponse({ type: [PermissionResponseDto], description: 'All permissions' })
  async findAll() {
    return await this.permissionsService.findAll();
  }

  @Get('roles/:role')
  @ApiOperation({ summary: 'List permissions assigned to a role' })
  @ApiParam({ name: 'role', enum: ['ADMIN', 'MANAGER', 'AGENT'] })
  @ApiOkResponse({
    type: [PermissionResponseDto],
    description: 'Permissions for the given role',
  })
  async findAllForRole(@Param('role') role: RoleInput) {
    return await this.permissionsService.findAllForRole(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a permission by id' })
  @ApiParam({ name: 'id', example: '04916981-b958-4ba6-854c-d99c47f25cd3' })
  @ApiOkResponse({
    type: PermissionResponseDto,
    description: 'Permission, or null if not found',
  })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  async findById(@Param('id') id: string) {
    return await this.permissionsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a permission' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ZodResponse({
    status: 201,
    description: 'Created permission',
    type: PermissionResponseDto,
  })
  async create(@Body() data: CreatePermissionInput) {
    return await this.permissionsService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a permission by id' })
  @ApiParam({ name: 'id', example: '04916981-b958-4ba6-854c-d99c47f25cd3' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiOkResponse({ type: PermissionResponseDto, description: 'Updated permission' })
  async update(@Param('id') id: string, @Body() data: UpdatePermissionInput) {
    return await this.permissionsService.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission by id' })
  @ApiParam({ name: 'id', example: '04916981-b958-4ba6-854c-d99c47f25cd3' })
  @ApiOkResponse({ type: PermissionResponseDto, description: 'Deleted permission' })
  async delete(@Param('id') id: string) {
    return await this.permissionsService.deleteById(id);
  }

  @Post(':id/roles/:role')
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiParam({ name: 'id', example: '04916981-b958-4ba6-854c-d99c47f25cd3' })
  @ApiParam({ name: 'role', enum: ['ADMIN', 'MANAGER', 'AGENT'] })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  @ZodResponse({
    status: 201,
    description: 'Role permission assignment',
    type: RolePermissionResponseDto,
  })
  async assignToRole(@Param('id') id: string, @Param('role') role: RoleInput) {
    return await this.permissionsService.assignPermissionToRole(role, id);
  }

  @Delete(':id/roles/:role')
  @ApiOperation({ summary: 'Detach a permission from a role' })
  @ApiParam({ name: 'id', example: '04916981-b958-4ba6-854c-d99c47f25cd3' })
  @ApiParam({ name: 'role', enum: ['ADMIN', 'MANAGER', 'AGENT'] })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  @ApiOkResponse({
    type: RolePermissionResponseDto,
    description: 'Detached role permission',
  })
  async detachFromRole(
    @Param('id') id: string,
    @Param('role') role: RoleInput,
  ) {
    return await this.permissionsService.detachPermissionFromRole(role, id);
  }
}
