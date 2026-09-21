"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@repo/ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/ui/dialog";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { useCreateWorkspace } from "@/features/workspaces/hooks/use-create-workspace";
import { useDeleteWorkspace } from "@/features/workspaces/hooks/use-delete-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/hooks/use-update-workspace";
import {
  CreateWorkspaceSchema,
  UpdateWorkspaceSchema,
} from "@/features/workspaces/schemas";
import type { Workspace } from "@/features/workspaces/types/workspace.interface";

export type WorkspaceDialogMode = "create" | "update" | "delete";

interface WorkspaceDialogProps {
  mode: WorkspaceDialogMode;
  workspace?: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: (workspace: Workspace) => void;
}

export function WorkspaceDialog({
  mode,
  workspace,
  open,
  onOpenChange,
  onDeleted,
}: WorkspaceDialogProps) {
  const {
    isPending: isCreatePending,
    mutateAsync: createWorkspace,
    reset: resetCreateWorkspace,
  } = useCreateWorkspace();
  const {
    isPending: isUpdatePending,
    mutateAsync: updateWorkspace,
    reset: resetUpdateWorkspace,
  } = useUpdateWorkspace();
  const {
    isPending: isDeletePending,
    mutateAsync: deleteWorkspace,
    reset: resetDeleteWorkspace,
  } = useDeleteWorkspace();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isPending = isCreatePending || isUpdatePending || isDeletePending;

  useEffect(() => {
    if (!open) return;

    setName(mode === "update" ? (workspace?.name ?? "") : "");
    setError(null);
    resetCreateWorkspace();
    resetUpdateWorkspace();
    resetDeleteWorkspace();
  }, [
    resetCreateWorkspace,
    resetDeleteWorkspace,
    mode,
    open,
    resetUpdateWorkspace,
    workspace?.id,
    workspace?.name,
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "delete") {
      if (!workspace) return;

      setError(null);

      try {
        await deleteWorkspace(workspace.id);
        onDeleted?.(workspace);
        onOpenChange(false);
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Unable to delete the workspace. Please try again.",
        );
      }

      return;
    }

    const schema =
      mode === "create" ? CreateWorkspaceSchema : UpdateWorkspaceSchema;
    const validation = schema.safeParse({ name });

    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ?? "Invalid workspace name.",
      );
      return;
    }

    setError(null);

    try {
      if (mode === "create") {
        await createWorkspace(validation.data);
      } else {
        if (!workspace) return;

        await updateWorkspace({
          workspaceId: workspace.id,
          data: validation.data,
        });
      }

      onOpenChange(false);
    } catch (workspaceError) {
      setError(
        workspaceError instanceof Error
          ? workspaceError.message
          : `Unable to ${mode} the workspace. Please try again.`,
      );
    }
  }

  const isDelete = mode === "delete";
  const isUpdate = mode === "update";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isDelete
                ? "Delete workspace?"
                : isUpdate
                  ? "Rename workspace"
                  : "Create workspace"}
            </DialogTitle>
            <DialogDescription>
              {isDelete
                ? `This will permanently delete ${workspace?.name ?? "this workspace"} and its data. This action cannot be undone.`
                : isUpdate
                  ? "Update the name of this workspace."
                  : "Give your new workspace a name. You will be added as its admin."}
            </DialogDescription>
          </DialogHeader>

          {!isDelete && (
            <div className="mt-4 grid gap-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input
                id="workspace-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Acme Inc"
                autoFocus
                required
              />
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isDelete ? "destructive" : "default"}
              disabled={isPending || (isDelete && !workspace)}
            >
              {isPending
                ? isDelete
                  ? "Deleting..."
                  : isUpdate
                    ? "Saving..."
                    : "Creating..."
                : isDelete
                  ? "Delete workspace"
                  : isUpdate
                    ? "Save changes"
                    : "Create workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
