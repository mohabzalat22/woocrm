import { Input } from "#/ui/components/input";
import { Button } from "#/ui/components/button";
import { Paperclip, Send, Smile, SquarePen } from "lucide-react";

export default function ChatInterfaceInputSection() {
  return (
    <div className="shrink-0 border-t bg-background p-3 sm:p-4">
      <div className="flex w-full items-center gap-2 rounded-xl border bg-muted/30 p-1.5 sm:p-2 shadow-sm">
        <Button
          aria-label="Add a note"
          title="Add a note"
          variant="ghost"
          size="icon-sm"
          className="hidden sm:inline-flex"
        >
          <SquarePen />
        </Button>
        <Button
          aria-label="Attach a file"
          title="Attach a file"
          variant="ghost"
          size="icon-sm"
        >
          <Paperclip />
        </Button>
        <Input
          aria-label="Message"
          className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          placeholder="Write a message..."
        />
        <Button
          aria-label="Add emoji"
          title="Add emoji"
          variant="ghost"
          size="icon-sm"
          className="hidden sm:inline-flex"
        >
          <Smile />
        </Button>
        <Button
          aria-label="Send message"
          title="Send message"
          size="icon-lg"
          className="size-10"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
