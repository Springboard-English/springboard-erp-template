import { useEffect, useRef, useState } from "react";
import { ChevronDown, ScrollText } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { touchTarget } from "../../lib/touchTarget";
import { cn } from "../../lib/utils";
import { coveringRecordings, type DeckRecording } from "../lib/recording-deck";
import { activeCueIndex, cueClock, type TranscriptContent } from "../lib/transcript";
import type { TranscriptCue } from "../types";

import { useRecordingDeck, type RecordingDeckValue } from "./recording-deck";

/**
 * The transcripts of the recordings over this page, one panel each, under the
 * page's recording lines. Only where the deck plays at will (a review, a
 * teacher): a live sitting never has a transcript to show, and its clock is
 * the server's, so a line could not seek it anyway.
 */
export function PageTranscripts({
  nodeIds,
  transcripts,
  className,
}: {
  nodeIds: readonly string[];
  /** By recording key. A recording without an entry, or with `none`, shows nothing. */
  transcripts: ReadonlyMap<string, TranscriptContent>;
  className?: string;
}) {
  const deck = useRecordingDeck();
  if (!deck || deck.playback.controlled) return null;
  const shown = coveringRecordings(deck.recordings, nodeIds).filter(
    (recording) => (transcripts.get(recording.id)?.kind ?? "none") !== "none",
  );
  if (shown.length === 0) return null;
  return (
    <div className={cn("space-y-2", className)}>
      {shown.map((recording) => (
        <RecordingTranscript
          key={recording.id}
          deck={deck}
          recording={recording}
          content={transcripts.get(recording.id)!}
        />
      ))}
    </div>
  );
}

/**
 * One recording's transcript. Timed lines light up as they are spoken and
 * scroll into view inside the panel; pressing one plays the recording from
 * that line. Plain text is printed as it was typed.
 */
function RecordingTranscript({
  deck,
  recording,
  content,
}: {
  deck: RecordingDeckValue;
  recording: DeckRecording;
  content: TranscriptContent;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);
  const isActive = deck.active?.id === recording.id;
  const view = isActive ? deck.view : null;
  const cues = content.kind === "timed" ? content.cues : [];
  // Lit only once this recording has been started: before that, nothing is "being said".
  const lit = view && view.phase !== "idle" ? activeCueIndex(cues, view.shown) : -1;

  // A line pressed before its recording was loaded: seek once it plays.
  const pendingRef = useRef<number | null>(null);
  const length = view?.length || recording.durationS;
  useEffect(() => {
    if (pendingRef.current === null || !view || view.phase !== "playing" || length <= 0) return;
    deck.actions.scrub(pendingRef.current / length);
    pendingRef.current = null;
  }, [deck.actions, view, length]);

  const playFrom = (cue: TranscriptCue) => {
    if (!isActive || !view || view.phase === "idle" || view.phase === "error") {
      pendingRef.current = cue.start_s;
      deck.play(recording.id);
      return;
    }
    if (length > 0) deck.actions.scrub(cue.start_s / length);
    if (view.phase === "paused") deck.actions.toggle();
  };

  // The lit line kept in view inside the panel's own scroller, never by
  // scrolling the page, which would pull the student off the question.
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    const line = lit >= 0 ? list?.children[lit] : null;
    if (!list || !(line instanceof HTMLElement)) return;
    const top = line.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + line.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: Math.max(0, top - list.clientHeight / 3), behavior: "smooth" });
    }
  }, [lit]);

  return (
    <section className="rounded-2xl border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-bold text-foreground",
          touchTarget,
        )}
      >
        <ScrollText className="size-4 shrink-0 text-sky-700" />
        <span className="min-w-0 flex-1 truncate">
          {t("exercise.transcript.title", "Transcript")} · {recording.title}
        </span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && content.kind === "plain" ? (
        <p className="max-h-72 overflow-y-auto whitespace-pre-line border-t px-4 py-3 text-sm leading-6 text-foreground">
          {content.text}
        </p>
      ) : null}
      {open && content.kind === "timed" ? (
        <ol ref={listRef} className="relative max-h-72 overflow-y-auto border-t py-1">
          {cues.map((cue, index) => (
            <li key={`${cue.start_s}:${index}`}>
              <button
                type="button"
                onClick={() => playFrom(cue)}
                aria-current={index === lit ? "true" : undefined}
                className={cn(
                  "flex w-full items-baseline gap-3 px-4 py-1.5 text-left text-sm leading-6 transition-colors hover:bg-muted/60",
                  index === lit && "bg-sky-bg text-sky-700",
                )}
              >
                <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {cueClock(cue.start_s)}
                </span>
                <span className="min-w-0 flex-1">
                  {cue.speaker ? <span className="font-bold">{cue.speaker}: </span> : null}
                  {cue.text}
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
