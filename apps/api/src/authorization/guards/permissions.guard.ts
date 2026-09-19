import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../../permissions/permissions.service';
import { matchPermissions } from '../../common/utils/match-utils';
import { PermissionDto } from '../../permissions/dto';
import { Permission } from '@repo/shared-types';
import { REQUIRED_PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { WorkspaceContextService } from '../workspace-context.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    const req = context.switchToHttp().getRequest<{
      user?: { id: string };
      params?: { workspaceId?: string };
      workspaceMembership?: { roleId: string };
    }>();
    const user = req.user;
    const workspaceId = req.params?.workspaceId;

    if (!workspaceId && !requiredPermissions) {
      return true;
    }

    if (!workspaceId || !user?.id) {
      throw new ForbiddenException('Unauthorized request');
    }

    const member = await this.workspaceContext.requireMembership(user.id, workspaceId);
    req.workspaceMembership = member;

    if (!requiredPermissions?.length) return true;

    const permissions = await this.permissionsService.findAllByRoleId(
      member.roleId,
      workspaceId,
    );

    if (!permissions) {
      throw new ForbiddenException('Unauthorized request');
    }

    const permissionNames: Permission[] = permissions.map(
      (permission: PermissionDto) => permission.name as Permission,
    );

    if (!matchPermissions(requiredPermissions, permissionNames)) {
      throw new ForbiddenException('Unauthorized request');
    }

    return true;
  }
}
