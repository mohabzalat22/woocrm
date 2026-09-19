import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { matchRoles } from '../../common/utils/match-utils';
import { WorkspaceContextService } from '../workspace-context.service';
import { RolesRepository } from '../../roles/roles.repository';
import { Role } from '@repo/shared-types';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<{
      user?: { id: string };
      params?: { workspaceId?: string };
    }>();
    const user = req.user;
    const workspaceId = req.params?.workspaceId;

    if (!user?.id || !workspaceId) throw new ForbiddenException('Unauthorized request');

    const member = await this.workspaceContext.requireMembership(user.id, workspaceId);

    const role = await this.rolesRepository.findById(
      member.roleId,
      workspaceId,
    );

    if (!role) {
      throw new ForbiddenException('Unauthorized request');
    }

    const roleName = role.name.toLowerCase() as Role;

    if (!matchRoles(requiredRoles, roleName)) {
      throw new ForbiddenException('Unauthorized request');
    }

    return true;
  }
}
