import { useQuery } from "@tanstack/react-query";
import { WORKSPACES_KEY, workspacesApi } from "../services/workspaces.service";

export const useWorkspaces = () =>
  useQuery({
    queryKey: WORKSPACES_KEY,
    queryFn: workspacesApi.findAll,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
