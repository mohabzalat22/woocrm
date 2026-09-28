import { create } from "zustand";
import {
  createInboxActionSlice,
  type InboxActionSlice,
} from "./slices/inbox-action-slice";
import { createInboxUiSlice, type InboxUiSlice } from "./slices/inbox-ui-slice";

export type { InboxTab, MobileView } from "./slices/inbox-ui-slice";
export type InboxStore = InboxUiSlice & InboxActionSlice;

export const useInboxStore = create<InboxStore>()((...args) => ({
  ...createInboxUiSlice(...args),
  ...createInboxActionSlice(...args),
}));
