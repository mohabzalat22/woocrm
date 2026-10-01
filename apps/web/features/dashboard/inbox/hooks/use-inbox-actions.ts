"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveWorkspace } from "@/features/workspaces/hooks/active-workspace";
import { inboxApi, inboxKeys } from "../services/inbox.service";
import { useInboxStore } from "../store";

export function useInboxActions() {
  const { activeWorkspaceId: workspaceId } = useActiveWorkspace();
  const setPendingContent = useInboxStore((state) => state.setPendingContent);
  const setRetryingMessageId = useInboxStore(
    (state) => state.setRetryingMessageId,
  );
  const queryClient = useQueryClient();
  const id = workspaceId ?? "";

  const refreshInbox = () =>
    queryClient.invalidateQueries({ queryKey: inboxKeys.all(id) });

  const assign = useMutation({
    mutationFn: ({
      conversationId,
      memberId,
    }: {
      conversationId: string;
      memberId: string | null;
    }) => inboxApi.assign(id, conversationId, memberId),
    onSuccess: refreshInbox,
  });

  const resolve = useMutation({
    mutationFn: (conversationId: string) =>
      inboxApi.resolve(id, conversationId),
    onSuccess: refreshInbox,
  });

  const read = useMutation({
    mutationFn: (conversationId: string) => inboxApi.read(id, conversationId),
    onSuccess: refreshInbox,
  });

  const send = useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => inboxApi.send(id, conversationId, content),
    onMutate: ({ content }) => setPendingContent(content),
    onSuccess: refreshInbox,
    onSettled: () => setPendingContent(null),
  });

  const retry = useMutation({
    mutationFn: ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }) => inboxApi.retry(id, conversationId, messageId),
    onMutate: ({ messageId }) => setRetryingMessageId(messageId),
    onSuccess: refreshInbox,
    onSettled: () => {
      setRetryingMessageId(null);
      return refreshInbox();
    },
  });

  const createNote = useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => inboxApi.createNote(id, conversationId, content),

    onMutate: ({ content, conversationId }) => {
      setPendingContent(content);
      // Invalidate the lastNote query for this conversation
      queryClient.invalidateQueries({
        queryKey: inboxKeys.lastNote(id, conversationId),
      });
    },
    onSuccess: refreshInbox,
    onSettled: () => setPendingContent(null),
  });

  return { assign, resolve, read, send, retry, createNote };
}
