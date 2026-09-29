"use client";

import { useEffect, useMemo } from "react";
import { Loader2, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/ui/tabs";
import { cn } from "@/common/lib/utils";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useInboxData } from "../hooks/use-inbox-data";
import { useInboxStore, type InboxTab } from "../store";
import ConversationRow from "./conversation-row";
import InboxEmptyState from "./inbox-empty-state";

const tabs: Array<{ value: InboxTab; label: string }> = [
  { value: "unread", label: "Unread" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
];

export default function InboxSection({ className }: { className?: string }) {
  const { conversations } = useInboxData();
  const activeTab = useInboxStore((state) => state.activeTab);
  const selectedConversationId = useInboxStore(
    (state) => state.selectedConversationId,
  );
  const search = useInboxStore((state) => state.search);
  const setActiveTab = useInboxStore((state) => state.setActiveTab);
  const selectConversation = useInboxStore((state) => state.selectConversation);
  const setMobileView = useInboxStore((state) => state.setMobileView);
  const setSearch = useInboxStore((state) => state.setSearch);
  const debouncedSearch = useDebouncedValue(search);
  const conversationList = useMemo(
    () => conversations.data?.pages.flatMap((page) => page.data) ?? [],
    [conversations.data],
  );
  const filteredConversations = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();
    if (!normalizedSearch) return conversationList;
    return conversationList.filter((conversation) =>
      conversation.contact.name.toLowerCase().includes(normalizedSearch),
    );
  }, [conversationList, debouncedSearch]);
  const isSearchPending = search !== debouncedSearch;
  const isEmpty =
    !conversations.isLoading && filteredConversations.length === 0;

  useEffect(() => {
    if (!selectedConversationId && conversationList[0]) {
      selectConversation(conversationList[0].id);
    }
  }, [conversationList, selectConversation, selectedConversationId]);

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
                {debouncedSearch
                  ? filteredConversations.length
                  : (conversations.data?.pages[0]?.meta.total ?? 0)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep every customer conversation moving.
            </p>
          </div>
          <div className="flex items-center gap-1">
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
            aria-label="Search conversations by contact name"
            placeholder="Search contact names"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <span className="text-[11px]">
              {isSearchPending
                ? "Searching…"
                : `${filteredConversations.length} shown`}
            </span>
          </InputGroupAddon>
        </InputGroup>

        <Tabs
          className="mt-4 w-full"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as InboxTab)}
        >
          <TabsList className="w-full gap-1 overflow-x-auto bg-muted/70 p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "px-2 text-xs",
                  activeTab === tab.value &&
                    "!bg-primary !text-primary-foreground",
                )}
              >
                {tab.label}
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
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          {conversations.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : isEmpty ? (
            <InboxEmptyState searching={Boolean(debouncedSearch)} />
          ) : (
            <ul className="space-y-1">
              {filteredConversations.map((conversation) => (
                <li key={conversation.id}>
                  <ConversationRow
                    conversation={conversation}
                    selected={selectedConversationId === conversation.id}
                    onSelect={() => {
                      selectConversation(conversation.id);
                      setMobileView("conversation");
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
          {conversations.hasNextPage && !debouncedSearch && (
            <Button
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => void conversations.fetchNextPage()}
              disabled={conversations.isFetchingNextPage}
            >
              {conversations.isFetchingNextPage ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Load more"
              )}
            </Button>
          )}
          {!conversations.hasNextPage && conversationList.length > 0 && (
            <p className="py-3 text-center text-[11px] text-muted-foreground">
              You’re all caught up
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
