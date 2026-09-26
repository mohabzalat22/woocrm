import { request } from "@/common/lib/api";
import type {
  Contact,
  ContactsPage,
  CreateContactPayload,
  UpdateContactPayload,
  ContactInfoInput,
} from "@repo/shared-types";

export const contactsKey = (workspaceId: string) =>
  ["contacts", workspaceId] as const;

export const contactsApi = {
  findAll: (
    workspaceId: string,
    params: { search?: string; state?: string; page?: number; limit?: number },
  ): Promise<ContactsPage> => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.state) query.set("state", params.state);
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 20));
    return request(`workspaces/${workspaceId}/contacts?${query.toString()}`, {
      method: "GET",
    });
  },

  create: (workspaceId: string, data: CreateContactPayload): Promise<Contact> =>
    request(`workspaces/${workspaceId}/contacts`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    workspaceId: string,
    contactId: string,
    data: UpdateContactPayload,
  ): Promise<Contact> =>
    request(`workspaces/${workspaceId}/contacts/${contactId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (workspaceId: string, contactId: string): Promise<Contact> =>
    request(`workspaces/${workspaceId}/contacts/${contactId}`, {
      method: "DELETE",
    }),

  addInfo: (
    workspaceId: string,
    contactId: string,
    data: ContactInfoInput,
  ): Promise<Contact> =>
    request(`workspaces/${workspaceId}/contacts/${contactId}/contact-infos`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  export: async (workspaceId: string): Promise<Blob> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}workspaces/${workspaceId}/contacts/export`,
      { credentials: "include" },
    );
    if (!response.ok) throw new Error("Unable to export contacts");
    return response.blob();
  },
};
