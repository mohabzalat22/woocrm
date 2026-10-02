import { Avatar, AvatarFallback } from "#/ui/components/avatar";
import { cn } from "@/common/lib/utils";
import { ContactStateBadge } from "@/common/components/contact-state-badge";
import {
  formatTime,
  getContactName,
  getContactStateLabel,
  getInitials,
} from "../utils/inbox-formatters";
import type { InboxConversation } from "../types/inbox.interface";

interface ConversationRowProps {
  conversation: InboxConversation;
  selected: boolean;
  onSelect: () => void;
}

export default function ConversationRow({
  conversation,
  selected,
  onSelect,
}: ConversationRowProps) {
  const contactName = getContactName(conversation.contact);
  const unreadCount = conversation.unread ? 1 : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/70",
        selected && "bg-muted",
      )}
    >
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="bg-emerald-100 font-semibold text-emerald-700">
          {getInitials(contactName)}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold">{contactName}</span>
          <time className="shrink-0 text-[11px] text-muted-foreground">
            {formatTime(conversation.lastMessageAt)}
          </time>
        </span>
        <span className="mt-1 block truncate text-xs text-muted-foreground">
          {conversation.lastMessage?.content ?? "No messages yet"}
        </span>
        <span className="mt-2 flex items-center justify-between gap-2">
          <ContactStateBadge
            state={conversation.contact.state}
            label={getContactStateLabel(conversation.contact.state)}
            className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
          />
          <span className="flex items-center gap-2">
            {conversation.status === "RESOLVED" && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Resolved
              </span>
            )}
            {unreadCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </span>
        </span>
      </span>
    </button>
  );
}
