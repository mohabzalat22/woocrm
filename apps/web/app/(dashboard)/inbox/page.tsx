"use client";

import { useState } from "react";
import { cn } from "@/common/lib/utils";
import InboxSection from "@/features/dashboard/inbox/components/inbox-section";
import ChatInterfaceSection from "@/features/dashboard/inbox/components/chat-interface-section";
import ProfileSection from "@/features/dashboard/inbox/components/profile-section";

type MobileView = "inbox" | "conversation" | "profile";

const mobileViews: { id: MobileView; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "conversation", label: "Conversation" },
  { id: "profile", label: "Profile" },
];

export default function InboxPage() {
  const [mobileView, setMobileView] = useState<MobileView>("inbox");
  const [profileOpen, setProfileOpen] = useState(false);

  const openProfile = () => {
    setProfileOpen(true);
    setMobileView("profile");
  };

  const closeProfile = () => {
    setProfileOpen(false);
    setMobileView("conversation");
  };

  const toggleProfile = () => {
    setProfileOpen((isOpen) => {
      const nextIsOpen = !isOpen;
      setMobileView(nextIsOpen ? "profile" : "conversation");
      return nextIsOpen;
    });
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden bg-muted/30">
      <nav
        aria-label="Inbox views"
        className="flex shrink-0 border-b bg-background p-2 md:hidden"
      >
        <div className="flex w-full rounded-xl bg-muted p-1">
          {mobileViews.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => {
                if (view.id === "profile") {
                  openProfile();
                  return;
                }

                setMobileView(view.id);
              }}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground transition-colors",
                mobileView === view.id &&
                  (view.id !== "profile" || profileOpen) &&
                  "bg-background text-foreground shadow-sm",
              )}
            >
              {view.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex min-h-0 flex-1 md:flex">
        <InboxSection
          className={cn("md:flex", mobileView === "inbox" ? "flex" : "hidden")}
          onOpenConversation={() => setMobileView("conversation")}
        />
        <ChatInterfaceSection
          className={cn(
            "md:flex",
            mobileView === "conversation" ? "flex" : "hidden",
          )}
          onBack={() => setMobileView("inbox")}
          onToggleProfile={toggleProfile}
          profileOpen={profileOpen}
        />
        {profileOpen && (
          <ProfileSection
            className={cn(
              "md:flex",
              mobileView === "profile" ? "flex" : "hidden",
            )}
            onClose={closeProfile}
          />
        )}
      </div>
    </div>
  );
}
