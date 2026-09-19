import { SetMetadata } from '@nestjs/common';
import { SystemRole } from '@repo/shared-types';

export const PLATFORM_ROLES_KEY = 'platformRoles';
export const PlatformRoles = (...roles: SystemRole[]) =>
  SetMetadata(PLATFORM_ROLES_KEY, roles);
