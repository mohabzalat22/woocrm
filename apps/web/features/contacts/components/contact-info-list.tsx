import type { ContactInfo } from "@repo/shared-types";

export function ContactInfoList({ info }: { info: ContactInfo | null }) {
  if (!info) {
    return <span className="text-sm text-muted-foreground">None added</span>;
  }

  return (
    <div className="min-w-48 rounded-lg border bg-muted/30 px-2.5 py-2">
      <p className="truncate text-sm font-medium">{info.identity}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-[0.08em]">Source</span>
        <span aria-hidden="true">·</span>
        <span className="truncate">{info.source}</span>
      </p>
    </div>
  );
}
