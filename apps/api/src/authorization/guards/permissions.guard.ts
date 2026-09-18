import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { PermissionsService } from '../../permissions/permissions.service';
import { matchPermissions } from '../../common/utils/match-utils';
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

    // Only workspace-scoped routes need permission checks. This lets the
    // global guard coexist with auth, user, and other non-workspace routes.
    if (!workspaceId) {
      return true;
    }

    if (!user?.id) {
      throw new ConflictException('UnAuthorized Request');
    }

    const member = await this.workspaceMembersService.findByUserId(
      user.id,
      user.id,
      workspaceId,
    );

    if (!member) {
      throw new ConflictException('UnAuthorized Request');
    }

    if (!member.roleId) {
      throw new ConflictException('UnAuthorized Request');
    }

    const role = await this.rolesService.findById(member.roleId, workspaceId);

    if (!role.name) {
      throw new ConflictException('UnAuthorized Request');
    }

    // Prisma stores role names as uppercase values while the shared enum uses
    // lowercase values for permission-map keys.
    const roleName = role.name.toLowerCase() as Role;

    const requiredPermissions = RolePermissions[roleName];

    if (!requiredPermissions) {
      return true;
    }

    const permissions = await this.permissionsService.findAllByRoleId(
      member.roleId,
    );

    if (!permissions) {
      throw new ConflictException('UnAuthorized Request');
    }

    const permissionNames: Permission[] = permissions.map(
      (permission: PermissionDto) => permission.name as Permission,
    );

    if (!matchPermissions(requiredPermissions, permissionNames)) {
      throw new ConflictException('UnAuthorized Request');
    }

    return true;
  }
}
