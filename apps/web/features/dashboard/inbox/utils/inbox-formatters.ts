import type { InboxContact, InboxMessage } from "../types/inbox.interface";

export function getContactName(contact: InboxContact) {
  const savedName = contact.name.trim();
  return savedName;
}

export function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "?";
}

export function formatTime(value: string | null | undefined) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDateLabel(value: string | null | undefined) {
  if (!value) return "Recent messages";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent messages";

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDifference = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000,
  );

  if (dayDifference === 0) return "Today";
  if (dayDifference === 1) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function normalizeMessageContent(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export function isMatchingPendingMessage(
  message: Pick<InboxMessage, "direction" | "content">,
  pendingMessage: { conversationId: string; content: string } | null,
  conversationId: string,
) {
  if (!pendingMessage || pendingMessage.conversationId !== conversationId) {
    return false;
  }

  if (message.direction !== "OUTBOUND") {
    return false;
  }

  return (
    normalizeMessageContent(message.content) ===
    normalizeMessageContent(pendingMessage.content)
  );
}

export function getMessageStatusLabel(message: InboxMessage) {
  if (message.status === "FAILED") return "Failed";
  if (message.status === "READ") return "Read";
  if (message.status === "DELIVERED") return "Delivered";
  return "Sent";
}

export function getContactStateLabel(state: InboxContact["state"]) {
  return state.charAt(0) + state.slice(1).toLowerCase();
}

export function formatFirstContact(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getAssigneeName(
  assignee: { name: string | null; email: string } | null,
) {
  return assignee?.name?.trim() || "Unassigned";
}
