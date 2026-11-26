import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { liveRunnerProductName, useHomeHref } from "./config";

// Minimal centered layout for the student's entry / terminal screens (join,
// confirmation, score, closed) — no per-question progress chrome.
//
// The wordmark links home only when the viewer HAS one. A guest on a public
// link belongs to no workspace, so `/` would send them to access-denied — see
// `useHomeHref`. For them the mark is inert rather than a trap.
//
// `headerActions` is a slot, off by default: this shell also draws screens of a
// sitting, which must not gain controls.
export function StudentPageShell({ children, headerActions }: { children: ReactNode; headerActions?: ReactNode }) {
  const homeHref = useHomeHref();
  const brand = (
    <span className="inline-flex items-center gap-2 text-sm font-extrabold text-foreground">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-white"><Leaf className="size-5" /></span>
      {liveRunnerProductName()}
    </span>
  );
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          {homeHref ? <Link to={homeHref}>{brand}</Link> : brand}
          {headerActions}
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col justify-center px-5 py-10 sm:px-8 sm:py-16">{children}</main>
    </div>
  );
}
