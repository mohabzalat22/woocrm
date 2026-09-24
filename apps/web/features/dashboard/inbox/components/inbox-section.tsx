"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/ui/tabs";
import { Avatar, AvatarBadge, AvatarFallback } from "@repo/ui/ui/avatar";
import { Button } from "@repo/ui/ui/button";
import { cn } from "@/common/lib/utils";
import Tag from "./tag";

type InboxSectionProps = {
  className?: string;
  onOpenConversation?: () => void;
};

const tabs = ["All", "Unread", "Open", "Resolved"];

const conversations = [
  {
    id: "mohab",
    name: "Mohab Ali",
    initials: "MA",
    message: "It’s always a one-line change 😭.",
    time: "2m",
    unread: 3,
    tag: "LEAD",
    tagClassName: "bg-red-100 text-red-700",
    online: true,
    avatarClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "sarah",
    name: "Sarah Johnson",
    initials: "SJ",
    message: "Thanks, that works perfectly for us.",
    time: "18m",
    unread: 0,
    tag: "CUSTOMER",
    tagClassName: "bg-blue-100 text-blue-700",
    online: true,
    avatarClassName: "bg-blue-100 text-blue-700",
  },
  {
    id: "omar",
    name: "Omar Khaled",
    initials: "OK",
    message: "Could you send over the updated quote?",
    time: "1h",
    unread: 1,
    tag: "FOLLOW UP",
    tagClassName: "bg-amber-100 text-amber-700",
    online: false,
    avatarClassName: "bg-amber-100 text-amber-700",
  },
  {
    id: "nour",
    name: "Nour Hassan",
    initials: "NH",
    message: "I’ll check with the team and get back to you.",
    time: "3h",
    unread: 0,
    tag: "OPEN",
    tagClassName: "bg-violet-100 text-violet-700",
    online: false,
    avatarClassName: "bg-violet-100 text-violet-700",
  },
  {
    id: "alex",
    name: "Alex Morgan",
    initials: "AM",
    message: "Conversation resolved",
    time: "Yesterday",
    unread: 0,
    tag: "RESOLVED",
    tagClassName: "bg-slate-100 text-slate-600",
    online: false,
    avatarClassName: "bg-slate-100 text-slate-700",
  },
];

export default function InboxSection({
  className,
  onOpenConversation,
}: InboxSectionProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("mohab");

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Unread" && conversation.unread > 0) ||
      (activeTab === "Open" && conversation.tag !== "RESOLVED") ||
      (activeTab === "Resolved" && conversation.tag === "RESOLVED");

    return matchesSearch && matchesTab;
  });

  return (
    <aside
      className={cn(
        "min-h-0 w-full shrink-0 flex-col border-e bg-background md:w-[22rem] lg:w-[21rem]",
        className,
      )}
    >
      <div className="shrink-0 border-b px-4 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">Inbox</h1>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                12
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep every customer conversation moving.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              aria-label="Filter conversations"
              title="Filter conversations"
              variant="ghost"
              size="icon-sm"
            >
              <SlidersHorizontal />
            </Button>
            <Button
              aria-label="Start a new conversation"
              title="Start a new conversation"
              size="icon-sm"
            >
              <Plus />
            </Button>
          </div>
        </div>

        <InputGroup className="mt-4 h-10 bg-muted/40">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search conversations"
            placeholder="Search conversations"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <span className="text-[11px]">
              {filteredConversations.length} results
            </span>
          </InputGroupAddon>
        </InputGroup>

        <Tabs
          className="mt-4 w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full gap-1 overflow-x-auto bg-muted/70 p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  "flex-none px-2 text-xs data-active:bg-background data-active:text-primary data-active:shadow-sm",
                  tab == activeTab && "bg-primary",
                )}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent conversations
          </p>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="More inbox options"
          >
            <MoreHorizontal />
          </Button>
        </div>

        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {filteredConversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(conversation.id);
                  onOpenConversation?.();
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/70",
                  selectedId === conversation.id && "bg-muted",
                )}
              >
                <Avatar className="size-10">
                  <AvatarFallback className={conversation.avatarClassName}>
                    {conversation.initials}
                  </AvatarFallback>
                  {conversation.online && (
                    <AvatarBadge className="bg-emerald-500" />
                  )}
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">
                      {conversation.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {conversation.time}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {conversation.message}
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-2">
                    <Tag
                      className={cn(
                        "px-2 py-1 text-[10px] font-semibold tracking-wide",
                        conversation.tagClassName,
                      )}
                      name={conversation.tag}
                    />
                    {conversation.unread > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {conversation.unread}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {filteredConversations.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              No conversations found.
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}
