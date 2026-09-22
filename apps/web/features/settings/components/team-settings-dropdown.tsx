import { ChevronDown } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@repo/ui/ui/dropdown-menu";

export interface TeamSettingsDropdownOption {
  value: string;
  label: string;
}

export function TeamSettingsDropdown({
  options,
  value,
  onChange,
  disabled = false,
  emptyLabel = "No options available",
  id,
  "aria-label": ariaLabel,
}: {
  options: TeamSettingsDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  emptyLabel?: string;
  id?: string;
  "aria-label": string;
}) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="min-w-0 flex-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            id={id}
            variant="outline"
            disabled={disabled}
            aria-label={ariaLabel}
            className="h-8 w-full justify-between font-normal"
          >
            <span className="min-w-0 truncate">
              {selectedOption?.label ??
                (options.length ? "Select an option" : emptyLabel)}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {options.length ? (
            <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
              {options.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <span className="truncate">{option.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          ) : (
            <DropdownMenuItem disabled>{emptyLabel}</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
