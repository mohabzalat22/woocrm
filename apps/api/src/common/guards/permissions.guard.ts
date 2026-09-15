import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsService } from '../../permissions/permissions.service';
import { matchPermissions } from '../utils/match-utils';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const permissions = this.reflector.get(Permissions, context.getHandler());

    if (!permissions) {
      return true;
    }

    if (!user?.role) {
      return false;
    }

    const rolePermissions = await this.permissionsService.findAllForRole(
      user.role,
    );

    return matchPermissions(
      permissions,
      rolePermissions.map((permission) => permission.name),
    );
  }
}
