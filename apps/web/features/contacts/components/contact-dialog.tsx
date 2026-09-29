"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  type Contact,
  type ContactInfoInput,
  type ContactState,
} from "@repo/shared-types";
import { Button } from "#/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/ui/components/dialog";
import { Input } from "#/ui/components/input";
import { Label } from "#/ui/components/label";
import { useSaveContact } from "../hooks/use-save-contact";
import { ContactStateDropdown } from "./contact-state-dropdown";

type ContactDialogProps = {
  workspaceId: string;
  contact?: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ContactInfoForm = ContactInfoInput;

export function ContactDialog({
  workspaceId,
  contact,
  open,
  onOpenChange,
}: ContactDialogProps) {
  const [name, setName] = useState("");
  const [state, setState] = useState<ContactState>("NEW");
  const [contactInfo, setContactInfo] = useState<ContactInfoForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mutation = useSaveContact(workspaceId);

  const resetMutation = mutation.reset;
  useEffect(() => {
    if (!open) return;
    setName(contact?.name ?? "");
    setState(contact?.state ?? "NEW");
    setContactInfo(contact?.contactInfo ?? null);
    setError(null);
    resetMutation();
  }, [contact, open, resetMutation]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const info = contactInfo
      ? {
          identity: contactInfo.identity.trim(),
          source: contactInfo.source.trim(),
        }
      : undefined;

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (info && (!info.identity || !info.source)) {
      setError("Complete both contact-info fields or leave them empty");
      return;
    }

    try {
      await mutation.mutateAsync({
        contactId: contact?.id,
        data: {
          name: name.trim(),
          state,
          contactInfo: info ?? (contact ? null : undefined),
        },
      });
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save contact",
      );
    }
  }

  function updateInfo(field: keyof ContactInfoInput, value: string) {
    setContactInfo((current) => ({
      identity: current?.identity ?? "",
      source: current?.source ?? "",
      [field]: value,
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>
              {contact ? "Edit contact" : "Add contact"}
            </DialogTitle>
            <DialogDescription>
              Keep the contact details and one phone, email, or social identity.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-state">State</Label>
              <ContactStateDropdown
                id="contact-state"
                value={state}
                onChange={(value) => {
                  if (value !== "ALL") setState(value);
                }}
                includeAll={false}
                className="sm:w-full"
              />
            </div>

            <div className="grid gap-3">
              <div>
                <Label>Contact information</Label>
                <p className="text-xs text-muted-foreground">
                  Add one phone, email, or social identity.
                </p>
              </div>
              <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_9rem_auto] sm:items-end">
                <div className="grid gap-1.5">
                  <Label htmlFor="contact-identity">Identity</Label>
                  <Input
                    id="contact-identity"
                    value={contactInfo?.identity ?? ""}
                    onChange={(event) =>
                      updateInfo("identity", event.target.value)
                    }
                    placeholder="+201001234567 or john@example.com"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="contact-source">Source</Label>
                  <Input
                    id="contact-source"
                    value={contactInfo?.source ?? ""}
                    onChange={(event) =>
                      updateInfo("source", event.target.value)
                    }
                    placeholder="whatsapp"
                  />
                </div>
                {contactInfo && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setContactInfo(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {(error || mutation.error) && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error ?? mutation.error?.message}
            </p>
          )}
          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving..."
                : contact
                  ? "Save changes"
                  : "Create contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
