export type RoleName = "ADMIN" | "MANAGER" | "AGENT";

export interface TeamRole {
  id: string;
  name: RoleName;
  description: string | null;
  workspaceId: string;
}

export interface TeamUser {
  id: string;
  email: string;
  name: string | null;
}

export interface WorkspaceMember {
  id: string;
  roleId: string;
  userId: string;
  workspaceId: string;
  createdAt: string;
  user: TeamUser;
  role: TeamRole;
}

export interface WorkspacePermission {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
}

export interface UpdatePermissionPayload {
  description?: string | null;
}

export interface CreateInvitationPayload {
  email: string;
  roleId: string;
}

export interface Invitation {
  id: string;
  token: string;
  email: string;
  roleId: string;
  workspaceId: string;
  createdById: string;
  expiresAt: string | null;
  createdAt: string;
}
