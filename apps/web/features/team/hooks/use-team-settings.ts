import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TEAM_KEYS, teamApi } from "../services/team.service";
import type {
  CreateInvitationPayload,
  UpdatePermissionPayload,
} from "../types/team.interface";

export function useTeamSettings(workspaceId: string | null) {
  const enabled = Boolean(workspaceId);
  const id = workspaceId ?? "";

  const roles = useQuery({
    queryKey: TEAM_KEYS.roles(id),
    queryFn: () => teamApi.findRoles(id),
    enabled,
    retry: false,
  });

  const members = useQuery({
    queryKey: TEAM_KEYS.members(id),
    queryFn: () => teamApi.findMembers(id),
    enabled,
    retry: false,
  });

  const permissions = useQuery({
    queryKey: TEAM_KEYS.permissions(id),
    queryFn: () => teamApi.findPermissions(id),
    enabled,
    retry: false,
  });

  return { roles, members, permissions };
}

export function useRolePermissions(
  workspaceId: string | null,
  roleId: string | null,
) {
  const enabled = Boolean(workspaceId && roleId);
  const workspace = workspaceId ?? "";
  const role = roleId ?? "";

  return useQuery({
    queryKey: TEAM_KEYS.rolePermissions(workspace, role),
    queryFn: () => teamApi.findRolePermissions(workspace, role),
    enabled,
    retry: false,
  });
}

export function useTeamMutations(workspaceId: string | null) {
  const queryClient = useQueryClient();
  const id = workspaceId ?? "";

  const refreshMembers = () =>
    queryClient.invalidateQueries({ queryKey: TEAM_KEYS.members(id) });

  const refreshPermissions = (roleId: string) => {
    queryClient.invalidateQueries({ queryKey: TEAM_KEYS.permissions(id) });
    queryClient.invalidateQueries({
      queryKey: TEAM_KEYS.rolePermissions(id, roleId),
    });
  };

  const updateMember = useMutation({
    mutationFn: ({ memberId, roleId }: { memberId: string; roleId: string }) =>
      teamApi.updateMember(id, memberId, { roleId }),
    onSuccess: refreshMembers,
  });

  const deleteMember = useMutation({
    mutationFn: (memberId: string) => teamApi.deleteMember(id, memberId),
    onSuccess: refreshMembers,
  });

  const updatePermission = useMutation({
    mutationFn: ({
      roleId,
      permissionId,
      data,
    }: {
      roleId: string;
      permissionId: string;
      data: UpdatePermissionPayload;
    }) => teamApi.updatePermission(id, roleId, permissionId, data),
    onSuccess: (_, variables) => refreshPermissions(variables.roleId),
  });

  const assignPermission = useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: string;
      permissionId: string;
    }) => teamApi.assignPermission(id, roleId, permissionId),
    onSuccess: (_, variables) => refreshPermissions(variables.roleId),
  });

  const detachPermission = useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: string;
      permissionId: string;
    }) => teamApi.detachPermission(id, roleId, permissionId),
    onSuccess: (_, variables) => refreshPermissions(variables.roleId),
  });

  const createInvitation = useMutation({
    mutationFn: (data: CreateInvitationPayload) =>
      teamApi.createInvitation(id, data),
  });

  return {
    updateMember,
    deleteMember,
    updatePermission,
    assignPermission,
    detachPermission,
    createInvitation,
  };
}
