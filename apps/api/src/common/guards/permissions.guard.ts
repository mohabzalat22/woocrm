import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionsService } from '@/permissions/permissions.servie';

export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsServie: PermissionsService,
  ) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const permissions = this.reflector.get(Permissions, context.getHandler());

    if (!permissions) {
      return true;
    }

    const rolePermissions = await this.permissionsServie.findAllByRole(
      user.role,
    );
    return matchPermissions(permissions, rolePermissions);
  }
}
