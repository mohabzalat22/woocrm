import { useMutation } from "@tanstack/react-query";
import { contactsApi } from "../services/contacts.service";

export function useExportContacts(workspaceId: string | null) {
  const id = workspaceId ?? "";

  return useMutation({
    mutationFn: () => contactsApi.export(id),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "contacts.csv";
      link.click();
      URL.revokeObjectURL(url);
    },
  });
}
