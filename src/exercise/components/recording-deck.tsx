import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { CirclePause, CirclePlay, Headphones, Loader2, RotateCcw } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { Translate } from "../i18n";
import { errorDetail, errorStatus } from "../lib/api-error";
import { useMediaPlayback, type MediaPlayback } from "../lib/media-playback";
import {
  clampSeek,
  firstPlayCorrection,
  formatClock,
  msUntilClose,
  needsResync,
  offsetFromServerNow,
  playOffsetSeconds,
  stoppedLine,
  stoppedOffsetSeconds,
  windowState,
  type WindowState,
  type WindowTimes,
} from "../lib/media-window";
import { deckRecording, innermostRecording, type DeckRecording } from "../lib/recording-deck";
import { useExerciseTourAnchor } from "../lib/tour-anchors";

const NO_NODES: readonly string[] = [];

// The paper's one recording player. It sits above the page (the runner and the
// teacher preview wrap their shell in it), so a recording keeps playing while
// the student changes page, opens review or the notes. Pages only point at it
// (`PageRecordings`); `RecordingBar` draws it in the shell's bottom bar. Which
// recording it holds is `deckRecording`'s call, and who may play it is the
// playback context's.

export type DeckPhase =
  | "idle" // nothing loaded yet
  | "loading"
  | "playing"
  | "paused" // uncontrolled only
  | "blocked" // the browser refused to autoplay; a tap resumes
  | "error"
  | "done" // controlled: the clip ran to its end
  | "refused"; // the server said there is nothing to play (409)

/** What the active recording's player reports, for the bar and the question cards. */
export interface DeckView {
  /** The recording's id. */
  id: string;
  phase: DeckPhase;
  state: WindowState;
  shown: number;
  length: number;
  /** Where a Stop cut a class run's window off before the clip ended, else null. */
  stoppedAtS: number | null;
  errorText: string;
}

interface DeckActions {
  begin: () => void;
  toggle: () => void;
  scrub: (fraction: number) => void;
  tap: () => void;
  retry: () => void;
}

export interface RecordingDeckValue {
  playback: MediaPlayback;
  recordings: DeckRecording[];
  /** What the player holds — playing, or last played. */
  active: DeckRecording | null;
  /** The innermost recording over the page on screen, shown while nothing plays. */
  current: DeckRecording | null;
  /** The active recording's player, once it has reported. */
  view: DeckView | null;
  /** A question's Play, by recording id: opens a share room's window, or plays/pauses for a teacher. */
  play: (id: string) => void;
  actions: DeckActions;
}

const DeckContext = createContext<RecordingDeckValue | null>(null);

/** The deck above this question, or null where nothing hosts one. */
export function useRecordingDeck(): RecordingDeckValue | null {
  return useContext(DeckContext);
}

export function RecordingDeck({
  recordings,
  currentNodeIds = NO_NODES,
  children,
}: {
  /** Every recording on the paper; memoise it, it is compared by reference. */
  recordings: DeckRecording[];
  /** The questions on screen, for what the bar offers while nothing plays. */
  currentNodeIds?: readonly string[];
  children: ReactNode;
}) {
  const playback = useMediaPlayback();
  const pageKey = currentNodeIds.join("|");
  const current = useMemo(
    () => innermostRecording(recordings, pageKey ? pageKey.split("|") : []),
    [recordings, pageKey],
  );
  const [requested, setRequested] = useState<string | null>(null);
  // The recording a press asked to start, so its player starts once mounted.
  const [startFor, setStartFor] = useState<string | null>(null);
  const [view, setView] = useState<DeckView | null>(null);
  const actionsRef = useRef<DeckActions | null>(null);

  const activeId = deckRecording({
    controlled: playback.controlled,
    selfPaced: playback.selfPaced,
    requested,
    roomWindows: playback.roomWindows,
    ownWindows: playback.ownWindows,
    ids: recordings.map((r) => r.id),
  });
  const active = recordings.find((r) => r.id === activeId) ?? null;

  const actions = useMemo<DeckActions>(
    () => ({
      begin: () => actionsRef.current?.begin(),
      toggle: () => actionsRef.current?.toggle(),
      scrub: (fraction) => actionsRef.current?.scrub(fraction),
      tap: () => actionsRef.current?.tap(),
      retry: () => actionsRef.current?.retry(),
    }),
    [],
  );

  const play = useCallback(
    (id: string) => {
      if (id === activeId) {
        if (playback.controlled) actions.begin();
        else actions.toggle();
        return;
      }
      setRequested(id);
      setStartFor(id);
    },
    [activeId, playback.controlled, actions],
  );

  const shownView = view && active && view.id === active.id ? view : null;
  const value = useMemo<RecordingDeckValue>(
    () => ({ playback, recordings, active, current, view: shownView, play, actions }),
    [playback, recordings, active, current, shownView, play, actions],
  );

  return (
    <DeckContext.Provider value={value}>
      {children}
      {active ? (
        <DeckPlayer
          // A new recording or a new controller is a new player, not a re-wire.
          key={`${active.id}:${active.sourceKey}:${playback.controlled ? "live" : "free"}`}
          recording={active}
          playback={playback}
          startNow={startFor === active.id}
          onView={setView}
          actionsRef={actionsRef}
        />
      ) : null}
    </DeckContext.Provider>
  );
}

// The <audio> element and every playback rule. Memoised so the deck re-rendering
// on its report doesn't re-render this and report again.
const DeckPlayer = memo(function DeckPlayer({
  recording,
  playback,
  startNow,
  onView,
  actionsRef,
}: {
  recording: DeckRecording;
  playback: MediaPlayback;
  startNow: boolean;
  onView: (view: DeckView) => void;
  actionsRef: MutableRefObject<DeckActions | null>;
}) {
  const { t } = useI18n();
  const LOAD_FAILED = t("exercise.recordingBar.loadFailed", "Couldn’t load the recording.");
  // What the playback context resolves and keys windows by.
  const recordingKey = recording.id;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<DeckPhase>("idle");
  const [errorText, setErrorText] = useState(LOAD_FAILED);
  const [position, setPosition] = useState(0);
  const [length, setLength] = useState(recording.durationS);
  // Re-renders at window edges; the value itself is never read.
  const [, setTick] = useState(0);
  // Server minus device, sharpened by each signed URL's own `server_now`.
  const offsetRef = useRef(playback.serverOffsetMs);
  // Our own `currentTime` writes, so `seeking` can tell them from a student's.
  const selfSeekRef = useRef(false);
  const lastSeekReportRef = useRef(0);
  // Which window the player has loaded, by its start, so a replay reloads.
  const loadedForRef = useRef<string | null>(null);
  const retriedRef = useRef(false);
  const startedRef = useRef(false);
  // `playing` events still allowed to re-seek after a (re)load, and the window
  // start that load resolved, which a render may not carry yet.
  const firstPlayRef = useRef(0);
  const anchorRef = useRef<string | null>(null);
  // Set from this player's own resolve, so it plays before the context
  // re-renders with the window.
  const [ownWindow, setOwnWindow] = useState<WindowTimes | null>(null);

  useEffect(() => {
    offsetRef.current = playback.serverOffsetMs;
  }, [playback.serverOffsetMs]);

  const serverNow = () => Date.now() + offsetRef.current;

  const win: WindowTimes | null = !playback.controlled
    ? null
    : playback.selfPaced
      ? (ownWindow ?? playback.ownWindows[recordingKey] ?? null)
      : (playback.roomWindows[recordingKey] ?? null);
  const state = windowState(win, serverNow());
  const expected = useCallback(
    () => (win ? clampSeek(playOffsetSeconds(Date.now() + offsetRef.current, win.startedAt), length) : 0),
    [win, length],
  );

  const seekTo = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    selfSeekRef.current = true;
    audio.currentTime = seconds;
  };

  // Load a URL and wait until the clip's length is known, so a seek lands.
  const load = (url: string) =>
    new Promise<void>((resolve, reject) => {
      const audio = audioRef.current;
      if (!audio) return reject(new Error(LOAD_FAILED));
      const done = () => {
        audio.removeEventListener("loadedmetadata", done);
        audio.removeEventListener("error", fail);
        resolve();
      };
      const fail = () => {
        audio.removeEventListener("loadedmetadata", done);
        audio.removeEventListener("error", fail);
        reject(new Error(LOAD_FAILED));
      };
      audio.addEventListener("loadedmetadata", done);
      audio.addEventListener("error", fail);
      audio.src = url;
      audio.load();
    });

  const playNow = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setPhase("playing");
    } catch (err) {
      setPhase(err instanceof DOMException && err.name === "NotAllowedError" ? "blocked" : "error");
    }
  };

  // Controlled: fetch this window's URL, land at the room's offset and play. A
  // controlled resolve is a fresh request every time, so a retry is just this.
  const begin = async () => {
    setPhase("loading");
    try {
      const resolved = await playback.resolve(recordingKey);
      const now = Date.now();
      offsetRef.current =
        resolved.offsetMs ??
        offsetFromServerNow(
          resolved.serverNow,
          resolved.timing ?? { sentAtMs: now, receivedAtMs: now },
          offsetRef.current,
        );
      if (playback.selfPaced && resolved.startedAt && resolved.endsAt) {
        loadedForRef.current = resolved.startedAt;
        setOwnWindow({ startedAt: resolved.startedAt, endsAt: resolved.endsAt, stoppedAt: null });
      }
      await load(resolved.url);
      anchorRef.current = resolved.startedAt ?? win?.startedAt ?? null;
      const start = resolved.startedAt
        ? clampSeek(playOffsetSeconds(serverNow(), resolved.startedAt), length)
        : expected();
      seekTo(start);
      // Two: the correcting seek can buffer again before its own first frame.
      firstPlayRef.current = 2;
      await playNow();
    } catch (err) {
      setPhase(errorStatus(err) === 409 ? "refused" : "error");
    }
  };

  // Uncontrolled: play / pause at will.
  const toggle = async (fresh = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (phase === "playing") {
      audio.pause();
      return;
    }
    if (audio.src) {
      await playNow();
      return;
    }
    setPhase("loading");
    try {
      const { url } = await playback.resolve(recordingKey, fresh);
      await load(url);
      await playNow();
    } catch (err) {
      // The server's reason, or the context's own ("Save the question…").
      setErrorText(
        errorStatus(err) !== null
          ? (errorDetail(err) ?? LOAD_FAILED)
          : err instanceof Error && err.message
            ? err.message
            : LOAD_FAILED,
      );
      setPhase("error");
    }
  };

  const scrub = (fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.src || playback.controlled) return;
    const target = clampSeek(fraction * length, length);
    seekTo(target);
    setPosition(target);
  };

  // A question's Play mounted this player: start it once (StrictMode re-runs
  // effects; the ref survives that).
  useEffect(() => {
    if (!startNow || startedRef.current) return;
    startedRef.current = true;
    if (playback.controlled) void begin();
    else void toggle();
  }, []);

  // A window opening (the teacher pressed Play, or a refresh mid-window) starts
  // the player; a new start is a replay and reloads it.
  useEffect(() => {
    if (!playback.controlled || !win || state !== "playing") return;
    if (loadedForRef.current === win.startedAt) return;
    loadedForRef.current = win.startedAt;
    // `begin` reads the latest render; the window's start is what matters.
    void begin();
  }, [playback.controlled, win?.startedAt, state]);

  // Stop at the window's close (or the teacher's Stop), and re-render on time.
  useEffect(() => {
    if (!playback.controlled || !win) return;
    if (state === "playing") {
      const id = window.setTimeout(() => setTick((n) => n + 1), msUntilClose(win, serverNow()) + 50);
      return () => window.clearTimeout(id);
    }
    if (state === "waiting") {
      const startsIn = Date.parse(win.startedAt) - serverNow();
      if (startsIn > 0) {
        const id = window.setTimeout(() => setTick((n) => n + 1), startsIn + 50);
        return () => window.clearTimeout(id);
      }
    }
    if (state === "ended") audioRef.current?.pause();
  }, [playback.controlled, win?.startedAt, win?.endsAt, win?.stoppedAt, state]);

  // Leaving the deck (submit, exit, another recording) silences this one.
  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  // The first frame after a (re)load: buffering since the seek left a cold
  // player behind the room by up to ~2s, under the drift tolerance.
  const onPlaying = () => {
    const audio = audioRef.current;
    if (!audio || !playback.controlled || firstPlayRef.current <= 0) return;
    firstPlayRef.current -= 1;
    const anchor = anchorRef.current;
    const target = anchor ? playOffsetSeconds(serverNow(), anchor) : expected();
    const jump = firstPlayCorrection(audio.currentTime, target, length);
    if (jump === null) {
      firstPlayRef.current = 0;
      return;
    }
    seekTo(jump);
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setPosition(audio.currentTime);
    if (playback.controlled && state === "playing" && !audio.paused) {
      const target = expected();
      if (needsResync(audio.currentTime, target)) seekTo(target);
    }
  };

  // A seek we did not make: snap back and tell the teacher, once per gesture.
  const onSeeking = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (selfSeekRef.current) {
      selfSeekRef.current = false;
      return;
    }
    if (!playback.controlled) return;
    const target = expected();
    const attempted = audio.currentTime;
    if (!needsResync(attempted, target, 1)) return;
    seekTo(target);
    const now = Date.now();
    if (now - lastSeekReportRef.current > 1_500) {
      lastSeekReportRef.current = now;
      playback.reportSeek?.(recordingKey, Math.round(target), Math.round(attempted));
    }
  };

  const onPause = () => {
    // The clip running out fires `pause` too; `onEnded` handles that.
    if (audioRef.current?.ended) return;
    // Paused by the student (a media key, the OS) while the room plays on.
    if (playback.controlled && state === "playing" && phase === "playing") setPhase("blocked");
    if (!playback.controlled && phase === "playing") setPhase("paused");
  };

  const onError = async () => {
    if (phase === "loading" || phase === "idle") return; // `load` reports these
    if (playback.controlled) {
      setPhase("error");
      return;
    }
    // A teacher's URL has most likely expired: fetch a fresh one once and
    // carry on from where it was.
    if (retriedRef.current) {
      setPhase("error");
      return;
    }
    retriedRef.current = true;
    const at = audioRef.current?.currentTime ?? 0;
    try {
      const { url } = await playback.resolve(recordingKey, true);
      await load(url);
      seekTo(at);
      await playNow();
    } catch {
      setPhase("error");
    }
  };

  // The bar's buttons call the latest render's handlers.
  useEffect(() => {
    actionsRef.current = {
      begin: () => void begin(),
      toggle: () => void toggle(),
      scrub,
      tap: () => {
        seekTo(expected());
        firstPlayRef.current = 2;
        void playNow();
      },
      retry: () => {
        if (playback.controlled) {
          void begin();
          return;
        }
        retriedRef.current = false;
        audioRef.current?.removeAttribute("src");
        void toggle(true);
      },
    };
  });
  useEffect(
    () => () => {
      actionsRef.current = null;
    },
    [actionsRef],
  );

  // Only a class run is stopped by someone else; a share room's window just ends.
  const stoppedAtS =
    playback.controlled && !playback.selfPaced && state === "ended" && phase !== "done"
      ? stoppedOffsetSeconds(win, length)
      : null;
  // A closed window reads as the whole clip (or up to its Stop), even after a
  // reload that never played it.
  const shown = !playback.controlled
    ? position
    : state === "ended" || phase === "done" || phase === "refused"
      ? (stoppedAtS ?? length)
      : win && state === "playing" && phase !== "playing"
        ? expected()
        : position;
  // Tenths are plenty for a clock in whole seconds, and stop a report per render.
  const reported = Math.round(shown * 10) / 10;
  const reportedStop = stoppedAtS === null ? null : Math.round(stoppedAtS * 10) / 10;

  useEffect(() => {
    onView({ id: recordingKey, phase, state, shown: reported, length, stoppedAtS: reportedStop, errorText });
  }, [onView, recordingKey, phase, state, reported, length, reportedStop, errorText]);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      controlsList="nodownload noplaybackrate"
      onTimeUpdate={onTimeUpdate}
      onSeeking={onSeeking}
      onPause={onPause}
      onPlay={() => setPhase("playing")}
      onPlaying={onPlaying}
      onEnded={() => setPhase(playback.controlled ? "done" : "paused")}
      onError={() => void onError()}
      onLoadedMetadata={(event) => {
        const seconds = event.currentTarget.duration;
        if (Number.isFinite(seconds) && seconds > 0) setLength(seconds);
      }}
      onContextMenu={(event) => event.preventDefault()}
      className="hidden"
    />
  );
});

/** True once a controlled recording has had its window, whether or not it played here. */
export function recordingOver(view: DeckView | null): boolean {
  return !!view && (view.state === "ended" || view.phase === "done" || view.phase === "refused");
}

function statusLine(playback: MediaPlayback, view: DeckView | null, t: Translate): string {
  const phase = view?.phase ?? "idle";
  const playing = () => t("exercise.recordingBar.playing", "Playing");
  const loading = () => t("exercise.recordingBar.loading", "Loading");
  const paused = () => t("exercise.recordingBar.paused", "Paused");
  if (!playback.controlled) {
    if (phase === "playing") return playing();
    if (phase === "loading") return loading();
    return phase === "paused" ? paused() : t("exercise.recordingBar.ready", "Ready to play");
  }
  if (recordingOver(view)) {
    if (playback.selfPaced) return t("exercise.recordingBar.played", "Played");
    return view?.stoppedAtS != null
      ? t("exercise.recordingBar.stopped", "Stopped")
      : t("exercise.recordingBar.finished", "Finished");
  }
  if ((view?.state ?? "waiting") === "waiting") return t("exercise.recordingBar.starting", "Starting");
  if (phase === "loading" || phase === "idle") return loading();
  return phase === "playing" ? playing() : paused();
}

/** Whether the player is mid-recording, so the bar keeps it whatever the page. */
export function recordingInProgress(view: DeckView | null): boolean {
  if (!view || recordingOver(view)) return false;
  return view.state === "playing" || ["loading", "playing", "blocked", "error", "paused"].includes(view.phase);
}

const BAR = "overflow-hidden rounded-xl bg-player text-player-foreground";
const LIGHT_BUTTON =
  "h-8 shrink-0 bg-player-foreground px-3 text-xs text-player shadow-none hover:bg-player-foreground/90";

// The strip in the runner's bottom bar: one row over a progress line, sized to
// sit above Previous/Next on a 390px phone. It shows what is playing; otherwise
// the innermost recording over the page on screen; otherwise nothing.
// `bg-player`, not `ink-900`: the ink ramp flips in dark mode, and this well is
// dark in both.
export function RecordingBar({ className, numbered = true }: { className?: string; numbered?: boolean }) {
  const deck = useRecordingDeck();
  if (!deck) return null;
  const { active, current, view } = deck;
  if (active && (recordingInProgress(view) || current?.id === active.id)) {
    return <ActiveBar deck={deck} active={active} className={className} numbered={numbered} />;
  }
  if (current) return <IdleBar deck={deck} recording={current} className={className} numbered={numbered} />;
  return null;
}

// A recording the page plays with, before (or after) its turn. A teacher can
// start it here; a student's play is the teacher's, or the page's Play button.
function IdleBar({
  deck,
  recording,
  className,
  numbered,
}: {
  deck: RecordingDeckValue;
  recording: DeckRecording;
  className?: string;
  numbered: boolean;
}) {
  const { t } = useI18n();
  const anchor = useExerciseTourAnchor("recording");
  const { playback, play } = deck;
  const free = !playback.controlled;
  const win = playback.selfPaced ? playback.ownWindows[recording.id] : playback.roomWindows[recording.id];
  const over = !free && windowState(win, Date.now() + playback.serverOffsetMs) === "ended";
  const length = formatClock(recording.durationS);
  const stopped = over && !playback.selfPaced ? stoppedOffsetSeconds(win, recording.durationS) : null;
  const stoppedFraction =
    stopped !== null && recording.durationS > 0 ? Math.min(1, stopped / recording.durationS) : 1;
  const message = free
    ? t("exercise.recordingBar.readyLength", "Ready to play · 0:00 / {length}", { length })
    : over
      ? (stoppedLine(stopped, recording.durationS, t) ??
        (playback.selfPaced
          ? t("exercise.recordingBar.playedLength", "Played · {length}", { length })
          : t("exercise.recordingBar.finishedLength", "Finished · {length}", { length })))
      : playback.selfPaced
        ? t("exercise.recordingBar.notPlayed", "Not played yet · {length} · plays once", { length })
        : t("exercise.recordingBar.teacherPlays", "Your teacher plays this · {length}", { length });
  return (
    <div
      role="region"
      aria-label={t("exercise.recordingBar.recording", "Recording")}
      className={cn(BAR, className)}
      {...anchor}
    >
      <div className="flex items-center gap-3 px-3 py-1.5">
        {free ? (
          <Button
            type="button"
            size="icon"
            aria-label={t("exercise.recordingBar.play", "Play")}
            className="size-8 shrink-0 bg-player-foreground text-player shadow-none hover:bg-player-foreground/90"
            onClick={() => play(recording.id)}
          >
            <CirclePlay className="size-4" />
          </Button>
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-player-foreground/10">
            <Headphones className="size-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">
            {numbered && recording.label ? `${recording.label} · ` : ""}
            {recording.title}
          </p>
          <p className="truncate text-xs font-semibold tabular-nums text-player-foreground/70">{message}</p>
        </div>
      </div>
      <div className="h-1.5 bg-player-foreground/15">
        <div className="h-full bg-primary" style={{ width: over ? `${stoppedFraction * 100}%` : "0%" }} />
      </div>
    </div>
  );
}

function ActiveBar({
  deck,
  active,
  className,
  numbered,
}: {
  deck: RecordingDeckValue;
  active: DeckRecording;
  className?: string;
  numbered: boolean;
}) {
  const { t } = useI18n();
  const anchor = useExerciseTourAnchor("recording");
  const { view, playback, actions } = deck;
  const free = !playback.controlled;
  const phase = view?.phase ?? "idle";
  const length = view?.length ?? active.durationS;
  const shown = view?.shown ?? 0;
  const fraction = length > 0 ? Math.min(1, shown / length) : 0;
  const over = recordingOver(view);
  const failed = phase === "error" && !over;
  const light = LIGHT_BUTTON;

  const message = failed
    ? free
      ? `${view?.errorText ?? t("exercise.recordingBar.loadFailed", "Couldn’t load the recording.")}`
      : t("exercise.recordingBar.playFailed", "Couldn’t play the recording. Try again, or tell your teacher if it keeps failing.")
    : `${statusLine(playback, view, t)} · ${formatClock(shown)} / ${formatClock(length)}`;

  return (
    <div
      role="region"
      aria-label={t("exercise.recordingBar.recording", "Recording")}
      className={cn(BAR, className)}
      {...anchor}
    >
      <div className="flex items-center gap-3 px-3 py-1.5">
        {free ? (
          <Button
            type="button"
            size="icon"
            aria-label={phase === "playing" ? t("exercise.recordingBar.pause", "Pause") : t("exercise.recordingBar.play", "Play")}
            className="size-8 shrink-0 bg-player-foreground text-player shadow-none hover:bg-player-foreground/90"
            onClick={actions.toggle}
            disabled={phase === "loading"}
          >
            {phase === "loading" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : phase === "playing" ? (
              <CirclePause className="size-4" />
            ) : (
              <CirclePlay className="size-4" />
            )}
          </Button>
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-player-foreground/10">
            {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Headphones className="size-4" />}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">
            {numbered && active.label ? `${active.label} · ` : ""}
            {active.title}
          </p>
          <p className={cn("text-xs font-semibold text-player-foreground/70", !failed && "truncate tabular-nums")}>
            {message}
          </p>
        </div>
        {failed ? (
          <Button type="button" size="sm" className={light} onClick={actions.retry}>
            <RotateCcw className="size-4" />
            {t("exercise.recordingBar.tryAgain", "Try Again")}
          </Button>
        ) : !free && phase === "blocked" && !over ? (
          <Button type="button" size="sm" className={light} onClick={actions.tap}>
            <CirclePlay className="size-4" />
            {t("exercise.recordingBar.tapToListen", "Tap to Listen")}
          </Button>
        ) : null}
      </div>
      <div
        className={cn("h-1.5 bg-player-foreground/15", free && "cursor-pointer")}
        onClick={(event) => {
          if (!free) return;
          const box = event.currentTarget.getBoundingClientRect();
          actions.scrub((event.clientX - box.left) / box.width);
        }}
        role={free ? "slider" : undefined}
        aria-label={free ? t("exercise.recordingBar.position", "Position") : undefined}
        aria-valuemin={free ? 0 : undefined}
        aria-valuemax={free ? Math.round(length) : undefined}
        aria-valuenow={free ? Math.round(shown) : undefined}
        tabIndex={free ? 0 : undefined}
        onKeyDown={(event) => {
          if (!free) return;
          if (event.key === "ArrowRight") actions.scrub((shown + 5) / length);
          if (event.key === "ArrowLeft") actions.scrub((shown - 5) / length);
        }}
      >
        <div className="h-full bg-primary" style={{ width: `${fraction * 100}%` }} />
      </div>
    </div>
  );
}
