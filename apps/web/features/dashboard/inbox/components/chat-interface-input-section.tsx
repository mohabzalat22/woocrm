"use client";

import { useState } from "react";
import { Button } from "#/ui/components/button";
import { Input } from "#/ui/components/input";
import { Check, Paperclip, Send, Smile, SquarePen } from "lucide-react";
import { useInboxActions } from "../hooks/use-inbox-actions";
import { useInboxStore } from "../store";
import NoteComposer from "./note-composer";

export default function ChatInterfaceInputSection() {
  const [message, setMessage] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const selectedConversationId = useInboxStore(
    (state) => state.selectedConversationId,
  );
  const { send } = useInboxActions();
  const errorMessage = send.error?.message;
  const retryContent = send.isError ? send.variables?.content : undefined;

  async function handleSend(content: string) {
    if (!selectedConversationId) return;
    await send.mutateAsync({
      conversationId: selectedConversationId,
      content,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = message.trim();
    if (!content || send.isPending) return;
    await handleSend(content);
    setMessage("");
  }

  return (
    <div className="shrink-0 border-t bg-background p-3 sm:p-4">
      <NoteComposer
        open={noteOpen}
        onOpenChange={setNoteOpen}
        onSaved={() => setNoteSaved(true)}
      />
      {errorMessage && (
        <div
          role="alert"
          className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          <span>{errorMessage}</span>
          {retryContent && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleSend(retryContent)}
            >
              Retry
            </Button>
          )}
        </div>
      )}
      <form
        className="relative z-10 flex w-full items-center gap-2 rounded-xl border bg-muted/30 p-1.5 shadow-sm sm:p-2"
        onSubmit={handleSubmit}
      >
        <Button
          type="button"
          aria-label="Add a note"
          title="Add a note"
          variant="ghost"
          size="icon-sm"
          aria-expanded={noteOpen}
          className={noteOpen ? "bg-muted text-foreground" : undefined}
          onClick={() => setNoteOpen((open) => !open)}
        >
          <SquarePen />
        </Button>
        <Button
          type="button"
          aria-label="Attach a file"
          title="Attach a file"
          variant="ghost"
          size="icon-sm"
        >
          <Paperclip />
        </Button>
        <Input
          aria-label="Message"
          className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          placeholder="Write a message…"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={send.isPending}
        />
        <Button
          type="button"
          aria-label="Add emoji"
          title="Add emoji"
          variant="ghost"
          size="icon-sm"
        >
          <Smile />
        </Button>
        <Button
          type="submit"
          aria-label="Send message"
          title="Send message"
          size="icon-lg"
          className="size-10"
          disabled={send.isPending || !message.trim()}
        >
          {send.isPending ? (
            <Check className="size-4" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
      {noteSaved && (
        <p className="mt-2 text-center text-[11px] text-emerald-600">
          Note saved
        </p>
      )}
    </div>
  );
}
