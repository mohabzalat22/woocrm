"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  type Contact,
  type ContactInfoInput,
  type ContactState,
} from "@repo/shared-types";
import { Button } from "@repo/ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/ui/dialog";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { useSaveContact } from "../hooks/use-save-contact";
import { Plus, Trash2 } from "lucide-react";
import { ContactStateDropdown } from "./contact-state-dropdown";

type ContactDialogProps = {
  workspaceId: string;
  contact?: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ContactInfoForm = ContactInfoInput & { key: string };

const newInfo = (): ContactInfoForm => ({
  key: crypto.randomUUID(),
  identity: "",
  source: "",
});

export function ContactDialog({
  workspaceId,
  contact,
  open,
  onOpenChange,
}: ContactDialogProps) {
  const [name, setName] = useState("");
  const [state, setState] = useState<ContactState>("NEW");
  const [contactInfos, setContactInfos] = useState<ContactInfoForm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mutation = useSaveContact(workspaceId);

  const resetMutation = mutation.reset;
  useEffect(() => {
    if (!open) return;
    setName(contact?.name ?? "");
    setState(contact?.state ?? "NEW");
    setContactInfos(
      contact?.contactInfos.map((info) => ({ ...info, key: info.id })) ?? [],
    );
    setError(null);
    resetMutation();
  }, [contact, open, resetMutation]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const infos = contactInfos.map(({ identity, source }) => ({
      identity: identity.trim(),
      source: source.trim(),
    }));

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (infos.some((info) => !info.identity || !info.source)) {
      setError("Complete or remove every contact-info row");
      return;
    }

    try {
      await mutation.mutateAsync({
        contactId: contact?.id,
        data: {
          name: name.trim(),
          state,
          contactInfos: infos,
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

  function updateInfo(
    key: string,
    field: keyof ContactInfoInput,
    value: string,
  ) {
    setContactInfos((current) =>
      current.map((info) =>
        info.key === key ? { ...info, [field]: value } : info,
      ),
    );
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
              Keep the contact details and as many phone, email, or social
              identities as needed.
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
              <div className="flex items-center justify-between">
                <div>
                  <Label>Contact information</Label>
                  <p className="text-xs text-muted-foreground">
                    Add multiple ways to reach this contact.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setContactInfos((current) => [...current, newInfo()])
                  }
                >
                  <Plus /> Add info
                </Button>
              </div>
              {contactInfos.length === 0 && (
                <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                  No contact information added yet.
                </p>
              )}
              {contactInfos.map((info, index) => (
                <div
                  key={info.key}
                  className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_9rem_auto] sm:items-end"
                >
                  <div className="grid gap-1.5">
                    <Label htmlFor={`contact-identity-${info.key}`}>
                      Identity {index + 1}
                    </Label>
                    <Input
                      id={`contact-identity-${info.key}`}
                      value={info.identity}
                      onChange={(event) =>
                        updateInfo(info.key, "identity", event.target.value)
                      }
                      placeholder="+201001234567 or john@example.com"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor={`contact-source-${info.key}`}>Source</Label>
                    <Input
                      id={`contact-source-${info.key}`}
                      value={info.source}
                      onChange={(event) =>
                        updateInfo(info.key, "source", event.target.value)
                      }
                      placeholder="whatsapp"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() =>
                      setContactInfos((current) =>
                        current.filter((item) => item.key !== info.key),
                      )
                    }
                    aria-label={`Remove contact information ${index + 1}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
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
