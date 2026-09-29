import { Mail } from "lucide-react";
import { Button } from "#/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/ui/components/card";

export function InvitationsCard({
  onInvite,
  disabled,
}: {
  onInvite: () => void;
  disabled: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
        <CardDescription>
          Create an invitation for a registered user and assign their role
          before they join.
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            onClick={onInvite}
            disabled={disabled}
          >
            <Mail />
            Invite member
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 rounded-lg border border-dashed p-4">
          <Mail className="size-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Invitations are created with a role and can be accepted by the
            matching email address.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
