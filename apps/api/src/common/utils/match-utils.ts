export function matchRoles(
  requiredRoles: string[],
  userRole: string | undefined,
): boolean {
  if (!userRole) {
    return false;
  }

  return requiredRoles.includes(userRole);
}

export function matchPermissions(
  requiredPermissions: string[],
  userPermissions: string[] | undefined,
): boolean {
  if (!userPermissions?.length) {
    return false;
  }

  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );
}
