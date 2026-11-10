import type { ReactNode } from "react";
import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** `data-*` attributes a host puts on a piece, such as a guided tour's anchor. */
export type TimelineAttributes = Record<`data-${string}`, string>;

/** The dated rail; its children are `TimelineGroup`s in the order they should read. */
export function Timeline({
  children,
  className,
  attributes,
}: {
  children: ReactNode;
  className?: string;
  attributes?: TimelineAttributes;
}) {
  return (
    <ol className={cn("ml-2.5 border-l-2 border-border/70", className)} {...attributes}>
      {children}
    </ol>
  );
}

/** Where a group sits against today: `past` is ticked, `today` is lit, `upcoming` is outlined. */
export type TimelineGroupState = "past" | "today" | "upcoming";

const GROUP_DOT: Record<TimelineGroupState, string> = {
  past: "bg-success text-white",
  today: "bg-primary text-primary-foreground ring-primary/30",
  upcoming: "border-2 border-primary bg-background",
};

/**
 * One day (or any heading) on the rail: a dot that says where it sits against
 * today, its label with an optional muted `meta`, and its entries.
 */
export function TimelineGroup({
  label,
  meta,
  state = "upcoming",
  children,
  attributes,
}: {
  label: ReactNode;
  /** A muted note after the label, such as a count or a weekday. */
  meta?: ReactNode;
  state?: TimelineGroupState;
  children: ReactNode;
  attributes?: TimelineAttributes;
}) {
  return (
    <li className="relative pb-6 pl-6 last:pb-0" data-state={state} {...attributes}>
      <span
        className={cn(
          "absolute -left-[0.6875rem] top-0.5 flex size-5 items-center justify-center rounded-full ring-4 ring-background",
          GROUP_DOT[state],
        )}
        aria-hidden
      >
        {state === "past" && <Check className="size-3" />}
      </span>
      <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-foreground">
        {label}
        {meta && <span className="font-normal text-muted-foreground">{meta}</span>}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </li>
  );
}

/**
 * One thing on the timeline, as a row card: a round icon, a title, a meta line
 * and one trailing element (a chip or a single action). `onOpen` makes the row
 * a button. `children` are rows that belong to it, listed under the row inside
 * the same card, such as the coursework set in a session.
 */
export function TimelineEntry({
  icon: Icon,
  title,
  meta,
  warn,
  trailing,
  onOpen,
  children,
  attributes,
}: {
  icon: LucideIcon;
  title: ReactNode;
  meta?: ReactNode;
  /** The meta line turns red, for something overdue or missing. */
  warn?: boolean;
  trailing?: ReactNode;
  onOpen?: () => void;
  children?: ReactNode;
  attributes?: TimelineAttributes;
}) {
  const row = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        {/* Two lines before the ellipsis: phone titles are cut short otherwise. */}
        <span className="line-clamp-2 font-medium">{title}</span>
        {meta && (
          <span className={cn("block truncate text-xs", warn ? "text-destructive" : "text-muted-foreground")}>
            {meta}
          </span>
        )}
      </span>
    </>
  );
  return (
    <li
      className="rounded-xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-px hover:shadow"
      {...attributes}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {row}
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">{row}</div>
        )}
        {trailing && <span className="shrink-0">{trailing}</span>}
      </div>
      {children && <ul className="space-y-2 border-t border-border/50 px-3 py-3">{children}</ul>}
    </li>
  );
}
