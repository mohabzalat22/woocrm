import { create } from "zustand";
import {
  createWorkspaceSlice,
  type WorkspaceSlice,
} from "./slices/workspace-slice";

export type WorkspaceStore = WorkspaceSlice;

export const useWorkspaceStore = create<WorkspaceStore>()((...args) => ({
  ...createWorkspaceSlice(...args),
}));
