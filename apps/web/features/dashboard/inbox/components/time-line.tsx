import { contactProfile } from "../data/contact-profile";
import { Card, CardContent } from "#/ui/components/card";

export default function Timeline() {
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
                key={event.title + event.date}
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
