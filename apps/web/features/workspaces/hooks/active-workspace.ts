import { useEffect } from "react";
import { useWorkspaceStore } from "@/features/workspaces/store";

export function useActiveWorkspace() {
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const hydrateWorkspace = useWorkspaceStore((state) => state.hydrateWorkspace);
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace);

  useEffect(() => {
    hydrateWorkspace();
  }, [hydrateWorkspace]);

  return {
    activeWorkspaceId,
    selectWorkspace,
    clearWorkspace,
  };
}
