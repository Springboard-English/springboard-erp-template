import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils";

/** A whole-screen state: working, finished, empty, blocked.
 *
 * It fills the view, because a small card floating in the top third reads as
 * "a widget failed to load" rather than "this is where you are". It sits INSIDE
 * the shell: it fills the content area and leaves the sidebar alone, so a teacher
 * mid-flow can still navigate away rather than being trapped behind an overlay.
 *
 * `tone` carries the meaning, per the design system's accent families: lav for
 * work in progress (the AI accent), mint for done, butter for a warning, rose
 * for a dead end.
 */
const TONES = {
  lav: "bg-lav-bg text-lav-700",
  mint: "bg-mint-bg text-mint-700",
  rose: "bg-rose-50 text-rose-700",
  butter: "bg-butter-bg text-butter-700",
  muted: "bg-muted text-muted-foreground",
} as const;

export function StatusScreen({
  icon: Icon,
  tone = "lav",
  title,
  description,
  // A shimmer bar for work with no measurable progress. Deliberately not a
  // percentage: detection is one model call, and a fake percentage that sits at
  // 90% reads as a stall.
  busy = false,
  pulseIcon = false,
  children,
  className,
}: {
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  title: string;
  description?: string;
  busy?: boolean;
  pulseIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Fills the shell's content area rather than the viewport, so the
        // sidebar stays reachable. The min-height is what makes it read as a
        // screen instead of a card.
        "grid min-h-[60vh] place-items-center px-6 py-12",
        className,
      )}
    >
      <div className="w-full max-w-sm space-y-6 text-center">
        <span
          className={cn(
            "mx-auto grid size-16 place-items-center rounded-3xl",
            TONES[tone],
          )}
        >
          <Icon className={cn("size-7", pulseIcon && "animate-pulse")} />
        </span>
        <div className="space-y-1.5">
          <p className="text-xl font-extrabold text-foreground">{title}</p>
          {description ? (
            <p className="text-sm font-semibold leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {busy ? (
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="springboard-shimmer h-full w-full rounded-full" />
          </div>
        ) : null}
        {children ? <div className="space-y-3">{children}</div> : null}
      </div>
    </div>
  );
}
