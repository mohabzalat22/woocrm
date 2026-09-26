import type { Contact } from "@repo/shared-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/ui/table";
import { ContactInfoList } from "./contact-info-list";
import { ContactRowActions } from "./contact-row-actions";
import { ContactStateBadge } from "./contact-state-badge";

type ContactsTableProps = {
  contacts: Contact[];
  isLoading: boolean;
  errorMessage?: string;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

export function ContactsTable({
  contacts,
  isLoading,
  errorMessage,
  onEdit,
  onDelete,
}: ContactsTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      {errorMessage && (
        <p className="p-6 text-sm text-destructive">{errorMessage}</p>
      )}
      {isLoading && (
        <p className="p-6 text-sm text-muted-foreground">Loading contacts...</p>
      )}
      {!isLoading && !errorMessage && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Contact information</TableHead>
              <TableHead className="w-12 text-right">
                <span className="sr-only">Settings</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>
                  <ContactStateBadge state={contact.state} />
                </TableCell>
                <TableCell className="min-w-[18rem]">
                  <ContactInfoList infos={contact.contactInfos} />
                </TableCell>
                <TableCell className="text-right">
                  <ContactRowActions
                    contact={contact}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
            {!contacts.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
