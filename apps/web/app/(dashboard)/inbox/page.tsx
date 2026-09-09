import InboxSection from "@/features/inbox/components/inbox-section";
import ChatInterfaceSection from "@/features/inbox/components/chat-interface-section";

export default function page() {
  return (
    <div className="flex">
      <InboxSection />
      <ChatInterfaceSection />
    </div>
  );
}
