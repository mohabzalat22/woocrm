import type { ContactState } from "@repo/shared-types";
import { Tag, type TagTone } from "@/common/components/tag";

const stateTone: Record<ContactState, TagTone> = {
  NEW: "blue",
  LEAD: "violet",
  CUSTOMER: "emerald",
  VIP: "amber",
  IMPORTANT: "orange",
  FOLLOWUP: "cyan",
  INTERESTED: "pink",
  INACTIVE: "neutral",
  PARTNER: "indigo",
};

type ContactStateBadgeProps = {
  state: ContactState;
  label?: string;
  className?: string;
};

export function ContactStateBadge({
  state,
  label = state,
  className,
}: ContactStateBadgeProps) {
  return (
    <Tag tone={stateTone[state]} className={className}>
      {label}
    </Tag>
  );
}
