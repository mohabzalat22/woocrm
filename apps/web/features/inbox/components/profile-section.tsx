import Image from "next/image";
import {
  CalendarDays,
  CircleCheck,
  MessageCircle,
  Pencil,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "#/ui/components/avatar";
import { Button } from "#/ui/components/button";
import { Card, CardContent } from "#/ui/components/card";

type TimelineEvent = {
  date: string;
  description: string;
  icon: LucideIcon;
  title: string;
};

const timelineEvents: TimelineEvent[] = [
  {
    date: "Today, 10:24 AM",
    description: "Mohab Ali was added to your contacts.",
    icon: UserRound,
    title: "Contact created",
  },
  {
    date: "Today, 10:31 AM",
    description: "A conversation was started in Inbox.",
    icon: MessageCircle,
    title: "First conversation",
  },
  {
    date: "Today, 10:42 AM",
    description: "Contact moved to Qualified.",
    icon: CircleCheck,
    title: "Status updated",
  },
  {
    date: "Tomorrow, 9:00 AM",
    description: "Follow up with Mohab Ali.",
    icon: CalendarDays,
    title: "Follow-up scheduled",
  },
];

function Timeline() {
  return (
    <section aria-labelledby="timeline-title" className="pt-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 id="timeline-title" className="text-lg font-semibold">
          Timeline
        </h3>
        <span className="text-xs text-muted-foreground">Recent activity</span>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute start-[11px] top-3 bottom-3 w-px bg-border"
        />
        <ol className="space-y-4">
          {timelineEvents.map((event) => {
            const Icon = event.icon;

            return (
              <li
                key={`${event.title}-${event.date}`}
                className="relative flex items-center gap-3"
              >
                <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
                  <Icon aria-hidden="true" className="size-3.5" />
                </div>
                <Card size="sm" className="min-w-0 flex-1">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{event.title}</p>
                      <time className="shrink-0 text-[11px] text-muted-foreground">
                        {event.date}
                      </time>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function ProfileSection() {
  return (
    <div className="h-[100vh] max-w-lg overflow-y-auto border-s border-border p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="flex">
          <Button
            aria-label="Close contact profile"
            title="Close contact profile"
            type="button"
            variant="ghost"
            size="icon-sm"
          >
            <X aria-hidden="true" />
          </Button>
          <div className="ms-4">
            <p className="text-xl font-bold">Contact</p>
            <p className="text-slate-400">profile & timeline</p>
          </div>
        </div>
        <Button
          aria-label="Edit contact"
          title="Edit contact"
          type="button"
          variant="ghost"
          size="icon-sm"
        >
          <Pencil aria-hidden="true" />
        </Button>
      </div>
      <div className="relative mt-5">
        <div className="">
          <Image
            className=" h-[200] object-cover object-center"
            src="https://github.com/shadcn.png"
            width={1000}
            height={800}
            alt="background image"
          ></Image>
        </div>
        {/* avatar */}
        <div className="absolute left-1/2 top-full border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2">
          <Avatar className="size-30">
            <AvatarImage src="https://github.com/shadcn.png" alt="@me" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Text */}
      <div className="pt-20 text-center">
        <h2 className="text-xl font-bold">Mohab Ali</h2>
        <p className="text-xs text-muted-foreground">+201208392186</p>
      </div>

      {/* Data */}
      <div className="pt-20 space-y-2">
        <div className="grid grid-cols-2 p-2">
          <p className="col-span-1 font-bold">Source</p>
          <p className="col-span-1">linked in</p>
        </div>
        <div className="grid grid-cols-2 p-2">
          <p className="col-span-1 font-bold">Status</p>
          <p className="col-span-1">Qualified</p>
        </div>
        <div className="grid grid-cols-2 p-2">
          <p className="col-span-1 font-bold">Agent</p>
          <p className="col-span-1">Mohab</p>
        </div>
        <div className="grid grid-cols-2 p-2">
          <p className="col-span-1 font-bold">Source</p>
          <p className="col-span-1">First Contact</p>
        </div>
        {/* linked deal */}
        <div className="grid grid-cols-2 mt-2 text-primary-foreground p-4 bg-primary rounded-full">
          <p className="col-span-1 font-bold">Linked Deal</p>
          <p className="col-span-1 ">linked deal</p>
        </div>
        <Timeline />
      </div>
    </div>
  );
}
