import type { ReactNode } from "react";
import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Every row on the rail is at least as tall as a button (44px on touch, 36px
 * with a mouse), so a heading, an entry and a host's own bar line up and any
 * of them can hold one. It is a floor, never a cap: more content grows a row.
 * A host drawing its own row on the rail uses `TIMELINE_ROW`.
 */
export const TIMELINE_ROW = "min-h-11 md:pointer-fine:min-h-9";
// An entry's row sits inside a 1px border top and bottom.
const TIMELINE_ENTRY_ROW = "min-h-[2.625rem] md:pointer-fine:min-h-[2.125rem]";

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
          // Centred on the heading row: (44 - 20) / 2 on touch, (36 - 20) / 2 with a mouse.
          "absolute -left-[0.6875rem] top-3 flex size-5 items-center justify-center rounded-full ring-4 ring-background md:pointer-fine:top-2",
          GROUP_DOT[state],
        )}
        aria-hidden
      >
        {state === "past" && <Check className="size-3" />}
      </span>
      {/* At least a button's height, like every other row on the rail; a long label wraps and grows it. */}
      <h3
        className={cn(
          TIMELINE_ROW,
          "mb-2 flex flex-wrap items-center gap-x-2 text-sm font-semibold text-foreground",
        )}
      >
        {label}
        {meta && <span className="font-normal text-muted-foreground">{meta}</span>}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </li>
  );
}

/**
 * One thing on the timeline, as a row card at least as tall as a button: a
 * round icon, the title with its meta after it, and one trailing element
 * (chips or a single action). Longer content wraps and the row grows; it is
 * never cut to fit. `onOpen` makes the row a button. `children` are rows that
 * belong to it, listed under the row inside the same card, such as the
 * coursework set in a session.
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
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-3.5" aria-hidden />
      </span>
      {/* The title, then its meta on the same line while they fit; past that they wrap. */}
      <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
        <span className="min-w-0 text-sm font-medium">{title}</span>
        {meta && (
          <span className={cn("min-w-0 text-xs", warn ? "text-destructive" : "text-muted-foreground")}>{meta}</span>
        )}
      </span>
    </>
  );
  return (
    <li
      className="rounded-xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-px hover:shadow"
      {...attributes}
    >
      {/* A floor, never a cap: with the card's 1px borders, one line is exactly a button's height. */}
      <div className={cn(TIMELINE_ENTRY_ROW, "flex items-center gap-3 px-3 py-1")}>
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="flex min-w-0 flex-1 items-center gap-3 self-stretch rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {row}
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">{row}</div>
        )}
        {trailing && <span className="flex shrink-0 items-center">{trailing}</span>}
      </div>
      {children && <ul className="space-y-2 border-t border-border/50 p-2">{children}</ul>}
    </li>
  );
}
