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
import { Textarea } from "@repo/ui/ui/textarea";
import type { WorkspacePermission } from "@/features/team/types/team.interface";
import { errorMessage } from "./team-settings-utils";

export function PermissionDialog({
  open,
  onOpenChange,
  permission,
  onSave,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: WorkspacePermission;
  onSave: (data: { description: string | null }) => Promise<unknown>;
  isPending: boolean;
}) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setDescription(permission.description ?? "");
    setError(null);
  }, [open, permission]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onSave({
        description: description.trim() || null,
      });
      onOpenChange(false);
    } catch (saveError) {
      setError(errorMessage(saveError, "Unable to save the permission."));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit permission</DialogTitle>
            <DialogDescription>
              Update the description. Permission names cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="permission-name">Name</Label>
              <Input id="permission-name" value={permission.name} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permission-description">
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="permission-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Export contacts from the workspace"
                rows={4}
              />
            </div>
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save permission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
