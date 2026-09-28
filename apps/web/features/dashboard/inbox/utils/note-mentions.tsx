import type { ReactNode } from "react";

export const mentionableUsers = [
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

export function getMentionQuery(value: string, cursorPosition: number) {
  const textBeforeCursor = value.slice(0, cursorPosition);
  const mention = textBeforeCursor.match(/(?:^|\s)@([^\s@]*)$/);
  return mention?.[1] ?? null;
}

export function renderHighlightedNote(value: string): ReactNode {
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
