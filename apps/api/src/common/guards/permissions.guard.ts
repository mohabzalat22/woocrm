import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsService } from '../../permissions/permissions.service';
import { matchPermissions } from '../utils/match-utils';
import { WorkspaceMembersService } from '../../workspace-members/workspace-members.service';
import { PermissionDto } from '../../permissions/dto';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workspaceMembersService: WorkspaceMembersService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      Permissions,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const req = context.switchToHttp().getRequest<{
      user?: { id: string };
      params?: { workspaceId?: string };
    }>();
    const user = req.user;
    const workspaceId = req.params?.workspaceId;

    if (!user?.id || !workspaceId) {
      return false;
    }

    const member = await this.workspaceMembersService.findByUserId(
      user.id,
      user.id,
      workspaceId,
    );

    if (!member) {
      return false;
    }

    const permissions = await this.permissionsService.findAllByRoleId(
      member.roleId,
    );

    if (!permissions) {
      return false;
    }

    const permissionNames: string[] = permissions.map(
      (permission: PermissionDto) => permission.name,
    );

    return matchPermissions(requiredPermissions, permissionNames);
  }
}
