import { useEffect, useState } from "react";
import { Hourglass, Loader2, Timer } from "lucide-react";
import { Button } from "../../exports";
import { formatClock } from "../lib/media-window";

import type { RunPart } from "./api";
import { useStableI18n } from "./i18n";
import { cn } from "../../lib/utils";

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

/** Which stretch of an opened timed part the clock is in, and the seconds left in it. */
export interface PartClockState {
  stage: "prepare" | "answer" | "over";
  secondsLeft: number;
}

/**
 * Where an opened timed part's clock stands at `nowMs` (server time): preparing
 * until `prep_ends_at`, then answering until `deadline_at`, then over. Null for
 * a part that is untimed or not opened.
 */
export function partClockState(part: RunPart | null | undefined, nowMs: number): PartClockState | null {
  if (!part?.opened_at || !(part.time_limit_seconds || part.preparation_seconds)) return null;
  // Floored, as the speaking recorder's countdown is, so the two never disagree by a second.
  const left = (iso: string) => Math.max(0, Math.floor((Date.parse(iso) - nowMs) / 1000));
  if (part.prep_ends_at && left(part.prep_ends_at) > 0) return { stage: "prepare", secondsLeft: left(part.prep_ends_at) };
  if (part.deadline_at && left(part.deadline_at) > 0) return { stage: "answer", secondsLeft: left(part.deadline_at) };
  if (!part.deadline_at) return null;
  return { stage: "over", secondsLeft: 0 };
}

/**
 * The open timed part's own countdown, a slim line above its questions inside
 * the runner: preparation, then answering, then time up. `serverNow` reads the
 * server's clock, so a skewed device clock can't move it.
 */
export function PartClock({ part, serverNow }: { part: RunPart; serverNow: () => number }) {
  const { t } = useStableI18n();
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    setNow(serverNow());
    const id = window.setInterval(() => setNow(serverNow()), 1000);
    return () => window.clearInterval(id);
  }, [serverNow]);
  const state = partClockState(part, now);
  if (!state) return null;
  const urgent = state.stage === "answer" && state.secondsLeft <= 30;
  const title = part.title || t("exercise.live.timedPart.untitled", "Part {n}", { n: part.order + 1 });
  return (
    <div
      role="timer"
      aria-live="off"
      className={cn(
        "mb-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-sm font-bold",
        state.stage === "over" || urgent ? "border-rose-300 bg-rose-50 text-rose-700" : "bg-card text-foreground",
      )}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        {state.stage === "prepare" ? <Hourglass className="size-4 shrink-0" /> : <Timer className="size-4 shrink-0" />}
        <span className="truncate">{title}</span>
      </span>
      <span className="shrink-0 tabular-nums">
        {state.stage === "prepare"
          ? t("exercise.live.timedPart.prepareLeft", "Preparation · {time}", { time: formatClock(state.secondsLeft) })
          : state.stage === "answer"
            ? t("exercise.live.timedPart.answerLeft", "Time left · {time}", { time: formatClock(state.secondsLeft) })
            : t("exercise.live.timedPart.over", "Time is up for this part")}
      </span>
    </div>
  );
}
