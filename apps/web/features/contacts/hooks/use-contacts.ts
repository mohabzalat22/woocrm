import { useQuery } from "@tanstack/react-query";
import { contactsApi, contactsKey } from "../services/contacts.service";
import type { ContactState } from "@repo/shared-types";

type UseContactsOptions = {
  search: string;
  state: ContactState | "ALL";
  page: number;
};

export function useContacts(
  workspaceId: string | null,
  { search, state, page }: UseContactsOptions,
) {
  const id = workspaceId ?? "";

  return useQuery({
    queryKey: [...contactsKey(id), search, state, page],
    queryFn: () =>
      contactsApi.findAll(id, {
        search,
        state: state === "ALL" ? undefined : state,
        page,
        limit: 20,
      }),
    enabled: Boolean(workspaceId),
  });
}
