import { Pencil, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "#/ui/components/avatar";
import { Button } from "#/ui/components/button";
import { Card, CardContent } from "#/ui/components/card";
import { cn } from "@/common/lib/utils";
import { contactProfile } from "../data/contact-profile";

type ProfileSectionProps = {
  className?: string;
  onClose?: () => void;
};

function Timeline() {
  return (
    <section aria-labelledby="timeline-title" className="pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 id="timeline-title" className="text-sm font-semibold">
          Timeline
        </h3>
        <span className="text-[11px] text-muted-foreground">
          Recent activity
        </span>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-3 top-3 w-px bg-border"
        />
        <ol className="space-y-3">
          {contactProfile.timeline.map((event) => {
            const Icon = event.icon;

            return (
              <li
                key={`${event.title}-${event.date}`}
                className="relative flex items-center gap-3"
              >
                <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
                  <Icon aria-hidden="true" className="size-3" />
                </div>
                <Card size="sm" className="min-w-0 flex-1">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium">{event.title}</p>
                      <time className="shrink-0 text-[10px] text-muted-foreground">
                        {event.date}
                      </time>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
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

export default function ProfileSection({
  className,
  onClose,
}: ProfileSectionProps) {
  return (
    <aside
      className={cn(
        "min-h-0 w-full shrink-0 flex-col overflow-y-auto border-s bg-background md:w-[20rem] xl:w-[22rem]",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b px-3 py-3 sm:px-5">
        <div className="mt-0.5">
          <p className=" font-semibold">Contact profile</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Details & timeline
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            aria-label="Edit contact"
            title="Edit contact"
            type="button"
            variant="ghost"
            size="icon-sm"
          >
            <Pencil aria-hidden="true" />
          </Button>
          <Button
            aria-label="Close contact profile"
            title="Close contact profile"
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative h-28">
          <div className="absolute inset-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 via-lime-100 to-amber-100">
            <div className="absolute -right-5 -top-10 size-36 rounded-full bg-white/35 blur-2xl" />
            <div className="absolute -bottom-16 -left-4 size-40 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute bottom-3 left-4 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70 backdrop-blur">
              {contactProfile.label}
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 z-10 size-20 -translate-x-1/2 translate-y-1/2 rounded-full border-4 border-background bg-emerald-100">
            <Avatar className="size-full">
              <AvatarImage
                src={contactProfile.avatarUrl}
                alt={contactProfile.name}
              />
              <AvatarFallback className="bg-emerald-100 text-lg font-semibold text-emerald-700">
                {contactProfile.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-12 text-center">
          <h2 className="text-lg font-semibold">{contactProfile.name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {contactProfile.phone}
          </p>
        </div>

        <div className="mt-6 divide-y rounded-xl border">
          <div className="grid grid-cols-2 gap-3 p-3 text-xs">
            <p className="text-muted-foreground">Source</p>
            <p className="font-medium">{contactProfile.source}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3 text-xs">
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{contactProfile.status}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3 text-xs">
            <p className="text-muted-foreground">Assigned to</p>
            <p className="font-medium">{contactProfile.assignedTo}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3 text-xs">
            <p className="text-muted-foreground">First contact</p>
            <p className="font-medium">{contactProfile.firstContact}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-primary p-4 text-primary-foreground">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-75">
              Linked deal
            </p>
            <p className="mt-1 text-sm font-semibold">
              {contactProfile.deal.name}
            </p>
          </div>
          <span className="rounded-full bg-primary-foreground/15 px-2 py-1 text-[10px] font-medium">
            {contactProfile.deal.value}
          </span>
        </div>

        <Timeline />
      </div>
    </aside>
  );
}
