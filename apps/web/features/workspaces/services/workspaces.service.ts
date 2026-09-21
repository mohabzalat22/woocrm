import { request } from "@/common/lib/api";
import type { Workspace } from "../types/workspace.interface";

export interface CreateWorkspacePayload {
  name: string;
}

export const WORKSPACES_KEY = ["workspaces"] as const;

export const workspacesApi = {
  findAll: (): Promise<Workspace[]> => request("workspaces", { method: "GET" }),

  create: (data: CreateWorkspacePayload): Promise<Workspace> =>
    request("workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
