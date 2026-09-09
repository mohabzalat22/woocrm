import ChatInterfaceHeader from "./chat-interface-header";
import ChatInterfaceMessagesSection from "./chat-interface-messages-section";
import ChatInterfaceInputSection from "@/features/inbox/components/chat-interface-input-section";

export default function ChatInterfaceSection() {
  return (
    <div className="w-full flex flex-col justify-between">
      <div className="h-full">
        <ChatInterfaceHeader />
        <ChatInterfaceMessagesSection />
      </div>
      <ChatInterfaceInputSection />
    </div>
  );
}
