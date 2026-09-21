import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WORKSPACES_KEY, workspacesApi } from "../services/workspaces.service";
import type { CreateWorkspacePayload } from "../types/create-workspace.interface";
import type { Workspace } from "../types/workspace.interface";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspacePayload) => workspacesApi.create(data),
    onSuccess: (workspace) => {
      queryClient.setQueryData<Workspace[]>(WORKSPACES_KEY, (workspaces) => [
        ...(workspaces ?? []),
        workspace,
      ]);
    },
  });
};
