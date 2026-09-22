import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { Permission } from '@repo/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('workspaces/:workspaceId/permissions')
export class WorkspacePermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions(Permission.SETTINGS_VIEW)
  @ApiOperation({ summary: 'List all permissions in a workspace' })
  @ApiParam({ name: 'workspaceId' })
  @ApiOkResponse({ type: [PermissionResponseDto] })
  @ZodResponse({ status: 200, type: [PermissionResponseDto] })
  findAll(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.permissionsService.findAllByWorkspaceId(
      currentUserId,
      workspaceId,
    );
  }
}
