export function matchRoles(
  requiredRoles: string[],
  userRoles: string[] | undefined,
): boolean {
  if (!userRoles?.length) {
    return false;
  }

  return requiredRoles.some((role) => userRoles.includes(role));
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
