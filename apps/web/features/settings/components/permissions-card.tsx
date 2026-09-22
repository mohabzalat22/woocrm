import { useEffect, useMemo, useState } from "react";
import { KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import { Label } from "@repo/ui/ui/label";
import type {
  TeamRole,
  WorkspacePermission,
} from "@/features/team/types/team.interface";
import { RoleDropdown } from "./role-dropdown";
import { TeamSettingsDropdown } from "./team-settings-dropdown";
import { permissionLabel } from "./team-settings-utils";

export function PermissionsCard({
  roles,
  selectedRoleId,
  onRoleChange,
  allPermissions,
  assignedPermissions,
  isLoading,
  onEdit,
  onDelete,
  onAttach,
  isPending,
}: {
  roles: TeamRole[];
  selectedRoleId: string;
  onRoleChange: (roleId: string) => void;
  allPermissions: WorkspacePermission[];
  assignedPermissions: WorkspacePermission[];
  isLoading: boolean;
  onEdit: (permission: WorkspacePermission) => void;
  onDelete: (permissionId: string) => void;
  onAttach: (permissionId: string) => void;
  isPending: boolean;
}) {
  const freePermissions = useMemo(() => {
    const assignedIds = new Set(
      assignedPermissions.map((permission) => permission.id),
    );
    return allPermissions.filter(
      (permission) => !assignedIds.has(permission.id),
    );
  }, [allPermissions, assignedPermissions]);
  const [permissionToAttach, setPermissionToAttach] = useState("");

  useEffect(() => {
    setPermissionToAttach(freePermissions[0]?.id ?? "");
  }, [freePermissions, selectedRoleId]);

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Role permissions</CardTitle>
        <CardDescription>
          Choose a role and control the permissions assigned to it.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid min-w-0 gap-5">
        <div className="grid gap-2 sm:max-w-xs">
          <Label htmlFor="permissions-role">Role</Label>
          <RoleDropdown
            roles={roles}
            value={selectedRoleId}
            onChange={onRoleChange}
            id="permissions-role"
          />
        </div>
        <div className="grid min-w-0 gap-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">Assigned permissions</p>
              <p className="text-xs text-muted-foreground">
                Permissions available to the selected role.
              </p>
            </div>
            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              {assignedPermissions.length}
            </span>
          </div>

          {isLoading ? (
            <p className="py-6 text-sm text-muted-foreground">
              Loading permissions...
            </p>
          ) : assignedPermissions.length === 0 ? (
            <p className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
              No permissions are assigned to this role.
            </p>
          ) : (
            <div className="min-w-0 divide-y rounded-lg border">
              {assignedPermissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex min-w-0 items-start gap-3 p-3"
                >
                  <KeyRound className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {permissionLabel(permission.name)}
                    </p>
                    {permission.description && (
                      <div className="mt-1 min-w-0 max-w-full overflow-hidden whitespace-pre-wrap break-words rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground [overflow-wrap:anywhere]">
                        {permission.description}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Edit permission"
                    onClick={() => onEdit(permission)}
                    disabled={isPending}
                  >
                    <Pencil />
                    <span className="sr-only">Edit permission</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    title="Delete permission"
                    onClick={() => onDelete(permission.id)}
                    disabled={isPending}
                  >
                    <Trash2 />
                    <span className="sr-only">Delete permission</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid gap-2 border-t pt-5">
          <div>
            <p className="font-medium">Free workspace permissions</p>
            <p className="text-xs text-muted-foreground">
              Assign an existing workspace permission to this role.
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <TeamSettingsDropdown
              options={freePermissions.map((permission) => ({
                value: permission.id,
                label: permissionLabel(permission.name),
              }))}
              value={permissionToAttach}
              onChange={setPermissionToAttach}
              disabled={!freePermissions.length || isPending}
              emptyLabel="All workspace permissions are assigned"
              id="free-permissions"
              aria-label="Free permissions"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => permissionToAttach && onAttach(permissionToAttach)}
              disabled={!permissionToAttach || isPending}
            >
              <Plus />
              Assign
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
