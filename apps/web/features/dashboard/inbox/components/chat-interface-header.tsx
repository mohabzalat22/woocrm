import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/ui/avatar";
import Tag from "./tag";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import { Marker, MarkerContent } from "#/ui/components/marker";

export default function ChatInterfaceHeader() {
  return (
    <div className="flex w-full items-start justify-between border-b border-border p-4">
      <div className="flex">
        <Avatar className="size-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="ms-4">
          <div className="flex">
            <p className="font-bold text-lg shrink-0">Mohab Ali</p>
            <Marker role="status" className="text-xs">
              <MarkerContent className="shimmer ms-4">
                is typing...
              </MarkerContent>
            </Marker>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-slate-400">Sleeps after 12 am</p>
            <p className="text-sm ">Agent :</p>
            <Tag
              className="ms-2 text-primary-foreground bg-primary text-sm px-2"
              name="mohab"
            />
          </div>
        </div>
      </div>
      {/* right section */}
      <div className="flex items-center">
        {/* status */}
        <div className="m-2 flex-1 space-x-1">
          <Button>Assign</Button>
          <Tag className="border text-sm px-2" name="open" />
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <Button className="bg-white hover:bg-slate-100">
          <EllipsisVertical />
        </Button>
      </div>
    </div>
  );
}
