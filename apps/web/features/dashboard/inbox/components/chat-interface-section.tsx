import { cn } from "@/common/lib/utils";
import ChatInterfaceHeader from "./chat-interface-header";
import ChatInterfaceMessagesSection from "./chat-interface-messages-section";
import ChatInterfaceInputSection from "@/features/dashboard/inbox/components/chat-interface-input-section";

type ChatInterfaceSectionProps = {
  className?: string;
  onBack?: () => void;
  onToggleProfile?: () => void;
  profileOpen?: boolean;
};

export default function ChatInterfaceSection({
  className,
  onBack,
  onToggleProfile,
  profileOpen,
}: ChatInterfaceSectionProps) {
  return (
    <section
      className={cn("min-h-0 min-w-0 flex-1 flex-col bg-background", className)}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatInterfaceHeader
          onBack={onBack}
          onToggleProfile={onToggleProfile}
          profileOpen={profileOpen}
        />
        <ChatInterfaceMessagesSection />
      </div>
      <ChatInterfaceInputSection />
    </section>
  );
}
