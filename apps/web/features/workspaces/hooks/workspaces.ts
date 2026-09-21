import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  WORKSPACES_KEY,
  workspacesApi,
  type CreateWorkspacePayload,
} from "../services/workspaces.service";
import type { Workspace } from "../types/workspace.interface";

export const useWorkspaces = () =>
  useQuery({
    queryKey: WORKSPACES_KEY,
    queryFn: workspacesApi.findAll,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

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
