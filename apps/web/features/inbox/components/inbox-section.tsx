"use client";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/ui/avatar";
import Tag from "./tag";

export default function InboxSection() {
  const TabsValues = ["All", "Read", "Unread", "Open", "Resolved"];

  return (
    <div className="max-w-md h-screen p-4 border-e border-e-slate-200">
      <p className="text-lg font-bold">Inbox</p>
      <InputGroup className="w-full mt-4">
        <InputGroupInput placeholder="Search..." className="w-full flex-1" />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
      {/* tabs */}
      <div className="mt-5 w-full">
        <Tabs className="w-full" defaultValue="All">
          <TabsList className="w-full">
            {TabsValues.map((item) => {
              return (
                <TabsTrigger key={item} value={item}>
                  {item}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* chats */}
      <ul className="pt-6 space-y-4">
        <li className="p-2 flex items-center">
          <Avatar className="size-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="px-4 min-w-0">
            {/* name */}
            <div className="flex justify-between">
              <p className="font-bold">Mohab ali</p>
              <p className="text-slate-400 text-sm">2m</p>
            </div>
            {/* user message */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400 overflow-hidden truncate">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Aliquam recusandae nesciunt cum similique cumque incidunt vitae
                veritatis. Adipisci illum labore mollitia eum fugit minima, nisi
                nulla vel accusantium, quisquam ullam.
              </p>
              <Tag className="bg-red-500 text-white" name="LEAD" />
            </div>
          </div>
          {/* unread message */}
          <div className="flex size-5 shrink-0 text-white bg-primary rounded-full justify-center items-center text-sm">
            3
          </div>
        </li>
      </ul>
    </div>
  );
}
