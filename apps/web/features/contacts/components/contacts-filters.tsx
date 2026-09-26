import { Search } from "lucide-react";
import type { ContactState } from "@repo/shared-types";
import { Input } from "@repo/ui/ui/input";
import {
  ContactStateDropdown,
  type ContactStateValue,
} from "./contact-state-dropdown";

type ContactsFiltersProps = {
  search: string;
  state: ContactState | "ALL";
  onSearchChange: (value: string) => void;
  onStateChange: (value: ContactStateValue) => void;
};

export function ContactsFilters({
  search,
  state,
  onSearchChange,
  onStateChange,
}: ContactsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search names or contact information..."
          className="pl-9"
        />
      </div>
      <ContactStateDropdown value={state} onChange={onStateChange} />
    </div>
  );
}
