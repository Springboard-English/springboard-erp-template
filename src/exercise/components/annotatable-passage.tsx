import { Highlighter, X } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import { useHighlighter, useHighlighterTool } from "./highlighter";
import { PassageText } from "./passage-text";

// The reading passage with a highlighter for the side-by-side view. Notes live
// in the bottom bar instead (so they persist across the whole test). The
// highlighting itself is `highlighter.tsx`, shared with the questions column;
// this adds the clear-all bar. `scopeKey` names the passage its highlights are
// saved under.

export function AnnotatablePassage({
  paragraphs,
  enable,
  scopeKey,
}: {
  paragraphs: string[];
  enable?: boolean;
  scopeKey: string;
}) {
  const { t } = useI18n();
  const { on } = useHighlighterTool();
  const { ref, count, clear, chip } = useHighlighter(enable, scopeKey);

  if (!enable) {
    return (
      <>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-3 whitespace-pre-wrap text-[14.5px] leading-7 text-muted-foreground first:mt-0"
          >
            <PassageText text={paragraph} />
          </p>
        ))}
      </>
    );
  }

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-1">
        {count ? (
          <Button type="button" size="sm" variant="ghost" onClick={clear}>
            <X className="size-4" />
            {t("exercise.renderer.clearHighlights", "Clear Highlights ({n})", { n: count })}
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Highlighter className="size-3.5" />
            {on
              ? t("exercise.renderer.dragToHighlight", "Drag over text to highlight")
              : t("exercise.renderer.turnOnHighlight", "Turn on Highlight below to mark text")}
          </span>
        )}
      </div>

      <div ref={ref} className="cursor-text select-text">
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-3 whitespace-pre-wrap text-[14.5px] leading-7 text-muted-foreground first:mt-0"
          >
            <PassageText text={paragraph} />
          </p>
        ))}
      </div>

      {chip}
    </>
  );
}
