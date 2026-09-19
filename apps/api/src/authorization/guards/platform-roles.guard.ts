import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SystemRole } from '@repo/shared-types';
import { PLATFORM_ROLES_KEY } from '../../common/decorators/platform-roles.decorator';

@Injectable()
export class PlatformRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      PLATFORM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<{
      user?: { systemRole?: SystemRole };
    }>();

    if (!request.user?.systemRole || !requiredRoles.includes(request.user.systemRole)) {
      throw new ForbiddenException('Unauthorized request');
    }

    return true;
  }
}
