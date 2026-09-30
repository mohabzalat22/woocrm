import type { StateCreator } from "zustand";
import type { InboxStore } from "../store.types";

export type InboxTab = "unread" | "open" | "resolved";
export type MobileView = "inbox" | "conversation" | "profile";

export type InboxUiSlice = {
  activeTab: InboxTab;
  selectedConversationId: string | null;
  mobileView: MobileView;
  profileOpen: boolean;
  contactProfileDirty: boolean;
  search: string;
  setActiveTab: (tab: InboxTab) => void;
  selectConversation: (conversationId: string | null) => void;
  setMobileView: (view: MobileView) => void;
  openProfile: () => void;
  closeProfile: () => void;
  toggleProfile: () => void;
  setContactProfileDirty: (dirty: boolean) => void;
  setSearch: (search: string) => void;
};

export const createInboxUiSlice: StateCreator<
  InboxStore,
  [],
  [],
  InboxUiSlice
> = (set) => ({
  activeTab: "open",
  selectedConversationId: null,
  mobileView: "inbox",
  profileOpen: false,
  contactProfileDirty: false,
  search: "",

  setActiveTab: (activeTab) =>
    set({ activeTab, selectedConversationId: null }),

  selectConversation: (selectedConversationId) =>
    set({ selectedConversationId }),

  setMobileView: (mobileView) => set({ mobileView }),

  openProfile: () => set({ profileOpen: true, mobileView: "profile" }),

  closeProfile: () => set({ profileOpen: false, mobileView: "conversation" }),

  toggleProfile: () =>
    set((state) => ({
      profileOpen: !state.profileOpen,
      mobileView: state.profileOpen ? "conversation" : "profile",
    })),

  setContactProfileDirty: (contactProfileDirty) => set({ contactProfileDirty }),

  setSearch: (search) => set({ search }),
});
