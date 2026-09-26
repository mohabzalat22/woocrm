"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { CONTACT_STATES, type ContactState } from "@repo/shared-types";
import { Button } from "@repo/ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/ui/dropdown-menu";

export type ContactStateValue = ContactState | "ALL";

const stateLabels: Record<ContactState, string> = {
  NEW: "New",
  LEAD: "Lead",
  CUSTOMER: "Customer",
  VIP: "VIP",
  IMPORTANT: "Important",
  FOLLOWUP: "Follow-up",
  INTERESTED: "Interested",
  INACTIVE: "Inactive",
  PARTNER: "Partner",
};

type ContactStateDropdownProps = {
  value: ContactStateValue;
  onChange: (value: ContactStateValue) => void;
  includeAll?: boolean;
  className?: string;
  id?: string;
};

export function ContactStateDropdown({
  value,
  onChange,
  includeAll = true,
  className,
  id,
}: ContactStateDropdownProps) {
  const label = value === "ALL" ? "All states" : stateLabels[value];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={`h-9 w-full justify-between font-normal sm:w-44 ${className ?? ""}`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <ListFilter className="size-4 text-muted-foreground" />
            <span className="truncate">{label}</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Filter by state</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) =>
            onChange(nextValue as ContactStateValue)
          }
        >
          {includeAll && (
            <DropdownMenuRadioItem value="ALL">
              All states
            </DropdownMenuRadioItem>
          )}
          {CONTACT_STATES.map((state) => (
            <DropdownMenuRadioItem key={state} value={state}>
              {stateLabels[state]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
