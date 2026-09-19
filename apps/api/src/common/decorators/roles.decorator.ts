import { SetMetadata } from '@nestjs/common';
import { Role } from '@repo/shared-types';

export const ROLES_KEY = 'workspaceRoles';
export const Roles = (...roles: (Role | Role[])[]) =>
  SetMetadata(ROLES_KEY, roles.flat());
