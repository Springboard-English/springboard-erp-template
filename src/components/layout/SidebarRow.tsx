import type { ComponentProps, ComponentType, ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

/** A sidebar icon: the app names the component, the template sizes it. A Lucide icon fits. */
export type SidebarIcon = ComponentType<{ className?: string }>;

/** Data attributes an app puts on a tab or row itself, such as a tour anchor or a test id. */
export type SidebarDataAttributes = Record<`data-${string}`, string>;

/** One row an app adds to the sidebar's account panel, such as "Take the tour". */
export interface SidebarAction {
  id: string;
  label: string;
  icon: SidebarIcon;
  onClick: () => void;
  disabled?: boolean;
  dataAttributes?: SidebarDataAttributes;
}

/**
 * The two columns every sidebar row shares: a fixed 3rem icon column, the
 * collapsed rail's whole content width, and a text column that the rail clips.
 * Icons sit at the same x collapsed and expanded, so nothing moves.
 */
export const sidebarRowGrid = "grid w-full grid-cols-[3rem_minmax(0,1fr)] items-center";

/** The icon column's cell: centres whatever it holds in the 3rem column. */
export function SidebarIconCell({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("flex items-center justify-center", className)}>{children}</span>;
}

/** The text column's cell: clipped content that fades out on a collapsed rail. */
export function SidebarText({
  collapsed,
  children,
  className,
}: {
  collapsed: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "min-w-0 truncate text-left transition-opacity duration-200",
        collapsed && "opacity-0",
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface SidebarButtonProps extends Omit<ComponentProps<typeof Button>, "children" | "asChild"> {
  icon: SidebarIcon;
  label: string;
  collapsed: boolean;
  dataAttributes?: SidebarDataAttributes;
  /** Makes the row a link that opens in a new tab. */
  href?: string;
}

/**
 * A ghost button laid out as a sidebar row: icon column, then the label. The
 * label stays in the accessibility tree while it is faded, so it remains the
 * row's name; a collapsed rail adds it as a tooltip.
 */
export function SidebarButton({
  icon: Icon,
  label,
  collapsed,
  dataAttributes,
  href,
  className,
  variant = "ghost",
  ...props
}: SidebarButtonProps) {
  const cells = (
    <>
      <SidebarIconCell>
        <Icon className="size-5" />
      </SidebarIconCell>
      <SidebarText collapsed={collapsed}>{label}</SidebarText>
    </>
  );
  const shared = {
    variant,
    title: collapsed ? label : undefined,
    ...dataAttributes,
    ...props,
    className: cn(sidebarRowGrid, "gap-0 overflow-hidden rounded-xl px-0", className),
  };

  if (href) {
    return (
      <Button asChild {...shared}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {cells}
        </a>
      </Button>
    );
  }
  return (
    <Button type="button" {...shared}>
      {cells}
    </Button>
  );
}
