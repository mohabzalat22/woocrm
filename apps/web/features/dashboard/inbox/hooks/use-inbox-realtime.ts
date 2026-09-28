"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveWorkspace } from "@/features/workspaces/hooks/active-workspace";
import { inboxKeys } from "../services/inbox.service";
import { useInboxStore } from "../store";

export function useInboxRealtime() {
  const { activeWorkspaceId: workspaceId } = useActiveWorkspace();
  const conversationId = useInboxStore(
    (state) => state.selectedConversationId,
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const eventSource = new EventSource(
      apiUrl + "workspaces/" + workspaceId + "/inbox/events",
      { withCredentials: true },
    );

    const eventTypes = [
      "message.created",
      "message.status.updated",
      "conversation.updated",
    ];

    const refreshQueries = () => {
      void queryClient.invalidateQueries({
        queryKey: inboxKeys.all(workspaceId),
      });
      if (conversationId) {
        void queryClient.invalidateQueries({
          queryKey: inboxKeys.conversation(workspaceId, conversationId),
        });
      }
    };

    eventTypes.forEach((eventType) =>
      eventSource.addEventListener(eventType, refreshQueries),
    );

    return () => {
      eventTypes.forEach((eventType) =>
        eventSource.removeEventListener(eventType, refreshQueries),
      );
      eventSource.close();
    };
  }, [conversationId, queryClient, workspaceId]);
}
