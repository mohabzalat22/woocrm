"use client";

import { useState } from "react";
import type { Contact, ContactState } from "@repo/shared-types";
import { ConfirmationDialog } from "@/common/components/confirmation-dialog";
import { useActiveWorkspace } from "@/features/workspaces/hooks/active-workspace";
import { ContactDialog } from "./contact-dialog";
import { ContactsFilters } from "./contacts-filters";
import { ContactsHeader } from "./contacts-header";
import { ContactsPagination } from "./contacts-pagination";
import { ContactsTable } from "./contacts-table";
import { useContacts } from "../hooks/use-contacts";
import { useDeleteContact } from "../hooks/use-delete-contact";
import { useExportContacts } from "../hooks/use-export-contacts";

export function ContactsPage() {
  const { activeWorkspaceId } = useActiveWorkspace();
  const [search, setSearch] = useState("");
  const [state, setState] = useState<ContactState | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  const contacts = useContacts(activeWorkspaceId, { search, state, page });
  const deleteMutation = useDeleteContact(activeWorkspaceId);
  const exportMutation = useExportContacts(activeWorkspaceId);

  function openCreate() {
    setEditingContact(null);
    setDialogOpen(true);
  }

  function openEdit(contact: Contact) {
    setEditingContact(contact);
    setDialogOpen(true);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStateChange(value: ContactState | "ALL") {
    setState(value);
    setPage(1);
  }

  if (!activeWorkspaceId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6 text-sm text-muted-foreground">
        Select a workspace to manage contacts.
      </div>
    );
  }

  const data = contacts.data?.data ?? [];
  const meta = contacts.data?.meta;
  const queryError =
    contacts.error instanceof Error
      ? contacts.error.message
      : contacts.isError
        ? "Unable to load contacts"
        : undefined;
  const mutationError =
    exportMutation.error?.message ?? deleteMutation.error?.message;

  return (
    <div className="space-y-5 p-6">
      <ContactsHeader
        isExporting={exportMutation.isPending}
        onExport={() => exportMutation.mutate()}
        onAdd={openCreate}
      />
      <ContactsFilters
        search={search}
        state={state}
        onSearchChange={handleSearchChange}
        onStateChange={handleStateChange}
      />
      <ContactsTable
        contacts={data}
        isLoading={contacts.isLoading}
        errorMessage={queryError}
        onEdit={openEdit}
        onDelete={setDeletingContact}
      />
      {meta && (
        <ContactsPagination
          page={meta.page}
          total={meta.total}
          totalPages={meta.totalPages}
          onPrevious={() => setPage((current) => current - 1)}
          onNext={() => setPage((current) => current + 1)}
        />
      )}
      <ContactDialog
        workspaceId={activeWorkspaceId}
        contact={editingContact}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <ConfirmationDialog
        open={Boolean(deletingContact)}
        onOpenChange={(open) => {
          if (!open) setDeletingContact(null);
        }}
        title="Delete contact?"
        description={`This will permanently delete ${deletingContact?.name ?? "this contact"} and all of its contact information.`}
        confirmLabel="Delete contact"
        isPending={deleteMutation.isPending}
        onConfirm={async () => {
          if (deletingContact) {
            await deleteMutation.mutateAsync(deletingContact);
            setDeletingContact(null);
          }
        }}
      />
      {mutationError && (
        <p className="text-sm text-destructive">{mutationError}</p>
      )}
    </div>
  );
}
