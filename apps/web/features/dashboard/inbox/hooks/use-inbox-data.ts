"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useActiveWorkspace } from "@/features/workspaces/hooks/active-workspace";
import { inboxApi, inboxKeys } from "../services/inbox.service";
import { useInboxStore } from "../store";

export function useInboxData() {
  const { activeWorkspaceId: workspaceId } = useActiveWorkspace();
  const tab = useInboxStore((state) => state.activeTab);
  const conversationId = useInboxStore((state) => state.selectedConversationId);
  const id = workspaceId as string;

  const conversations = useInfiniteQuery({
    queryKey: inboxKeys.conversations(id, tab),
    queryFn: ({ pageParam }) =>
      inboxApi.list(id, { tab, page: pageParam, limit: 25 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    enabled: Boolean(workspaceId),
    staleTime: 15_000,
  });

  const conversation = useQuery({
    queryKey: inboxKeys.conversation(id, conversationId ?? ""),
    queryFn: () => inboxApi.get(id, conversationId ?? ""),
    enabled: Boolean(workspaceId && conversationId),
    staleTime: 10_000,
  });

  // TODO: maybe isolate this function it doesnot make since to be in the same workspace
  const members = useQuery({
    queryKey: inboxKeys.members(id),
    queryFn: () => inboxApi.members(id),
    enabled: Boolean(workspaceId),
    retry: false,
    staleTime: 60_000,
  });

  const getLastNote = useQuery({
    queryKey: inboxKeys.lastNote(id, conversationId ?? ""),
    queryFn: () => inboxApi.getLastNote(id, conversationId ?? ""),
    enabled: Boolean(workspaceId && conversationId),
    staleTime: 10_000,
  });

  return { conversations, conversation, members, getLastNote };
}
