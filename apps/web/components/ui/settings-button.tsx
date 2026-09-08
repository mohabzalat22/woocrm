import { Button } from "@repo/ui/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/ui/avatar";
import { Settings } from "lucide-react";

export default function SettingsButton() {
  return (
    <Button
      variant="ghost"
      className="h-auto w-full justify-between gap-3 px-2 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2"
    >
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 text-start group-data-[collapsible=icon]:hidden">
        <p className="truncate text-sm font-medium">Mohab ali</p>
        <p className="truncate text-xs text-sidebar-foreground/70">admin</p>
      </div>
      <Settings className="size-4 shrink-0 text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden" />
    </Button>
  );
}
