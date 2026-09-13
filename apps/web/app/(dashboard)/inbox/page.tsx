import InboxSection from "@/features/dashboard/inbox/components/inbox-section";
import ChatInterfaceSection from "@/features/dashboard/inbox/components/chat-interface-section";
import ProfileSection from "@/features/dashboard/inbox/components/profile-section";

export default function page() {
  return (
    <div className="flex">
      <InboxSection />
      <ChatInterfaceSection />
      <ProfileSection />
    </div>
  );
}
