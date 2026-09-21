"use client";

import { useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import { WorkspaceDialog } from "@/common/components/workspace-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import { useActiveWorkspace } from "../hooks/active-workspace";
import { useWorkspaces } from "../hooks/use-workspaces";
import type { Workspace } from "../types/workspace.interface";

export function WorkspaceList() {
  const workspaces = useWorkspaces();
  const { activeWorkspaceId, clearWorkspace } = useActiveWorkspace();
  const [dialogMode, setDialogMode] = useState<
    "create" | "update" | "delete" | null
  >(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );

  function openWorkspaceDialog(
    mode: "create" | "update" | "delete",
    workspace: Workspace | null = null,
  ) {
    setSelectedWorkspace(workspace);
    setDialogMode(mode);
  }

  function handleDialogChange(open: boolean) {
    if (!open) {
      setDialogMode(null);
      setSelectedWorkspace(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspaces</CardTitle>
        <CardDescription>
          Create and manage the workspaces you belong to.
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            onClick={() => openWorkspaceDialog("create")}
          >
            <Plus />
            Add workspace
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {workspaces.isLoading && (
          <p className="text-sm text-muted-foreground">Loading workspaces...</p>
        )}
        {workspaces.isError && (
          <p className="text-sm text-destructive" role="alert">
            Unable to load your workspaces. Please try again.
          </p>
        )}
        {!workspaces.isLoading &&
          !workspaces.isError &&
          workspaces.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You are not a member of any workspaces yet.
            </p>
          )}
        {!!workspaces.data?.length && (
          <ul className="grid gap-2">
            {workspaces.data.map((workspace) => (
              <li
                key={workspace.id}
                className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
              >
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Building2 className="size-4" aria-hidden="true" />
                </div>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {workspace.name}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openWorkspaceDialog("update", workspace)}
                    aria-label={`Rename ${workspace.name}`}
                    title={`Rename ${workspace.name}`}
                  >
                    <Pencil aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => openWorkspaceDialog("delete", workspace)}
                    aria-label={`Delete ${workspace.name}`}
                    title={`Delete ${workspace.name}`}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <WorkspaceDialog
        mode={dialogMode ?? "create"}
        workspace={selectedWorkspace}
        open={dialogMode !== null}
        onOpenChange={handleDialogChange}
        onDeleted={(workspace) => {
          if (workspace.id === activeWorkspaceId) clearWorkspace();
        }}
      />
    </Card>
  );
}
