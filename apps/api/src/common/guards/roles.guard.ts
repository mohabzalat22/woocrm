import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { matchRoles } from '../utils/match-utils';
import { WorkspaceMembersService } from '../../workspace-members/workspace-members.service';
import { RolesRepository } from '../../roles/roles.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workspaceMembersService: WorkspaceMembersService,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
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
      workspaceId,
    );

    if (!member) {
      return false;
    }

    const role = await this.rolesRepository.findById(
      member.roleId,
      workspaceId,
    );

    if (!role) {
      return false;
    }

    return matchRoles(requiredRoles, role.name);
  }
}
