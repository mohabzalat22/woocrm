"use client";

import { useEffect, useState } from "react";
import { Users, X } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import { Card, CardContent } from "@repo/ui/ui/card";
import { ConfirmationDialog } from "@/common/components/confirmation-dialog";
import { useActiveWorkspace } from "@/features/workspaces/hooks/active-workspace";
import {
  useRolePermissions,
  useTeamMutations,
  useTeamSettings,
} from "@/features/team/hooks/use-team-settings";
import type { WorkspacePermission } from "@/features/team/types/team.interface";
import { EmptyState } from "./empty-state";
import { InvitationDialog } from "./invitation-dialog";
import { InvitationsCard } from "./invitations-card";
import { MembersCard } from "./members-card";
import { PermissionDialog } from "./permission-dialog";
import { PermissionsCard } from "./permissions-card";
import {
  errorMessage,
  permissionLabel,
  roleLabel,
} from "./team-settings-utils";

export function TeamsSettings() {
  const { activeWorkspaceId } = useActiveWorkspace();
  const { roles, members, permissions } = useTeamSettings(activeWorkspaceId);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] =
    useState<WorkspacePermission | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<
    | { type: "member"; id: string; label: string }
    | { type: "permission"; id: string; label: string }
    | null
  >(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const rolePermissions = useRolePermissions(
    activeWorkspaceId,
    selectedRoleId || null,
  );
  const mutations = useTeamMutations(activeWorkspaceId);

  useEffect(() => {
    const firstRoleId = roles.data?.[0]?.id ?? "";
    if (
      !selectedRoleId ||
      !roles.data?.some((role) => role.id === selectedRoleId)
    ) {
      setSelectedRoleId(firstRoleId);
    }
  }, [roles.data, selectedRoleId]);

  function runAction(action: () => Promise<unknown>) {
    setActionError(null);
    return action().catch((error: unknown) => {
      setActionError(errorMessage(error, "The action could not be completed."));
    });
  }

  async function confirmDelete() {
    if (!deleteConfirmation) return;

    try {
      if (deleteConfirmation.type === "member") {
        await mutations.deleteMember.mutateAsync(deleteConfirmation.id);
      } else if (selectedRoleId) {
        await mutations.detachPermission.mutateAsync({
          roleId: selectedRoleId,
          permissionId: deleteConfirmation.id,
        });
      }
      setDeleteConfirmation(null);
    } catch (error) {
      setActionError(errorMessage(error, "The action could not be completed."));
    }
  }

  if (!activeWorkspaceId) {
    return (
      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <EmptyState
            icon={Users}
            title="Select a workspace"
            description="Choose a workspace from the sidebar to manage its team."
          />
        </CardContent>
      </Card>
    );
  }

  const selectedRole = roles.data?.find((role) => role.id === selectedRoleId);

  return (
    <div className="grid max-w-3xl gap-6">
      {actionError && (
        <div
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          <span className="flex-1">{actionError}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setActionError(null)}
            aria-label="Dismiss error"
          >
            <X />
          </Button>
        </div>
      )}
      {roles.isError || members.isError || permissions.isError ? (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          Unable to load this workspace&apos;s team settings. Check that your
          role has team and settings access.
        </div>
      ) : null}
      <MembersCard
        members={members.data ?? []}
        roles={roles.data ?? []}
        isLoading={members.isLoading || roles.isLoading}
        onUpdateRole={(memberId, roleId) =>
          runAction(() =>
            mutations.updateMember.mutateAsync({ memberId, roleId }),
          )
        }
        onDelete={(memberId) => {
          const member = members.data?.find((item) => item.id === memberId);
          setDeleteConfirmation({
            type: "member",
            id: memberId,
            label: member?.user.email ?? "this member",
          });
        }}
        isUpdating={mutations.updateMember.isPending}
        isDeleting={mutations.deleteMember.isPending}
      />
      <PermissionsCard
        roles={roles.data ?? []}
        selectedRoleId={selectedRoleId}
        onRoleChange={setSelectedRoleId}
        allPermissions={permissions.data ?? []}
        assignedPermissions={rolePermissions.data ?? []}
        isLoading={permissions.isLoading || rolePermissions.isLoading}
        onEdit={(permission) => {
          setEditingPermission(permission);
          setPermissionDialogOpen(true);
        }}
        onDelete={(permissionId) => {
          const permission = permissions.data?.find(
            (item) => item.id === permissionId,
          );
          setDeleteConfirmation({
            type: "permission",
            id: permissionId,
            label: permission
              ? permissionLabel(permission.name)
              : "this permission",
          });
        }}
        onAttach={(permissionId) => {
          if (selectedRoleId) {
            void runAction(() =>
              mutations.assignPermission.mutateAsync({
                roleId: selectedRoleId,
                permissionId,
              }),
            );
          }
        }}
        isPending={
          mutations.assignPermission.isPending ||
          mutations.detachPermission.isPending ||
          mutations.updatePermission.isPending
        }
      />
      <InvitationsCard
        onInvite={() => setInvitationDialogOpen(true)}
        disabled={!roles.data?.length}
      />
      <InvitationDialog
        open={invitationDialogOpen}
        onOpenChange={setInvitationDialogOpen}
        roles={roles.data ?? []}
        onCreate={(data) => mutations.createInvitation.mutateAsync(data)}
        isPending={mutations.createInvitation.isPending}
      />
      {editingPermission && (
        <PermissionDialog
          open={permissionDialogOpen}
          onOpenChange={setPermissionDialogOpen}
          permission={editingPermission}
          onSave={(data) => {
            if (!selectedRoleId)
              return Promise.reject(new Error("Choose a role first."));
            return mutations.updatePermission.mutateAsync({
              roleId: selectedRoleId,
              permissionId: editingPermission.id,
              data,
            });
          }}
          isPending={mutations.updatePermission.isPending}
        />
      )}
      <ConfirmationDialog
        open={Boolean(deleteConfirmation)}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmation(null);
        }}
        title={
          deleteConfirmation?.type === "member"
            ? "Remove team member?"
            : "Remove permission from role?"
        }
        description={
          deleteConfirmation?.type === "member"
            ? `Remove ${deleteConfirmation.label} from this workspace?`
            : `Remove ${deleteConfirmation?.label ?? "this permission"} from this role? It will remain available to other roles.`
        }
        confirmLabel={
          deleteConfirmation?.type === "member"
            ? "Remove member"
            : "Remove from role"
        }
        isPending={
          mutations.deleteMember.isPending ||
          mutations.detachPermission.isPending
        }
        onConfirm={confirmDelete}
      />
      {selectedRole && (
        <span className="sr-only">
          Managing {roleLabel(selectedRole.name)} permissions
        </span>
      )}
    </div>
  );
}
