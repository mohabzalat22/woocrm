import type {
  ContactState,
  ConversationStatus,
  MessageDirection,
  MessageStatus,
} from "@repo/shared-types";

export interface InboxMessage {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  content: string;
  status: MessageStatus;
  senderMemberId: string | null;
  externalId: string | null;
  createdAt: string;
}

export interface InboxContact {
  id: string;
  name: string;
  state: ContactState;
  contactInfos: Array<{ id: string; identity: string; source: string }>;
}

export interface ConversationAssignee {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  role: string;
}

export interface InboxConversation {
  id: string;
  workspaceId: string;
  channel: string;
  contactId: string;
  status: ConversationStatus;
  assignedToId: string | null;
  assignedTo: ConversationAssignee | null;
  lastMessageAt: string | null;
  lastReadAt: string | null;
  unread: boolean;
  createdAt: string;
  updatedAt: string;
  contact: InboxContact;
  lastMessage: InboxMessage | null;
  messages?: InboxMessage[];
}

export interface ConversationsPage {
  data: InboxConversation[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface InboxMember {
  id: string;
  userId: string;
  roleId: string;
  user: { id: string; name: string | null; email: string };
  role: { name: string };
}

export interface InboxQueryOptions {
  tab: "open" | "resolved" | "unread";
  page: number;
  limit: number;
}
