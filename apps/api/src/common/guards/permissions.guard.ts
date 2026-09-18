import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PermissionsService } from '../../permissions/permissions.service';
import { matchPermissions } from '../utils/match-utils';
import { WorkspaceMembersService } from '../../workspace-members/workspace-members.service';
import { PermissionDto } from '../../permissions/dto';
import { RolesService } from '../../roles/roles.service';
import { Permission, RolePermissions, Role } from '@repo/shared-types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    if (!member.roleId) {
      return false;
    }

    const role = await this.rolesService.findById(member.roleId, workspaceId);

    if (!role.name) {
      return false;
    }

    const roleName = role.name as Role;

    const requiredPermissions = RolePermissions[roleName];

    if (!requiredPermissions) {
      return true;
    }

    const permissions = await this.permissionsService.findAllByRoleId(
      member.roleId,
    );

    if (!permissions) {
      return false;
    }

    const permissionNames: Permission[] = permissions.map(
      (permission: PermissionDto) => permission.name as Permission,
    );

    return matchPermissions(requiredPermissions, permissionNames);
  }
}
