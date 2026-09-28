"use client";

import { useState } from "react";
import { ArrowLeft, Check, EllipsisVertical, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "#/ui/components/avatar";
import { Button } from "@repo/ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/ui/dropdown-menu";
import { ConfirmationDialog } from "@/common/components/confirmation-dialog";
import { useMe } from "@/features/auth/hooks/me";
import { useInboxActions } from "../hooks/use-inbox-actions";
import { useInboxData } from "../hooks/use-inbox-data";
import { useInboxStore } from "../store";
import { getContactName, getInitials } from "../utils/inbox-formatters";

export default function ChatInterfaceHeader() {
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const { data: currentUser } = useMe();
  const { conversation: conversationQuery, members } = useInboxData();
  const conversation = conversationQuery.data ?? null;
  const profileOpen = useInboxStore((state) => state.profileOpen);
  const setMobileView = useInboxStore((state) => state.setMobileView);
  const toggleProfile = useInboxStore((state) => state.toggleProfile);
  const { assign, resolve } = useInboxActions();

  if (!conversation) return null;

  const currentMember = members.data?.find(
    (member) => member.userId === currentUser?.id,
  );
  const memberList = members.data ?? [];
  const canAssign =
    currentMember?.role.name === "ADMIN" ||
    currentMember?.role.name === "MANAGER";
  const contactName = getContactName(conversation.contact);
  const assigneeName = conversation.assignedTo?.name ?? "Unassigned";
  const actionError = assign.error?.message ?? resolve.error?.message;

  return (
    <>
      <header className="flex shrink-0 items-center gap-2 border-b bg-background px-3 py-3 sm:px-5">
        <Button
          aria-label="Back to conversations"
          title="Back to conversations"
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileView("inbox")}
        >
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <Avatar className="size-10 shrink-0 sm:size-11">
            <AvatarFallback className="bg-emerald-100 font-semibold text-emerald-700">
              {getInitials(contactName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold sm:text-base">
              {contactName}
            </p>
            <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">Usually replies within an hour</span>
              <span className="hidden shrink-0 sm:inline">·</span>
              <span className="hidden max-w-32 shrink-0 truncate sm:inline">
                Agent: {assigneeName}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={!canAssign || assign.isPending}
              >
                {assign.isPending ? "Assigning…" : "Assign"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-80 w-64 overflow-y-auto"
            >
              <DropdownMenuLabel>Assign conversation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {memberList.length === 0 ? (
                <p className="px-2 py-3 text-xs text-muted-foreground">
                  No eligible members found.
                </p>
              ) : (
                memberList.map((member) => {
                  const memberName = member.user.name ?? member.user.email;
                  const isSelected = member.id === conversation.assignedToId;

                  return (
                    <DropdownMenuItem
                      key={member.id}
                      onSelect={() =>
                        assign.mutate({
                          conversationId: conversation.id,
                          memberId: member.id,
                        })
                      }
                      className="min-w-0"
                    >
                      <Avatar className="size-7">
                        <AvatarFallback className="text-[10px]">
                          {getInitials(memberName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1 truncate">
                        {memberName}
                      </span>
                      {isSelected && (
                        <Check className="size-4 text-emerald-600" />
                      )}
                    </DropdownMenuItem>
                  );
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant={
              conversation.status === "RESOLVED" ? "secondary" : "outline"
            }
            size="sm"
            disabled={conversation.status === "RESOLVED" || resolve.isPending}
            onClick={() => setResolveDialogOpen(true)}
          >
            {resolve.isPending
              ? "Resolving…"
              : conversation.status === "RESOLVED"
                ? "Resolved"
                : "Open"}
          </Button>
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
            <DropdownMenuItem onSelect={toggleProfile}>
              <UserRound />
              <span>
                {profileOpen ? "Hide contact profile" : "Contact profile"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      {actionError && (
        <p
          role="alert"
          className="border-b bg-destructive/10 px-4 py-2 text-xs text-destructive"
        >
          {actionError}
        </p>
      )}
      <ConfirmationDialog
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        title="Resolve conversation?"
        description="This conversation will remain available in Resolved and can still receive new messages."
        confirmLabel="Resolve"
        pendingLabel="Resolving…"
        isPending={resolve.isPending}
        onConfirm={() => {
          resolve.mutate(conversation.id);
          setResolveDialogOpen(false);
        }}
      />
    </>
  );
}
