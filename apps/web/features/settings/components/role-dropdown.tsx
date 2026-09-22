import type { TeamRole } from "@/features/team/types/team.interface";
import { TeamSettingsDropdown } from "./team-settings-dropdown";
import { roleLabel } from "./team-settings-utils";

export function RoleDropdown({
  roles,
  value,
  onChange,
  disabled = false,
  id,
}: {
  roles: TeamRole[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <TeamSettingsDropdown
      options={roles.map((role) => ({
        value: role.id,
        label: roleLabel(role.name),
      }))}
      value={value}
      onChange={onChange}
      disabled={disabled}
      id={id}
      aria-label="Member role"
    />
  );
}
