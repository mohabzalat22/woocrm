import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WORKSPACES_KEY, workspacesApi } from "../services/workspaces.service";
import type { UpdateWorkspacePayload } from "../types/update-workspace.interface";
import type { Workspace } from "../types/workspace.interface";

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: UpdateWorkspacePayload;
    }) => workspacesApi.update(workspaceId, data),
    onSuccess: (workspace) => {
      queryClient.setQueryData<Workspace[]>(WORKSPACES_KEY, (workspaces) =>
        workspaces?.map((item) =>
          item.id === workspace.id ? workspace : item,
        ),
      );
    },
  });
};
