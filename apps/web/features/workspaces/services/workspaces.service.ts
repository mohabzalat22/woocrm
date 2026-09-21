import { request } from "@/common/lib/api";
import type { Workspace } from "../types/workspace.interface";
import type { CreateWorkspacePayload } from "../types/create-workspace.interface";
import type { UpdateWorkspacePayload } from "../types/update-workspace.interface";

export const WORKSPACES_KEY = ["workspaces"] as const;

export const workspacesApi = {
  findAll: (): Promise<Workspace[]> => request("workspaces", { method: "GET" }),

  create: (data: CreateWorkspacePayload): Promise<Workspace> =>
    request("workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    workspaceId: string,
    data: UpdateWorkspacePayload,
  ): Promise<Workspace> =>
    request(`workspaces/${workspaceId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (workspaceId: string): Promise<Workspace> =>
    request(`workspaces/${workspaceId}`, { method: "DELETE" }),
};
