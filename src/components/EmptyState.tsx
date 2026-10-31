import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** What this is: "No results". */
  title: string;
  /** Why it is empty and how to start: "Clear filters to see all projects." */
  description?: string;
  icon?: ReactNode;
  /** The next step, usually one Button. */
  action?: ReactNode;
  className?: string;
}

/** The one way a list, page or panel says it has nothing to show, on desktop and on a phone. */
export default function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center",
        className,
      )}
    >
      {icon ? <div className="text-muted-foreground [&_svg]:size-6">{icon}</div> : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-prose text-sm text-muted-foreground">{description}</p> : null}
      {action}
    </div>
  );
}
