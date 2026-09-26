"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type TransitionEvent,
} from "react";
import { Input } from "#/ui/components/input";
import { Button } from "#/ui/components/button";
import { AtSign, Check, X } from "lucide-react";

type NoteComposerProps = {
  open: boolean;
  onDirty?: () => void;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

const mentionableUsers = [
  { name: "Mohab Ali", initials: "MA" },
  { name: "Sarah Johnson", initials: "SJ" },
  { name: "Omar Khaled", initials: "OK" },
  { name: "Nour Hassan", initials: "NH" },
  { name: "Alex Morgan", initials: "AM" },
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const mentionPattern = new RegExp(
  `(${mentionableUsers.map(({ name }) => `@${escapeRegExp(name)}`).join("|")}|@[a-zA-Z0-9._-]+)`,
  "g",
);

function getMentionQuery(value: string, cursorPosition: number) {
  const textBeforeCursor = value.slice(0, cursorPosition);
  const mention = textBeforeCursor.match(/(?:^|\s)@([^\s@]*)$/);

  return mention?.[1] ?? null;
}

function renderHighlightedNote(value: string) {
  return value.split(mentionPattern).map((part, index) => {
    const isKnownMention = mentionableUsers.some(
      ({ name }) => part === `@${name}`,
    );
    const isMention = isKnownMention || /^@[a-zA-Z0-9._-]+$/.test(part);

    return isMention ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-amber-200/80 px-0.5 text-amber-950 dark:bg-amber-400/30 dark:text-amber-100"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

export default function NoteComposer({
  open,
  onDirty,
  onOpenChange,
  onSaved,
}: NoteComposerProps) {
  const [note, setNote] = useState("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [activeMentionIndex, setActiveMentionIndex] = useState(0);
  const [canOverflow, setCanOverflow] = useState(false);
  const noteInputRef = useRef<HTMLInputElement>(null);
  const noteMirrorRef = useRef<HTMLDivElement>(null);

  const matchingUsers = useMemo(() => {
    if (mentionQuery === null) {
      return [];
    }

    return mentionableUsers.filter((user) =>
      user.name.toLowerCase().includes(mentionQuery.toLowerCase()),
    );
  }, [mentionQuery]);

  useEffect(() => {
    setCanOverflow(false);

    if (open) {
      requestAnimationFrame(() => noteInputRef.current?.focus());
    }
  }, [open]);

  function handleExpansionTransitionEnd(
    event: TransitionEvent<HTMLDivElement>,
  ) {
    if (open && event.propertyName === "grid-template-rows") {
      setCanOverflow(true);
    }
  }

  function handleNoteChange(value: string, cursorPosition: number) {
    setNote(value);
    onDirty?.();
    setMentionQuery(getMentionQuery(value, cursorPosition));
    setActiveMentionIndex(0);
  }

  function insertMention(user: (typeof mentionableUsers)[number]) {
    const input = noteInputRef.current;
    const cursorPosition = input?.selectionStart ?? note.length;
    const mentionStart = note.slice(0, cursorPosition).lastIndexOf("@");
    const nextNote = `${note.slice(0, mentionStart)}@${user.name} ${note.slice(cursorPosition)}`;
    const nextCursorPosition = mentionStart + user.name.length + 2; //  @ + space = 2

    setNote(nextNote);
    onDirty?.();
    setMentionQuery(null);
    setActiveMentionIndex(0);

    requestAnimationFrame(() => {
      noteInputRef.current?.focus();
      noteInputRef.current?.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      );
    });
  }

  function handleSaveNote() {
    if (!note.trim()) {
      return;
    }

    setMentionQuery(null);
    onSaved?.();
    onOpenChange(false);
  }

  function handleNoteKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && mentionQuery !== null) {
      event.preventDefault();
      setMentionQuery(null);
      return;
    }

    if (mentionQuery === null || matchingUsers.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveMentionIndex((index) => (index + 1) % matchingUsers.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveMentionIndex(
        (index) => (index - 1 + matchingUsers.length) % matchingUsers.length,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      insertMention(matchingUsers[activeMentionIndex]);
    }
  }

  return (
    <div
      onTransitionEnd={handleExpansionTransitionEnd}
      className={`grid transition-[grid-template-rows,margin] duration-300 ease-out ${
        open
          ? `mb-2 grid-rows-[1fr] ${
              canOverflow ? "overflow-visible" : "overflow-hidden"
            }`
          : "mb-0 grid-rows-[0fr] overflow-hidden"
      }`}
    >
      <div
        className={`min-h-0 ${canOverflow ? "overflow-visible" : "overflow-hidden"}`}
      >
        <div
          id="note-composer"
          className={`relative z-20 origin-bottom rounded-2xl bg-background p-3 transition-[transform,opacity] duration-300 sm:p-4 ${
            open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          }`}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Add an internal note</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Only your team will see this note.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close note composer"
              title="Close note composer"
              onClick={() => onOpenChange(false)}
            >
              <X />
            </Button>
          </div>

          <div className="relative">
            <div
              ref={noteMirrorRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden whitespace-nowrap px-2.5 py-2 text-sm leading-6"
            >
              {renderHighlightedNote(note)}
            </div>
            <Input
              ref={noteInputRef}
              aria-label="Internal note"
              value={note}
              onChange={(event) =>
                handleNoteChange(
                  event.target.value,
                  event.target.selectionStart ?? event.target.value.length,
                )
              }
              onKeyDown={handleNoteKeyDown}
              onScroll={(event) => {
                if (noteMirrorRef.current) {
                  noteMirrorRef.current.scrollLeft =
                    event.currentTarget.scrollLeft;
                }
              }}
              placeholder="Write a note... Use @ to mention a teammate"
              className="relative z-10 h-10 border bg-transparent text-transparent caret-foreground selection:bg-primary/20 placeholder:text-muted-foreground"
            />

            {mentionQuery !== null && matchingUsers.length > 0 && (
              <div className="absolute bottom-full left-0 z-50 mb-2 max-h-56 w-64 overflow-y-auto rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-lg">
                <p className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  Mention a teammate
                </p>
                {matchingUsers.map((user, index) => (
                  <button
                    key={`${user.name}-${index}`}
                    type="button"
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                      activeMentionIndex === index
                        ? "bg-muted"
                        : "hover:bg-muted/70"
                    }`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertMention(user)}
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary-foreground">
                      {user.initials}
                    </span>
                    <span>{user.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <AtSign className="size-3.5" />
              <span>Type @ to mention a teammate</span>
            </div>
            <Button
              type="button"
              size="sm"
              disabled={!note.trim()}
              onClick={handleSaveNote}
            >
              <Check />
              Save note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
