import { AlertCircle, Check, CheckCheck, Clock3 } from "lucide-react";
import { Button } from "#/ui/components/button";
import { Bubble, BubbleContent } from "#/ui/components/bubble";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "#/ui/components/message";
import { cn } from "@/common/lib/utils";
import { useInboxActions } from "../hooks/use-inbox-actions";
import { useInboxData } from "../hooks/use-inbox-data";
import { useInboxStore } from "../store";
import {
  formatDateLabel,
  formatTime,
  getMessageStatusLabel,
  isMatchingPendingMessage,
} from "../utils/inbox-formatters";
import type { InboxMessage } from "../types/inbox.interface";
import { Markdown } from "@/common/components/markdown";

function StatusIcon({ message }: { message: InboxMessage }) {
  if (message.status === "FAILED") return <AlertCircle className="size-3" />;
  if (message.status === "SENT") return <Check className="size-3" />;
  return <CheckCheck className="size-3" />;
}

export default function ChatInterfaceMessagesSection() {
  const { conversation: conversationQuery } = useInboxData();
  const conversation = conversationQuery.data ?? null;
  const pendingMessage = useInboxStore((state) => state.pendingMessage);
  const retryingMessageId = useInboxStore((state) => state.retryingMessageId);
  const { retry } = useInboxActions();

  if (!conversation) return null;

  const retryError = retry.error?.message;
  const messages = conversation.messages ?? [];
  const hasMatchingPendingMessage = messages.some((message) =>
    isMatchingPendingMessage(message, pendingMessage, conversation.id),
  );
  const shouldRenderPendingMessage =
    !!pendingMessage &&
    pendingMessage.conversationId === conversation.id &&
    !hasMatchingPendingMessage;

  let lastDateLabel = "";

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-muted/25">
      <div className="flex w-full flex-col gap-5 p-4 sm:gap-6 sm:p-6 lg:p-8">
        {retry.error?.message && (
          <div
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            Retry failed: {retryError}
          </div>
        )}
        {messages.map((message) => {
          const dateLabel = formatDateLabel(message.createdAt);
          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;
          const isOutbound = message.direction === "OUTBOUND";
          const canRetry = isOutbound && message.status === "FAILED";
          const isRetrying = retryingMessageId === message.id;

          return (
            <div key={message.id} className="contents">
              {showDate && (
                <div className="relative  mx-auto w-2/3 flex items-center justify-center px-10">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-border" />

                  <div className="z-10 bg-background px-3 py-1 text-sm font-medium text-muted-foreground">
                    {dateLabel}
                  </div>
                </div>
              )}
              <Message align={isOutbound ? "end" : "start"}>
                <MessageContent>
                  <Bubble variant={isOutbound ? "default" : "muted"}>
                    <BubbleContent>
                      <Markdown text={message.content} />
                    </BubbleContent>
                  </Bubble>
                  <MessageFooter className={cn(isOutbound && "justify-end")}>
                    {formatTime(message.createdAt)}
                    {isOutbound && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <StatusIcon message={message} />
                          {getMessageStatusLabel(message)}
                        </span>
                        {canRetry && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1 text-[10px] text-destructive"
                            disabled={retry.isPending}
                            onClick={() =>
                              void retry.mutateAsync({
                                conversationId: conversation.id,
                                messageId: message.id,
                              })
                            }
                          >
                            {isRetrying ? "Retrying…" : "Retry"}
                          </Button>
                        )}
                      </>
                    )}
                  </MessageFooter>
                </MessageContent>
              </Message>
            </div>
          );
        })}
        {shouldRenderPendingMessage && (
          <Message align="end">
            <MessageContent>
              <Bubble>
                <BubbleContent>{pendingMessage.content}</BubbleContent>
              </Bubble>
              <MessageFooter className="justify-end">
                <Clock3 className="size-3" />
                Sending…
              </MessageFooter>
            </MessageContent>
          </Message>
        )}
        {messages.length === 0 && !shouldRenderPendingMessage && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Start the conversation with a thoughtful reply.
          </p>
        )}
      </div>
    </div>
  );
}
