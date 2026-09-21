import type { StateCreator } from "zustand";

export const ACTIVE_WORKSPACE_STORAGE_KEY = "workspace-id";

export type WorkspaceSlice = {
  activeWorkspaceId: string | null;
  hydrateWorkspace: () => void; // reflects from local storage to ui
  selectWorkspace: (workspaceId: string) => void;
  clearWorkspace: () => void;
};

const getStoredWorkspaceId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_WORKSPACE_STORAGE_KEY);
};

export const createWorkspaceSlice: StateCreator<
  WorkspaceSlice,
  [],
  [],
  WorkspaceSlice
> = (set) => ({
  activeWorkspaceId: null,

  hydrateWorkspace: () => {
    set({ activeWorkspaceId: getStoredWorkspaceId() });
  },

  selectWorkspace: (workspaceId) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, workspaceId);
    }

    set({ activeWorkspaceId: workspaceId });
  },

  clearWorkspace: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACTIVE_WORKSPACE_STORAGE_KEY);
    }

    set({ activeWorkspaceId: null });
  },
});
