import { Download, Plus } from "lucide-react";
import { Button } from "@repo/ui/ui/button";

type ContactsHeaderProps = {
  isExporting: boolean;
  onExport: () => void;
  onAdd: () => void;
};

export function ContactsHeader({
  isExporting,
  onExport,
  onAdd,
}: ContactsHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
        <p className="text-sm text-muted-foreground">
          Manage every contact and their contact information in this workspace.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport} disabled={isExporting}>
          <Download /> {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
        <Button onClick={onAdd}>
          <Plus /> Add contact
        </Button>
      </div>
    </div>
  );
}
