export function matchRoles(requiredRoles, userRoles): boolean {
  return requiredRoles.some((role) => userRoles.includes(role));
}
