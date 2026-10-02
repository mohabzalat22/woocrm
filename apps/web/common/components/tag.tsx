import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/common/lib/utils";

export type TagTone =
  | "neutral"
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "orange"
  | "cyan"
  | "pink"
  | "indigo";

const toneClassName: Record<TagTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  orange: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  cyan: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  pink: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
};

type TagProps = ComponentPropsWithoutRef<"span"> & {
  tone?: TagTone;
};

export function Tag({
  tone = "neutral",
  className,
  children,
  ...props
}: TagProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        toneClassName[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
