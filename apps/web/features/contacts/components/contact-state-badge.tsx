import type { ContactState } from "@repo/shared-types";

const stateClass: Record<ContactState, string> = {
  NEW: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  LEAD: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  CUSTOMER: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  VIP: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  IMPORTANT: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  FOLLOWUP: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  INTERESTED: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  INACTIVE: "bg-muted text-muted-foreground",
  PARTNER: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
};

export function ContactStateBadge({ state }: { state: ContactState }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${stateClass[state]}`}
    >
      {state}
    </span>
  );
}
