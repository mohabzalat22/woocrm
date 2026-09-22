import { Trash2, Users } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import { Avatar, AvatarFallback } from "@repo/ui/ui/avatar";
import type {
  TeamRole,
  WorkspaceMember,
} from "@/features/team/types/team.interface";
import { EmptyState } from "./empty-state";
import { RoleDropdown } from "./role-dropdown";
import { initials } from "./team-settings-utils";

export function MembersCard({
  members,
  roles,
  isLoading,
  onUpdateRole,
  onDelete,
  isUpdating,
  isDeleting,
}: {
  members: WorkspaceMember[];
  roles: TeamRole[];
  isLoading: boolean;
  onUpdateRole: (memberId: string, roleId: string) => void;
  onDelete: (memberId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>
          Manage who can access this workspace and what they can do.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading members...
          </p>
        ) : members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members yet"
            description="Invite a member to start collaborating in this workspace."
          />
        ) : (
          <div className="divide-y rounded-lg border">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap"
              >
                <Avatar>
                  <AvatarFallback>
                    {initials(member.user.name, member.user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {member.user.name ?? member.user.email}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
                <div className="w-full sm:w-32">
                  <RoleDropdown
                    roles={roles}
                    value={member.roleId}
                    onChange={(roleId) => onUpdateRole(member.id, roleId)}
                    disabled={isUpdating}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  title={`Remove ${member.user.email}`}
                  onClick={() => onDelete(member.id)}
                  disabled={isDeleting}
                >
                  <Trash2 />
                  <span className="sr-only">Remove member</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
