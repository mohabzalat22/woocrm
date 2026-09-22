"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Copy, Mail } from "lucide-react";
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
import type { TeamRole } from "@/features/team/types/team.interface";
import { RoleDropdown } from "./role-dropdown";
import { errorMessage } from "./team-settings-utils";

export function InvitationDialog({
  open,
  onOpenChange,
  roles,
  onCreate,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: TeamRole[];
  onCreate: (data: { email: string; roleId: string }) => Promise<unknown>;
  isPending: boolean;
}) {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setEmail("");
    setRoleId(roles[0]?.id ?? "");
    setToken(null);
    setError(null);
  }, [open, roles]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const invitation = (await onCreate({ email, roleId })) as {
        token: string;
      };
      setToken(invitation.token);
    } catch (createError) {
      setError(errorMessage(createError, "Unable to create the invitation."));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>
              The user must already have an account. Their invitation will use
              the selected role.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="invitation-email">User email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" />
                <Input
                  id="invitation-email"
                  className="pl-8"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="person@example.com"
                  autoFocus
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invitation-role">Workspace role</Label>
              <RoleDropdown
                roles={roles}
                value={roleId}
                onChange={setRoleId}
                id="invitation-role"
              />
            </div>
            {token && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-sm font-medium">Invitation created</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share this token with the invited user so they can accept it.
                </p>
                <div className="mt-2 flex gap-2">
                  <Input value={token} readOnly aria-label="Invitation token" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Copy invitation token"
                    onClick={() => void navigator.clipboard?.writeText(token)}
                  >
                    <Copy />
                    <span className="sr-only">Copy token</span>
                  </Button>
                </div>
              </div>
            )}
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
              Close
            </Button>
            <Button type="submit" disabled={isPending || !roleId}>
              {isPending ? "Creating..." : "Create invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
