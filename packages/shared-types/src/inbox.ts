export const INBOX_TABS = ["open", "resolved", "unread"] as const;
export type InboxTab = (typeof INBOX_TABS)[number];

export const CONVERSATION_STATUSES = ["OPEN", "RESOLVED"] as const;
export type ConversationStatus = (typeof CONVERSATION_STATUSES)[number];

export const MESSAGE_DIRECTIONS = ["INBOUND", "OUTBOUND"] as const;
export type MessageDirection = (typeof MESSAGE_DIRECTIONS)[number];

export const MESSAGE_STATUSES = [
  "SENT",
  "DELIVERED",
  "READ",
  "FAILED",
] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export interface WorkspaceChannelSetting {
  id: string;
  workspaceId: string;
  channel: string;
  lockedAt: string;
}
