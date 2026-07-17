import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AppHeaderProps {
  /** Optional status / breadcrumb text shown left of the controls. */
  status?: ReactNode;
  statusTone?: "default" | "error";
  /** Controls (account menu, color-mode, notifications, …). */
  children?: ReactNode;
  className?: string;
}

/**
 * Generic app-header row intended to be passed to
 * `DashboardLayout.headerContent`. Purely presentational: consumers compose
 * their own controls as children. Inherits the app's theme tokens.
 */
export default function AppHeader({
  status,
  statusTone = "default",
  children,
  className,
}: AppHeaderProps) {
  return (
    <div className={cn("flex w-full items-center justify-end gap-3", className)}>
      {status ? (
        <p
          className={cn(
            "max-w-[48rem] truncate text-sm",
            statusTone === "error" ? "text-destructive" : "text-muted-foreground",
          )}
          aria-live="polite"
        >
          {status}
        </p>
      ) : null}
      {children}
    </div>
  );
}
