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
  ApiCookieAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { PermissionsService } from './permissions.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionResponseDto,
  RolePermissionResponseDto,
} from './dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Permission } from '@repo/shared-types';

@ApiTags('permissions')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('workspaces/:workspaceId/roles/:roleId/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions(Permission.SETTINGS_VIEW)
  @ApiOperation({ summary: 'List permissions for a role' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'roleId' })
  @ApiOkResponse({
    type: [PermissionResponseDto],
    description: 'Role permissions',
  })
  @ApiNotFoundResponse({ description: 'Member or role not found' })
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('roleId') roleId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.permissionsService.findAll(currentUserId, roleId, workspaceId);
  }

  @Get(':permissionId')
  @RequirePermissions(Permission.SETTINGS_VIEW)
  @ApiOperation({ summary: 'Find a permission by id' })
  @ApiParam({ name: 'permissionId' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'roleId' })
  @ApiOkResponse({ type: PermissionResponseDto, description: 'Permission' })
  @ApiNotFoundResponse({ description: 'Member, role, or permission not found' })
  findById(
    @Param('permissionId') permissionId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('roleId') roleId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.permissionsService.findById(
      permissionId,
      currentUserId,
      roleId,
      workspaceId,
    );
  }

  @Post()
  @RequirePermissions(Permission.SETTINGS_EDIT)
  @ApiOperation({ summary: 'Create a permission for a role' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'roleId' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({ description: 'Member or role not found' })
  @ZodResponse({
    status: 201,
    description: 'Created permission',
    type: PermissionResponseDto,
  })
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('roleId') roleId: string,
    @CurrentUser('id') currentUserId: string,
    @Body() data: CreatePermissionDto,
  ) {
    return this.permissionsService.create(
      currentUserId,
      roleId,
      workspaceId,
      data,
    );
  }

  @Patch(':permissionId')
  @RequirePermissions(Permission.SETTINGS_EDIT)
  @ApiOperation({ summary: 'Update a permission by id' })
  @ApiParam({ name: 'permissionId' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'roleId' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiOkResponse({
    type: PermissionResponseDto,
    description: 'Updated permission',
  })
  @ApiNotFoundResponse({ description: 'Member, role, or permission not found' })
  updateById(
    @Param('permissionId') permissionId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('roleId') roleId: string,
    @CurrentUser('id') currentUserId: string,
    @Body() data: UpdatePermissionDto,
  ) {
    return this.permissionsService.updateById(
      permissionId,
      currentUserId,
      roleId,
      workspaceId,
      data,
    );
  }

  @Delete(':permissionId')
  @RequirePermissions(Permission.SETTINGS_EDIT)
  @ApiOperation({ summary: 'Delete a permission by id' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'roleId' })
  @ApiParam({ name: 'permissionId' })
  @ApiOkResponse({
    type: PermissionResponseDto,
    description: 'Deleted permission',
  })
  @ApiNotFoundResponse({ description: 'Member, role, or permission not found' })
  deleteById(
    @Param('permissionId') permissionId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('roleId') roleId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.permissionsService.deleteById(
      permissionId,
      currentUserId,
      roleId,
      workspaceId,
    );
  }

  @Post(':permissionId/assign')
  @RequirePermissions(Permission.SETTINGS_EDIT)
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'roleId' })
  @ApiParam({ name: 'permissionId' })
  @ApiNotFoundResponse({ description: 'Member or role not found' })
  @ApiConflictResponse({
    description: 'Permission already assigned to this role',
  })
  @ZodResponse({
    status: 201,
    description: 'Assigned role permission',
    type: RolePermissionResponseDto,
  })
  assignPermissionToRole(
    @Param('permissionId') permissionId: string,
    @Param('roleId') roleId: string,
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.permissionsService.assignPermissionToRole(
      permissionId,
      roleId,
      currentUserId,
      workspaceId,
    );
  }

  @Delete(':permissionId/detach')
  @RequirePermissions(Permission.SETTINGS_EDIT)
  @ApiOperation({ summary: 'Detach a permission from a role' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'roleId' })
  @ApiParam({ name: 'permissionId' })
  @ApiOkResponse({
    type: RolePermissionResponseDto,
    description: 'Detached role permission',
  })
  @ApiNotFoundResponse({
    description: 'Member, role, or assigned permission not found',
  })
  detachPermissionFromRole(
    @Param('permissionId') permissionId: string,
    @Param('roleId') roleId: string,
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.permissionsService.detachPermissionFromRole(
      permissionId,
      roleId,
      currentUserId,
      workspaceId,
    );
  }
}
