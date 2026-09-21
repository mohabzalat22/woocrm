"use client";

import { Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import { useWorkspaces } from "../hooks/workspaces";

export function WorkspaceList() {
  const workspaces = useWorkspaces();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspaces</CardTitle>
        <CardDescription>
          Workspaces you belong to are listed here.
        </CardDescription>
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
                <span className="font-medium">{workspace.name}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
