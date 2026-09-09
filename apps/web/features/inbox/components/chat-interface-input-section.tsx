import { Input } from "#/ui/components/input";
import { Button } from "#/ui/components/button";
import { SquarePen } from "lucide-react";
import { Paperclip } from "lucide-react";
import { Send } from "lucide-react";

export default function ChatInterfaceInputSection() {
  return (
    <div className="flex space-x-4 p-4 mb-4 items-center border-t border-border bg-white">
      <Button variant="secondary" className="size-12">
        <SquarePen className="size-5" />
      </Button>

      <Button variant="secondary" className="size-12">
        <Paperclip className="size-5" />
      </Button>

      <Input className="h-full" placeholder="Type a Message ..."></Input>

      <Button className="size-12">
        <Send className="size-6 text-white" />
      </Button>
    </div>
  );
}
