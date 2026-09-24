import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/ui/dropdown-menu";
import Tag from "./tag";
import { ArrowLeft, EllipsisVertical, UserRound } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import { Marker, MarkerContent } from "#/ui/components/marker";

type ChatInterfaceHeaderProps = {
  onBack?: () => void;
  onToggleProfile?: () => void;
  profileOpen?: boolean;
};

export default function ChatInterfaceHeader({
  onBack,
  onToggleProfile,
  profileOpen = false,
}: ChatInterfaceHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-2 border-b px-3 py-3 sm:px-5">
      <Button
        aria-label="Back to conversations"
        title="Back to conversations"
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onBack}
      >
        <ArrowLeft />
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <div className="relative shrink-0">
          <Avatar className="size-10 sm:size-11">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-emerald-100 font-semibold text-emerald-700">
              MA
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold sm:text-base">
              Mohab Ali
            </p>
            <Marker role="status" className="hidden text-[11px] sm:flex">
              <MarkerContent className="text-primary font-bold animate-pulse">
                is typing...
              </MarkerContent>
            </Marker>
          </div>
          <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">Usually replies within an hour</span>
            <span className="hidden shrink-0 sm:inline">·</span>
            <span className="hidden shrink-0 sm:inline">Agent: Mohab</span>
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <Button variant="outline" size="sm">
          Assign
        </Button>
        <Tag
          className="border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
          name="Open"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="More conversation options"
            title="More conversation options"
            variant="ghost"
            size="icon-sm"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>Conversation options</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={profileOpen}
            onCheckedChange={onToggleProfile}
          >
            <UserRound />
            <span>Contact profile</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <p className="px-1.5 py-1 text-[11px] text-muted-foreground">
            Open the profile sidebar to see contact details and activity.
          </p>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
