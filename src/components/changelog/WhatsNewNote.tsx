import { Suspense, lazy, useRef, type ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import { Sparkles, X } from "lucide-react";

import { useI18n } from "@/context/I18nContext";
import { touchHitArea } from "@/lib/touchTarget";
import { cn } from "@/lib/utils";

import { parseWhatsNewNote } from "./changelog";

// Same dynamic-import boundary the guides use, for the same reason:
// `react-markdown` touches `document` while being imported, and this component
// is reachable from the package barrel. See guides/SectionMarkdown.tsx and
// scripts/check-node-safe.mjs.
const SectionMarkdown = lazy(() => import("../guides/SectionMarkdown"));

export interface WhatsNewNoteProps {
  /** Raw markdown — each app keeps its own `src/content/whats-new.md`. */
  markdown: string;
  open: boolean;
  /** Called on any click, on Escape, and on the close button. */
  onDismiss: () => void;
  /** The element the note points at, usually the build tag. */
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

/**
 * A short, vital "here is what changed" note, shown once.
 *
 * Distinct from the changelog dialog on purpose. The dialog is the full commit
 * history, opened deliberately; this is the one thing a user has to know before
 * they carry on — a moved button, a changed workflow — and it is written by
 * hand in markdown rather than derived from commits.
 *
 * It is dismissed by *any* click, not just the close button, and never returns
 * for that note. Whether it has been seen is the caller's business (see
 * `changelogNoteId` / `readSeenNoteId`); this component only renders.
 */
export default function WhatsNewNote({
  markdown,
  open,
  onDismiss,
  children,
  side = "top",
  align = "center",
  className,
}: WhatsNewNoteProps) {
  const { t } = useI18n();
  const { title, body } = parseWhatsNewNote(markdown);
  const anchorRef = useRef<HTMLSpanElement>(null);

  return (
    <>
      <span ref={anchorRef} className="contents">{children}</span>
    <Popover.Root open={open} onOpenChange={(next) => (next ? undefined : onDismiss())}>
      <Popover.Portal>
        <Popover.Positioner
          // Anchored to the caller's element, not a trigger: the note opens on
          // its own.
          anchor={anchorRef}
          side={side}
          align={align}
          sideOffset={10}
          collisionPadding={12}
          className="isolate z-[70]"
        >
        <Popover.Popup
          // The note appears on its own, without the user having asked for it.
          // Taking focus would move the caret out of whatever they were typing,
          // so it stays where it is; the note is dismissible by clicking
          // anywhere, which Base UI already treats as an outside press.
          initialFocus={false}
          onClick={onDismiss}
          className={cn(
            "z-[70] w-[min(22rem,calc(100vw-2rem))]",
            "data-open:animate-in data-closed:animate-out",
            "data-open:fade-in-0 data-closed:fade-out-0",
            "data-open:zoom-in-95 data-closed:zoom-out-95",
            "outline-none",
          )}
          data-testid="whats-new-note"
        >
          <div
            className={cn(
              "relative rounded-xl border border-primary/30 bg-background p-4 shadow-lg",
              className,
            )}
          >
            <button
              type="button"
              onClick={onDismiss}
              aria-label={t("changelog.note.dismiss")}
              className={cn(
                touchHitArea,
                "absolute right-2.5 top-2.5 rounded-sm p-0.5 text-muted-foreground/70 opacity-70 transition-opacity hover:opacity-100",
              )}
            >
              <X className="size-3.5" />
            </button>

            <p className="flex items-center gap-2 pr-6 text-xs font-semibold text-primary/80">
              <Sparkles className="size-3.5" />
              {t("changelog.note.label")}
            </p>

            {title ? (
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
            ) : null}

            <div className="[&_p:first-child]:mt-2">
              <Suspense fallback={<p className="mt-2 h-4 w-2/3 animate-pulse rounded bg-muted" />}>
                <SectionMarkdown markdown={body} sectionId="whats-new-note" subHeadingIds={[]} />
              </Suspense>
            </div>

            <p className="mt-3 text-xs text-muted-foreground/70">{t("changelog.note.hint")}</p>
          </div>
          <Popover.Arrow className="data-[side=bottom]:top-[-7px] data-[side=left]:right-[-7px] data-[side=left]:rotate-90 data-[side=right]:left-[-7px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-7px] data-[side=top]:rotate-180">
            <svg width="14" height="7" viewBox="0 0 14 7" className="fill-background" aria-hidden>
              <path d="M0 0 L7 7 L14 0 Z" />
            </svg>
          </Popover.Arrow>
        </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    </>
  );
}
