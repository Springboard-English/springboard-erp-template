import type { ReactNode } from "react";
import { Check, CirclePause, CirclePlay, Headphones, Loader2 } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { formatClock, stoppedLine, stoppedOffsetSeconds, windowState } from "../lib/media-window";
import { coveringRecordings, type DeckRecording } from "../lib/recording-deck";

import { recordingOver, useRecordingDeck, type RecordingDeckValue } from "./recording-deck";

// What the recordings over this page are doing, one line each, at the top of
// the page. Every recording — the whole test's, a part's or section's, one
// question's — reports here rather than in the part heading or a question's
// card: the section layouts (cloze, gapped text, matching…) draw no per-question
// card, and one place reads the same whatever owns the audio. A share room's
// "Play recording (plays once)" lives here because pressing it spends the play,
// so it sits on the page it belongs to; the bar below does the playing.
export function PageRecordings({
  nodeIds,
  className,
}: {
  nodeIds: readonly string[];
  className?: string;
}) {
  const deck = useRecordingDeck();
  if (!deck) return null;
  const covering = coveringRecordings(deck.recordings, nodeIds);
  if (covering.length === 0) return null;
  return (
    <div className={cn("space-y-2", className)}>
      {covering.map((recording) => (
        <RecordingStatus key={recording.id} recording={recording} deck={deck} />
      ))}
    </div>
  );
}

function StatusRow({
  recording,
  children,
  action,
}: {
  recording: DeckRecording;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-sky-bg px-4 py-2.5 text-sm font-bold text-sky-700">
      <Headphones className="size-5 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block truncate">
          {recording.label ? `${recording.label} · ` : ""}
          {recording.title}
        </span>
        <span className="block text-xs font-semibold">{children}</span>
      </span>
      {action}
    </div>
  );
}

function RecordingStatus({ recording, deck }: { recording: DeckRecording; deck: RecordingDeckValue }) {
  const { t } = useI18n();
  const { playback, view, play } = deck;
  const id = recording.id;
  const isActive = deck.active?.id === id;
  const mine = isActive ? view : null;
  const phase = mine?.phase ?? "idle";
  const length = formatClock(mine?.length ?? recording.durationS);

  if (!playback.controlled) {
    const playing = isActive && phase === "playing";
    return (
      <StatusRow
        recording={recording}
        action={
          <Button type="button" size="sm" onClick={() => play(id)} disabled={isActive && phase === "loading"}>
            {isActive && phase === "loading" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : playing ? (
              <CirclePause className="size-4" />
            ) : (
              <CirclePlay className="size-4" />
            )}
            {playing ? t("exercise.pageRecording.pause", "Pause") : t("exercise.pageRecording.play", "Play")}
          </Button>
        }
      >
        {playing
          ? t("exercise.pageRecording.playingBelow", "Playing in the bar below")
          : t("exercise.pageRecording.playsBelow", "Plays in the bar below · {length}", { length })}
      </StatusRow>
    );
  }

  const win = playback.selfPaced ? playback.ownWindows[id] : playback.roomWindows[id];
  const over =
    (isActive && recordingOver(mine)) || windowState(win, Date.now() + playback.serverOffsetMs) === "ended";
  if (over) {
    const lengthS = mine?.length ?? recording.durationS;
    const stopped = playback.selfPaced
      ? null
      : isActive && mine
        ? mine.stoppedAtS
        : stoppedOffsetSeconds(win, lengthS);
    return (
      <StatusRow recording={recording} action={<Check className="size-5 shrink-0" />}>
        {playback.selfPaced
          ? t("exercise.pageRecording.played", "Played")
          : (stoppedLine(stopped, lengthS, t) ?? t("exercise.pageRecording.finished", "Finished"))}
      </StatusRow>
    );
  }
  if (isActive && phase !== "idle") {
    const line =
      phase === "blocked"
        ? t("exercise.pageRecording.tapToListen", "Tap to listen in the bar below")
        : phase === "error"
          ? t("exercise.pageRecording.couldNotPlay", "Couldn’t play — try again in the bar below")
          : phase === "loading"
            ? t("exercise.pageRecording.starting", "Starting the recording…")
            : t("exercise.pageRecording.playingBelow", "Playing in the bar below");
    return <StatusRow recording={recording}>{line}</StatusRow>;
  }
  if (!playback.selfPaced) {
    return (
      <StatusRow recording={recording}>
        {t("exercise.pageRecording.teacherPlays", "Your teacher plays this in the bar below · {length}", { length })}
      </StatusRow>
    );
  }
  // Another recording still running would be cut off, and its play spent.
  const busy =
    !isActive && !!view && !recordingOver(view) && (view.phase === "playing" || view.phase === "loading");
  return (
    <StatusRow
      recording={recording}
      action={
        <Button type="button" size="sm" onClick={() => play(id)} disabled={busy}>
          <CirclePlay className="size-4" />
          {t("exercise.pageRecording.playOnce", "Play recording (plays once)")}
        </Button>
      }
    >
      {busy
        ? t("exercise.pageRecording.anotherPlaying", "Another recording is playing")
        : t("exercise.pageRecording.playsBelow", "Plays in the bar below · {length}", { length })}
    </StatusRow>
  );
}
