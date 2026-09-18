import { Permission, Role } from '@repo/shared-types';

export function matchRoles(
  requiredRoles: Role[],
  userRole: Role | undefined,
): boolean {
  if (!userRole) {
    return false;
  }

  return requiredRoles.includes(userRole);
}

export function matchPermissions(
  requiredPermissions: Permission[],
  userPermissions: Permission[] | undefined,
): boolean {
  if (!userPermissions?.length) {
    return false;
  }

  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );
}
