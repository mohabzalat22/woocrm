"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@repo/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { Eye, EyeOff, LogOut } from "lucide-react";
import { useLogout } from "../auth/hooks/logout";
import { useMe, useUpdateMe } from "../auth/hooks/me";
import { UpdateMeSchema } from "../auth/schemas";
import { WorkspaceList } from "../workspaces/components/workspace-list";

const getInitials = (name: string | null | undefined) => {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export function UserSettingsForm() {
  const me = useMe();
  const updateMe = useUpdateMe();
  const logout = useLogout();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!me.data) return;

    setName(me.data.name ?? "");
    setEmail(me.data.email);
  }, [me.data]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const validation = UpdateMeSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ?? "Invalid account details",
      );
      return;
    }

    const payload = {
      name: validation.data.name,
      email: validation.data.email,
      ...(validation.data.password
        ? { password: validation.data.password }
        : {}),
    };

    try {
      await updateMe.mutateAsync(payload);
      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update your account. Please try again.",
      );
    }
  }

  if (me.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading settings...</p>;
  }

  if (me.isError || !me.data) {
    return (
      <p className="text-sm text-destructive" role="alert">
        Unable to load your account settings.
      </p>
    );
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update the personal information connected to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="user-settings-form" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {getInitials(me.data.name)}
                </div>
                <div>
                  <p className="font-medium">
                    {me.data.name || "Your profile"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {me.data.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="settings-name">Full name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="settings-password">New password</Label>
                <div className="relative">
                  <Input
                    id="settings-password"
                    type={showPassword ? "text" : "password"}
                    className="pr-16"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    placeholder="Leave blank to keep your current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <Eye className="size-5" aria-hidden="true" />
                    ) : (
                      <EyeOff className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="settings-confirm-password">
                  Confirm new password
                </Label>
                <div className="relative">
                  <Input
                    id="settings-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-16"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <Eye className="size-5" aria-hidden="true" />
                    ) : (
                      <EyeOff className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-4 text-sm text-green-600" role="status">
                Your account details were updated.
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            form="user-settings-form"
            type="submit"
            disabled={updateMe.isPending}
          >
            {updateMe.isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Information managed by your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">System role</p>
            <p className="mt-1 font-medium">{me.data.systemRole}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">User ID</p>
            <p className="mt-1 truncate font-mono text-xs">{me.data.id}</p>
          </div>
        </CardContent>
      </Card>

      <WorkspaceList />

      <Card size="sm">
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>
            Sign out of this account on the current device.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-3">
          <Button
            type="button"
            variant="destructive"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut />
            {logout.isPending ? "Logging out..." : "Log out"}
          </Button>
          {logout.isError && (
            <p className="text-sm text-destructive" role="alert">
              Unable to log out. Please try again.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
