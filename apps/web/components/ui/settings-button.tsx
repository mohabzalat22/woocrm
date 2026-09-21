import { Button } from "@repo/ui/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/ui/avatar";
import { Settings } from "lucide-react";
import { useMe } from "@/features/auth/hooks/me";
import Link from "next/link";

export default function SettingsButton() {
  const me = useMe();
  const name = me.data?.name;
  const systemRole = me.data?.systemRole;

  return (
    <Button
      asChild
      variant="ghost"
      className="h-auto w-full justify-between gap-3 px-2 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2"
    >
      <Link href="/settings" title="Settings">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 text-start group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            {systemRole}
          </p>
        </div>
        <Settings className="size-4 shrink-0 text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden" />
      </Link>
    </Button>
  );
}
