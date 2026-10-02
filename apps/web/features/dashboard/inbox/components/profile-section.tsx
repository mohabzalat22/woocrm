"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil, X } from "lucide-react";
import type { ContactState } from "@repo/shared-types";
import { Avatar, AvatarFallback, AvatarImage } from "#/ui/components/avatar";
import { Button } from "#/ui/components/button";
import { Input } from "#/ui/components/input";
import { Label } from "#/ui/components/label";
import { ContactStateBadge } from "@/common/components/contact-state-badge";
import { cn } from "@/common/lib/utils";
import { useMe } from "@/features/auth/hooks/me";
import { ContactStateDropdown } from "@/features/contacts/components/contact-state-dropdown";
import { useSaveContact } from "@/features/contacts/hooks/use-save-contact";
import { useActiveWorkspace } from "@/features/workspaces/hooks/active-workspace";
import { useInboxData } from "../hooks/use-inbox-data";
import { useInboxStore } from "../store";
import { contactProfile } from "../data/contact-profile";
import {
  getAssigneeName,
  formatFirstContact,
  getContactName,
  getContactStateLabel,
  getInitials,
} from "../utils/inbox-formatters";
import Timeline from "./time-line";

interface ContactProfileDraft {
  name: string;
  identity: string;
  source: string;
  state: ContactState;
}

function createDraft(contact: {
  name: string;
  state: ContactState;
  contactInfo: { identity: string; source: string } | null;
}): ContactProfileDraft {
  return {
    name: contact.name,
    identity: contact.contactInfo?.identity ?? "",
    source: contact.contactInfo?.source ?? "",
    state: contact.state,
  };
}

export default function ProfileSection({ className }: { className?: string }) {
  const { activeWorkspaceId: workspaceId } = useActiveWorkspace();
  const { data: currentUser } = useMe();
  const { conversation: conversationQuery, members } = useInboxData();

  const conversation = conversationQuery.data ?? null;
  const conversationRef = useRef(conversation);
  conversationRef.current = conversation;

  const closeProfile = useInboxStore((state) => state.closeProfile);
  const setProfileDirty = useInboxStore(
    (state) => state.setContactProfileDirty,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ContactProfileDraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveContact = useSaveContact(workspaceId as string);
  const currentMember = members.data?.find(
    (member) => member.userId === currentUser?.id,
  );

  //MOX: every one can edit regarding to this implementation
  const canEdit = useMemo(() => {
    if (!conversation || !currentMember) return false;

    if (
      currentMember.role.name === "ADMIN" ||
      currentMember.role.name === "MANAGER"
    ) {
      return true;
    }

    return (
      currentMember.role.name === "AGENT" &&
      conversation.assignedToId === currentMember.id
    );
  }, [conversation, currentMember]);

  useEffect(() => {
    const selectedConversation = conversation;

    if (!selectedConversation) {
      setDraft(null);
      setIsEditing(false);
      setProfileDirty(false);
      return;
    }

    setDraft(createDraft(selectedConversation.contact));
    setIsEditing(false);
    setError(null);
    setProfileDirty(false);
  }, [conversation, setProfileDirty]);

  function startEditing() {
    if (!conversation || !canEdit) return;
    setDraft(createDraft(conversation.contact));
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (conversation) setDraft(createDraft(conversation.contact));
    setError(null);
    setIsEditing(false);
    setProfileDirty(false);
  }

  function updateDraft<Field extends keyof ContactProfileDraft>(
    field: Field,
    value: ContactProfileDraft[Field],
  ) {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
    setProfileDirty(true);
  }

  function validateDraft() {
    if (!draft?.name.trim()) return "Name is required";
    if (!draft.identity.trim()) return "Identity is required";
    return null;
  }

  async function saveDraft() {
    if (!conversation || !draft || !workspaceId) return;

    const validationError = validateDraft();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    try {
      await saveContact.mutateAsync({
        contactId: conversation.contact.id,
        data: {
          name: draft.name.trim(),
          state: draft.state,
          contactInfo: {
            identity: draft.identity.trim(),
            source: draft.source.trim(),
          },
        },
      });

      setIsEditing(false);
      setProfileDirty(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save contact",
      );
    }
  }

  async function submitEditing() {
    if (!conversation || !draft) return;

    const validationError = validateDraft();
    if (validationError) {
      setError(validationError);
      return;
    }

    await saveDraft();
  }

  const contact = conversation?.contact ?? null;
  const initials = contact ? getInitials(getContactName(contact)) : "?";
  const assigneeName = getAssigneeName(conversation?.assignedTo ?? null);

  return (
    <aside
      className={cn(
        "min-h-0 w-full shrink-0 flex-col overflow-y-auto border-s bg-background md:w-[20rem] xl:w-88",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b px-3 py-3 sm:px-5">
        <div className="mt-0.5">
          <p className=" font-semibold">Contact profile</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Details & timeline
          </p>
        </div>
        <div className="flex items-center gap-1">
          {conversation && !isEditing && (
            <Button
              aria-label={canEdit ? "Edit contact" : "Contact cannot be edited"}
              title={canEdit ? "Edit contact" : "Contact cannot be edited"}
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!canEdit}
              onClick={startEditing}
            >
              <Pencil aria-hidden="true" />
            </Button>
          )}

          <Button
            aria-label="Close contact profile"
            title="Close contact profile"
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setProfileDirty(false);
              closeProfile();
            }}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      </div>
      {isEditing && (
        <div className="flex gap-1 rounded p-3 mx-auto">
          <Button
            className="me-1"
            type="button"
            variant="outline"
            size="sm"
            onClick={cancelEditing}
            disabled={saveContact.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void submitEditing()}
            disabled={saveContact.isPending}
          >
            {saveContact.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      )}

      {!conversation || !contact || !draft ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <div>
            <p className="font-medium">No conversation selected</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a conversation to view the contact profile.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="relative h-28">
            <div className="absolute inset-0 overflow-hidden rounded-xl bg-linear-to-br from-emerald-100 via-lime-100 to-amber-100">
              <div className="absolute -right-5 -top-10 size-36 rounded-full bg-white/35 blur-2xl" />
              <div className="absolute -bottom-16 -left-4 size-40 rounded-full bg-primary/20 blur-2xl" />
              <ContactStateBadge
                state={contact.state}
                label={getContactStateLabel(contact.state)}
                className="absolute bottom-3 left-4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
              />
            </div>
            <div className="absolute bottom-0 left-1/2 z-10 size-20 -translate-x-1/2 translate-y-1/2 rounded-full border-4 border-background bg-emerald-100">
              <Avatar className="size-full">
                <AvatarImage
                  src={contactProfile.avatarUrl}
                  alt={contact.name}
                />
                <AvatarFallback className="bg-emerald-100 text-lg font-semibold text-emerald-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="pt-12 text-center">
            {isEditing ? (
              <div className="grid gap-2">
                <Label htmlFor="profile-name" className="sr-only">
                  Name
                </Label>
                <Input
                  id="profile-name"
                  className="text-center text-lg font-semibold"
                  value={draft.name}
                  onChange={(event) => updateDraft("name", event.target.value)}
                />
                <Label htmlFor="profile-identity" className="sr-only">
                  Identity
                </Label>
                <Input
                  id="profile-identity"
                  className="text-center text-xs"
                  value={draft.identity}
                  onChange={(event) =>
                    updateDraft("identity", event.target.value)
                  }
                />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{contact.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {contact.contactInfo?.identity || "—"}
                </p>
              </>
            )}
          </div>
          {/* table */}
          <div className="mt-6 divide-y rounded-xl border">
            <div className="grid grid-cols-2 items-center gap-3 p-3 text-xs">
              <p className="text-muted-foreground">Source</p>
              {isEditing ? (
                <Input
                  aria-label="Source"
                  className="h-7 text-center"
                  value={draft.source}
                  onChange={(event) =>
                    updateDraft("source", event.target.value)
                  }
                />
              ) : (
                <p className="truncate text-right font-medium">
                  {contact.contactInfo?.source || "—"}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 items-center gap-3 p-3 text-xs">
              <p className="text-muted-foreground">Status</p>
              {isEditing ? (
                <ContactStateDropdown
                  id="profile-status"
                  value={draft.state}
                  onChange={(value) => {
                    if (value !== "ALL") updateDraft("state", value);
                  }}
                  includeAll={false}
                  className="w-full!"
                />
              ) : (
                <div className="flex justify-end">
                  <ContactStateBadge
                    state={contact.state}
                    label={getContactStateLabel(contact.state)}
                    className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 p-3 text-xs">
              <p className="text-muted-foreground">Assigned to</p>
              <p
                className="truncate text-right font-medium"
                title={assigneeName}
              >
                {assigneeName}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-3 text-xs">
              <p className="text-muted-foreground">First contact</p>
              <p className="text-right font-medium">
                {formatFirstContact(conversation.createdAt)}
              </p>
            </div>
          </div>
          {/* TODO: make unified errors */}
          {error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between rounded-xl bg-primary p-4 text-primary-foreground">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-75">
                Linked deal
              </p>
              <p className="mt-1 text-sm font-semibold">
                {contactProfile.deal.name}
              </p>
            </div>
            <span className="rounded-full bg-primary-foreground/15 px-2 py-1 text-[10px] font-medium">
              {contactProfile.deal.value}
            </span>
          </div>

          <Timeline />
        </div>
      )}
    </aside>
  );
}
