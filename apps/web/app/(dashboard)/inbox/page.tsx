"use client";

import { cn } from "@/common/lib/utils";
import ChatInterfaceSection from "@/features/dashboard/inbox/components/chat-interface-section";
import InboxSection from "@/features/dashboard/inbox/components/inbox-section";
import ProfileSection from "@/features/dashboard/inbox/components/profile-section";
import { useInboxRealtime } from "@/features/dashboard/inbox/hooks/use-inbox-realtime";
import {
  useInboxStore,
  type MobileView,
} from "@/features/dashboard/inbox/store";

const mobileViews: Array<{ id: MobileView; label: string }> = [
  { id: "inbox", label: "Inbox" },
  { id: "conversation", label: "Conversation" },
  { id: "profile", label: "Profile" },
];

export default function InboxPage() {
  const mobileView = useInboxStore((state) => state.mobileView);
  const profileOpen = useInboxStore((state) => state.profileOpen);
  const setMobileView = useInboxStore((state) => state.setMobileView);
  const openProfile = useInboxStore((state) => state.openProfile);

  useInboxRealtime(); //MOX: creates events listeners

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
              onClick={() =>
                view.id === "profile" ? openProfile() : setMobileView(view.id)
              }
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
        />
        <ChatInterfaceSection
          className={cn(
            "md:flex",
            mobileView === "conversation" ? "flex" : "hidden",
          )}
        />
        {profileOpen && (
          <ProfileSection
            className={cn(
              "md:flex",
              mobileView === "profile" ? "flex" : "hidden",
            )}
          />
        )}
      </div>
    </div>
  );
}
