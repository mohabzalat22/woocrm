"use client";

import { useState } from "react";
import { Input } from "#/ui/components/input";
import { Button } from "#/ui/components/button";
import { Paperclip, Send, Smile, SquarePen, Check } from "lucide-react";
import NoteComposer from "./note-composer";

export default function ChatInterfaceInputSection() {
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  function handleToggleNote() {
    setNoteOpen((open) => !open);
  }

  return (
    <div className="shrink-0 border-t bg-background p-3 sm:p-4">
      <NoteComposer
        open={noteOpen}
        onDirty={() => setNoteSaved(false)}
        onOpenChange={setNoteOpen}
        onSaved={() => setNoteSaved(true)}
      />

      <div className="relative z-10 flex w-full items-center gap-2 rounded-xl border bg-muted/30 p-1.5 shadow-sm sm:p-2">
        <Button
          type="button"
          aria-label="Add a note"
          title="Add a note"
          variant="ghost"
          size="icon-sm"
          aria-expanded={noteOpen}
          aria-controls="note-composer"
          className={noteOpen ? "bg-muted text-foreground" : undefined}
          onClick={handleToggleNote}
        >
          <SquarePen />
        </Button>
        {noteSaved && !noteOpen && (
          <span
            role="status"
            className="hidden items-center gap-1 text-xs text-emerald-600 sm:flex"
          >
            <Check className="size-3.5" />
            Note saved
          </span>
        )}
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
          placeholder="Write a message..."
        />
        <Button
          type="button"
          aria-label="Add emoji"
          title="Add emoji"
          variant="ghost"
          size="icon-sm"
          className="hidden sm:inline-flex"
        >
          <Smile />
        </Button>
        <Button
          type="button"
          aria-label="Send message"
          title="Send message"
          size="icon-lg"
          className="size-10"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
