import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { Permission } from '@repo/shared-types';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { RoleListResponseDto } from './dto';
import { RolesService } from './roles.service';

@ApiTags('roles')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('workspaces/:workspaceId/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions(Permission.TEAM_VIEW)
  @ApiOperation({ summary: 'List roles in a workspace' })
  @ApiParam({ name: 'workspaceId' })
  @ApiOkResponse({ type: [RoleListResponseDto.Output] })
  @ZodSerializerDto(RoleListResponseDto)
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.rolesService.findAllByWorkspaceId(workspaceId);
  }
}
