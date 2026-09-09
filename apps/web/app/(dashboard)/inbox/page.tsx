import InboxSection from "@/features/inbox/components/inbox-section";
import ChatInterfaceSection from "@/features/inbox/components/chat-interface-section";
import ProfileSection from "@/features/inbox/components/profile-section";

export default function page() {
  return (
    <div className="flex">
      <InboxSection />
      <ChatInterfaceSection />
      <ProfileSection />
    </div>
  );
}
