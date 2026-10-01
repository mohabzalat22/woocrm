import { request } from "@/common/lib/api";
import type {
  ConversationsPage,
  InboxConversation,
  InboxMember,
  InboxQueryOptions,
  Note,
} from "../types/inbox.interface";

export const inboxKeys = {
  all: (workspaceId: string) => ["inbox", workspaceId] as const,
  conversations: (workspaceId: string, tab: string) =>
    ["inbox", workspaceId, "conversations", tab] as const,
  conversation: (workspaceId: string, conversationId: string) =>
    ["inbox", workspaceId, "conversation", conversationId] as const,
  members: (workspaceId: string) => ["inbox", workspaceId, "members"] as const,
  lastNote: (workspaceId: string, conversationId: string) =>
    ["inbox", workspaceId, "conversation", conversationId, "lastNote"] as const,
};

const conversationPath = (workspaceId: string, conversationId: string) =>
  `workspaces/${workspaceId}/inbox/conversations/${conversationId}`;

export const inboxApi = {
  list: (
    workspaceId: string,
    options: InboxQueryOptions,
  ): Promise<ConversationsPage> => {
    const query = new URLSearchParams({
      tab: options.tab,
      page: String(options.page),
      limit: String(options.limit),
    });

    return request(
      `workspaces/${workspaceId}/inbox/conversations?${query.toString()}`,
      { method: "GET" },
    );
  },

  get: (workspaceId: string, conversationId: string) =>
    request<InboxConversation>(conversationPath(workspaceId, conversationId), {
      method: "GET",
    }),

  members: (workspaceId: string): Promise<InboxMember[]> =>
    request(`workspaces/${workspaceId}/members`, { method: "GET" }),

  assign: (
    workspaceId: string,
    conversationId: string,
    memberId: string | null,
  ) =>
    request<InboxConversation>(
      `${conversationPath(workspaceId, conversationId)}/assign`,
      {
        method: "POST",
        body: JSON.stringify({ memberId }),
      },
    ),

  resolve: (workspaceId: string, conversationId: string) =>
    request<InboxConversation>(
      `${conversationPath(workspaceId, conversationId)}/resolve`,
      {
        method: "POST",
      },
    ),

  read: (workspaceId: string, conversationId: string) =>
    request<InboxConversation>(
      `${conversationPath(workspaceId, conversationId)}/read`,
      {
        method: "POST",
      },
    ),

  send: (workspaceId: string, conversationId: string, content: string) =>
    request<InboxConversation>(
      `${conversationPath(workspaceId, conversationId)}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      },
    ),

  retry: (workspaceId: string, conversationId: string, messageId: string) =>
    request<InboxConversation>(
      `${conversationPath(workspaceId, conversationId)}/messages/${messageId}/retry`,
      { method: "POST" },
    ),

  getLastNote: (workspaceId: string, conversationId: string) =>
    request<Note>(
      `workspaces/${workspaceId}/conversations/${conversationId}/notes/last`,
      {
        method: "GET",
      },
    ),

  createNote: (workspaceId: string, conversationId: string, content: string) =>
    request<Note>(
      `workspaces/${workspaceId}/conversations/${conversationId}/notes`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      },
    ),
};
