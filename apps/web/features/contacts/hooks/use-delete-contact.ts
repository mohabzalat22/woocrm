import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contact } from "@repo/shared-types";
import { contactsApi, contactsKey } from "../services/contacts.service";

export function useDeleteContact(workspaceId: string | null) {
  const queryClient = useQueryClient();
  const id = workspaceId ?? "";

  return useMutation({
    mutationFn: (contact: Contact) => contactsApi.delete(id, contact.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contactsKey(id) });
    },
  });
}
