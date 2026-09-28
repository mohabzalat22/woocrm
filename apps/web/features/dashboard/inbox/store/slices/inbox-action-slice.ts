import type { StateCreator } from "zustand";
import type { InboxStore } from "../store.types";

export type InboxActionSlice = {
  pendingContent: string | null;
  retryingMessageId: string | null;
  setPendingContent: (content: string | null) => void;
  setRetryingMessageId: (messageId: string | null) => void;
};

export const createInboxActionSlice: StateCreator<
  InboxStore,
  [],
  [],
  InboxActionSlice
> = (set) => ({
  pendingContent: null,
  retryingMessageId: null,
  setPendingContent: (pendingContent) => set({ pendingContent }),
  setRetryingMessageId: (retryingMessageId) => set({ retryingMessageId }),
});
