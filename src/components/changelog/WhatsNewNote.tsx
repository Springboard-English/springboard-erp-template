import { Suspense, lazy, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Sparkles, X } from "lucide-react";

import { useI18n } from "@/context/I18nContext";
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

  return (
    <Popover.Root open={open} onOpenChange={(next) => (next ? undefined : onDismiss())}>
      <Popover.Anchor asChild>{children}</Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={10}
          collisionPadding={12}
          // The note appears on its own, without the user having asked for it.
          // Taking focus would move the caret out of whatever they were typing,
          // so it stays where it is; the note is dismissible by clicking
          // anywhere, which is what Radix already treats as "outside".
          onOpenAutoFocus={(event) => event.preventDefault()}
          onClick={onDismiss}
          className={cn(
            "z-[70] w-[min(22rem,calc(100vw-2rem))]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
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
              className="absolute right-2.5 top-2.5 rounded-sm p-0.5 text-muted-foreground/70 opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>

            <p className="flex items-center gap-2 pr-6 text-xs font-semibold uppercase tracking-widest text-primary/80">
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

            <p className="mt-3 text-[11px] text-muted-foreground/70">{t("changelog.note.hint")}</p>
          </div>
          <Popover.Arrow className="fill-background" width={14} height={7} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
