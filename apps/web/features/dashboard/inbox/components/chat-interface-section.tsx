"use client";

import { useEffect } from "react";
import { cn } from "@/common/lib/utils";
import { useMe } from "@/features/auth/hooks/me";
import { useInboxActions } from "../hooks/use-inbox-actions";
import { useInboxData } from "../hooks/use-inbox-data";
import { useInboxStore } from "../store";
import ChatInterfaceHeader from "./chat-interface-header";
import ChatInterfaceInputSection from "./chat-interface-input-section";
import ChatInterfaceMessagesSection from "./chat-interface-messages-section";

export default function ChatInterfaceSection({
  className,
}: {
  className?: string;
}) {
  const { conversation: conversationQuery } = useInboxData();
  const conversation = conversationQuery.data ?? null;
  const { data: currentUser } = useMe();
  const selectedConversationId = useInboxStore(
    (state) => state.selectedConversationId,
  );
  const { read } = useInboxActions();
  const { isPending: isReadPending, mutate: markAsRead } = read;
  const isAssignedUser = conversation?.assignedTo?.userId === currentUser?.id;

  useEffect(() => {
    if (
      conversation?.unread &&
      isAssignedUser &&
      selectedConversationId &&
      !isReadPending
    ) {
      markAsRead(selectedConversationId);
    }
  }, [
    conversation?.unread,
    isAssignedUser,
    isReadPending,
    markAsRead,
    selectedConversationId,
  ]);

  if (!conversation) {
    return (
      <section
        className={cn(
          "min-h-0 min-w-0 flex-1 items-center justify-center bg-muted/20",
          className,
        )}
      >
        <div className="text-center">
          <p className="font-medium">Select a conversation</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a customer from your inbox to view the thread.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn("min-h-0 min-w-0 flex-1 flex-col bg-background", className)}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatInterfaceHeader />
        <ChatInterfaceMessagesSection />
      </div>
      <ChatInterfaceInputSection />
    </section>
  );
}
