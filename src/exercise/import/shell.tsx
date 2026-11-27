import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { PageHeader, pageFrameClassName, type PageHeaderBackItem } from "../../exports";
import { cn } from "../../lib/utils";

/**
 * The page header and content pane the import renders in: the template's
 * `PageHeader` over a pane that fills the window and scrolls under it, the
 * frame Leap's TeacherShell draws.
 */
export function TeacherShell({
  children,
  title,
  back,
  eyebrow,
  actions,
  frame = "scroll",
}: {
  children: ReactNode;
  title: string;
  back?: PageHeaderBackItem[];
  eyebrow?: string;
  actions?: ReactNode;
  frame?: "detail" | "list" | "scroll";
}) {
  const { pathname } = useLocation();
  return (
    <div className={cn(pageFrameClassName({ variant: frame === "detail" ? "detail" : "list" }), "md:[&>*:first-child]:shrink-0")}>
      <PageHeader title={title} back={back} eyebrow={eyebrow} actions={actions} />
      <div
        key={pathname}
        className={cn("md:flex md:min-h-0 md:flex-1 md:flex-col", frame === "scroll" && "md:overflow-y-auto md:overflow-x-hidden md:pr-1")}
      >
        {children}
      </div>
    </div>
  );
}
