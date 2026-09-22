import { request } from "@/common/lib/api";
import type {
  CreateInvitationPayload,
  Invitation,
  RolePermission,
  TeamRole,
  UpdatePermissionPayload,
  WorkspaceMember,
  WorkspacePermission,
} from "../types/team.interface";

export const TEAM_KEYS = {
  roles: (workspaceId: string) => ["workspace-roles", workspaceId] as const,
  members: (workspaceId: string) => ["workspace-members", workspaceId] as const,
  permissions: (workspaceId: string) =>
    ["workspace-permissions", workspaceId] as const,
  rolePermissions: (workspaceId: string, roleId: string) =>
    ["role-permissions", workspaceId, roleId] as const,
};

const rolePermissionsPath = (workspaceId: string, roleId: string) =>
  `workspaces/${workspaceId}/roles/${roleId}/permissions`;

export const teamApi = {
  findRoles: (workspaceId: string): Promise<TeamRole[]> =>
    request(`workspaces/${workspaceId}/roles`, { method: "GET" }),

  findMembers: (workspaceId: string): Promise<WorkspaceMember[]> =>
    request(`workspaces/${workspaceId}/members`, { method: "GET" }),

  updateMember: (
    workspaceId: string,
    memberId: string,
    data: { roleId: string },
  ): Promise<WorkspaceMember> =>
    request(`workspaces/${workspaceId}/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteMember: (
    workspaceId: string,
    memberId: string,
  ): Promise<WorkspaceMember> =>
    request(`workspaces/${workspaceId}/members/${memberId}`, {
      method: "DELETE",
    }),

  findPermissions: (workspaceId: string): Promise<WorkspacePermission[]> =>
    request(`workspaces/${workspaceId}/permissions`, { method: "GET" }),

  findRolePermissions: (
    workspaceId: string,
    roleId: string,
  ): Promise<WorkspacePermission[]> =>
    request(rolePermissionsPath(workspaceId, roleId), { method: "GET" }),

  updatePermission: (
    workspaceId: string,
    roleId: string,
    permissionId: string,
    data: UpdatePermissionPayload,
  ): Promise<WorkspacePermission> =>
    request(`${rolePermissionsPath(workspaceId, roleId)}/${permissionId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  assignPermission: (
    workspaceId: string,
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission> =>
    request(
      `${rolePermissionsPath(workspaceId, roleId)}/${permissionId}/assign`,
      { method: "POST" },
    ),

  detachPermission: (
    workspaceId: string,
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission> =>
    request(
      `${rolePermissionsPath(workspaceId, roleId)}/${permissionId}/detach`,
      { method: "DELETE" },
    ),

  createInvitation: (
    workspaceId: string,
    data: CreateInvitationPayload,
  ): Promise<Invitation> =>
    request(`workspaces/${workspaceId}/invitations`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
