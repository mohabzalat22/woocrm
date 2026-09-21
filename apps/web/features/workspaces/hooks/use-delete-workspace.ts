import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WORKSPACES_KEY, workspacesApi } from "../services/workspaces.service";
import type { Workspace } from "../types/workspace.interface";

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => workspacesApi.delete(workspaceId),
    onSuccess: (workspace) => {
      queryClient.setQueryData<Workspace[]>(WORKSPACES_KEY, (workspaces) =>
        workspaces?.filter((item) => item.id !== workspace.id),
      );
    },
  });
};
