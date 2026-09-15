import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { matchRoles } from '../utils/match-utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    if (!user) {
      return false;
    }

    return matchRoles(roles, user.roles);
  }
}
