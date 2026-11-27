import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";

import { useI18n } from "../../context/I18nContext";

/**
 * The title bar of a shared passage's card: the book icon and the passage's
 * title (or "Passage") on the left, the card's own controls, such as "Edit
 * passage", on the right. The side-by-side reading passage and a gapped text's
 * passage both use it, so every shared passage reads as the same card.
 */
export function PassageCardHeader({ title, children }: { title?: string | null; children?: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-muted/30 px-4 py-2.5">
      <p className="flex min-w-0 items-center gap-2 text-sm font-bold text-foreground">
        <BookOpen className="size-4 shrink-0" />
        <span className="truncate">{title?.trim() || t("exercise.renderer.passage", "Passage")}</span>
      </p>
      {children ? <div className="flex shrink-0 items-center gap-1">{children}</div> : null}
    </div>
  );
}
