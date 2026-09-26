import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ContactInfoInput, ContactState } from "@repo/shared-types";
import { contactsApi, contactsKey } from "../services/contacts.service";

type SaveContactData = {
  name: string;
  state?: ContactState;
  contactInfos?: ContactInfoInput[];
};

type SaveContactInput = {
  contactId?: string;
  data: SaveContactData;
};

export function useSaveContact(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, data }: SaveContactInput) =>
      contactId
        ? contactsApi.update(workspaceId, contactId, data)
        : contactsApi.create(workspaceId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: contactsKey(workspaceId),
      });
    },
  });
}
