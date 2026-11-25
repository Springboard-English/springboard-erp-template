import { Hourglass, Loader2, Timer } from "lucide-react";
import { Button } from "../../exports";
import { formatClock } from "../lib/media-window";

import type { RunPart } from "./api";
import { useStableI18n } from "./i18n";

/**
 * The timed parts a student hasn't opened yet, each as a card with its timers,
 * the rule the user worded, and Open Part. Opening starts the part's clock on
 * the server, so the button says so; its questions arrive only after.
 */
export function TimedPartGates({
  parts,
  opening,
  onOpen,
}: {
  parts: RunPart[];
  /** The part being opened, while its call is in flight. */
  opening: string | null;
  onOpen: (partKey: string) => void;
}) {
  const { t } = useStableI18n();
  if (!parts.length) return null;
  return (
    <div className="mt-6 space-y-4">
      {parts.map((part) => (
        <section key={part.part_key} className="rounded-2xl border-2 border-dashed bg-card p-5 text-center">
          <p className="text-xs font-extrabold text-muted-foreground">{t("exercise.live.timedPart.next", "Timed part")}</p>
          <h2 className="mt-1 text-lg font-extrabold text-foreground">
            {part.title || t("exercise.live.timedPart.untitled", "Part {n}", { n: part.order + 1 })}
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-foreground">
            {part.preparation_seconds ? (
              <span className="inline-flex items-center gap-1.5">
                <Hourglass className="size-4" />
                {t("exercise.live.timedPart.prepare", "{time} to prepare", { time: formatClock(part.preparation_seconds) })}
              </span>
            ) : null}
            {part.time_limit_seconds ? (
              <span className="inline-flex items-center gap-1.5">
                <Timer className="size-4" />
                {t("exercise.live.timedPart.answer", "{time} to answer", { time: formatClock(part.time_limit_seconds) })}
              </span>
            ) : null}
            <span className="text-muted-foreground">
              {part.questions.length === 1
                ? t("exercise.live.timedPart.questionOne", "1 question")
                : t("exercise.live.timedPart.questionOther", "{n} questions", { n: part.questions.length })}
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            {t(
              "exercise.live.timedPart.rule",
              "The challenge's own time limit covers every part. A part's timer starts when the student opens it, and if they open it late they get only what is left of the challenge.",
            )}
          </p>
          <Button className="mt-4" onClick={() => onOpen(part.part_key)} disabled={opening !== null}>
            {opening === part.part_key ? <Loader2 className="size-4 animate-spin" /> : <Timer className="size-4" />}
            {t("exercise.live.timedPart.open", "Open Part and Start Timer")}
          </Button>
        </section>
      ))}
    </div>
  );
}
