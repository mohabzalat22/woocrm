import type { StateCreator } from "zustand";
import type { InboxStore } from "../store.types";

export type PendingInboxMessage = {
  conversationId: string;
  content: string;
};

export type InboxActionSlice = {
  pendingMessage: PendingInboxMessage | null;
  retryingMessageId: string | null;
  setPendingMessage: (pendingMessage: PendingInboxMessage | null) => void;
  setRetryingMessageId: (messageId: string | null) => void;
};

export const createInboxActionSlice: StateCreator<
  InboxStore,
  [],
  [],
  InboxActionSlice
> = (set) => ({
  pendingMessage: null,
  retryingMessageId: null,
  setPendingMessage: (pendingMessage) => set({ pendingMessage }),
  setRetryingMessageId: (retryingMessageId) => set({ retryingMessageId }),
});
