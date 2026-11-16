import { useEffect, useRef, useState } from "react";
import { CircleAlert, Hourglass, Loader2, Mic, RotateCcw, Square } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { useAnswerFiles, type FinishRecording } from "../lib/answer-files";
import { fileAnswerKey, type ExerciseNode } from "../lib/exercises";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";
import { EditablePrompt, useExerciseEditor } from "./exercise-edit";
import { formatClock } from "../lib/media-window";
import { pickRecordingType, secondsUntil, takeEndsAt, uploadType, windowStage } from "../lib/recorder";

import { formatStamp } from "./essay-response";
import { Frame, type SubProps } from "./frame";
import { DrawnTopic, TopicPoolPrompts, useTopicPool } from "./topic-pool";

type SpeakingNode = Extract<ExerciseNode, { type: "speaking" }>;

type Phase = "idle" | "starting" | "recording" | "sending" | "error";

// The ring around the button: its radius in a 112-unit box, and its length.
const RING_R = 52;
const RING_LENGTH = 2 * Math.PI * RING_R;

/**
 * A speaking question: the prompt, and one round button in the middle that runs
 * the take. In a timed part the server's clock drives it: preparation counts
 * down from the part's opening, recording starts by itself when it ends (for
 * the question the runner marks), and every take stops and hands in at the
 * part's deadline or the question's longest take. Without the runner's
 * `beginRecording` the prompt shows alone. In a topic pool the prompt is the
 * topic the attempt drew, set apart as "Your topic"; the editor shows the
 * pool's whole list there instead.
 */
export function SpeakingResponse({ node, mode, value, onChange }: SubProps<SpeakingNode>) {
  const { t } = useI18n();
  const files = useAnswerFiles();
  const pool = useTopicPool();
  const editing = Boolean(useExerciseEditor());
  const file = files.file(node.id);
  const handedIn = Boolean(fileAnswerKey(value));
  const partClock = files.recordingWindow?.(node.id);
  const serverNow = files.serverNow ?? Date.now;
  const canRecord = mode === "practice" && Boolean(files.beginRecording);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [takeStartedAt, setTakeStartedAt] = useState(0);
  const [now, setNow] = useState(() => serverNow());
  const [takeUrl, setTakeUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const autoStartedRef = useRef(false);

  const stage = partClock ? windowStage(partClock, now) : "open";
  const takeEnd = phase === "recording" ? takeEndsAt(takeStartedAt, node.content.max_seconds, partClock?.deadlineAt) : null;
  const startBlocked = files.canStartRecording === false || stage !== "open";

  // Let go of the microphone and the last take when the question unmounts.
  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
      recorder?.stream.getTracks().forEach((track) => track.stop());
    },
    [],
  );
  useEffect(() => () => { if (takeUrl) URL.revokeObjectURL(takeUrl); }, [takeUrl]);

  // One clock: it moves the preparation countdown, and stops a take at its end.
  const ticking = phase === "recording" || stage === "preparing" || (partClock && stage === "open" && !handedIn);
  useEffect(() => {
    if (!ticking) return;
    const id = globalThis.setInterval(() => {
      const at = serverNow();
      setNow(at);
      if (takeEnd !== null && at >= takeEnd) recorderRef.current?.stop();
    }, 200);
    return () => globalThis.clearInterval(id);
  }, [ticking, takeEnd, serverNow]);

  // Preparation over: the marked question records by itself, once.
  useEffect(() => {
    if (!canRecord || !partClock?.autoStart || autoStartedRef.current || handedIn) return;
    if (stage !== "open" || phase !== "idle" || files.canStartRecording === false) return;
    autoStartedRef.current = true;
    void record();
    // `record` reads only refs and state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRecord, partClock?.autoStart, stage, phase, handedIn, files.canStartRecording]);

  const fail = (cause: unknown) => {
    setError(recordError(cause, t));
    setPhase("error");
  };

  /** Opens the microphone, asks the API for the take's upload slot, then records into it. */
  async function record() {
    if (!files.beginRecording) return;
    setError("");
    setPhase("starting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (cause) {
      fail(cause);
      return;
    }
    const type = typeof MediaRecorder.isTypeSupported === "function" ? pickRecordingType((candidate) => MediaRecorder.isTypeSupported(candidate)) : "";
    let finish: FinishRecording;
    try {
      // Asked before the first word, so a take can't start after time is up.
      finish = await files.beginRecording(node.id, uploadType(type));
    } catch (cause) {
      stream.getTracks().forEach((track) => track.stop());
      fail(cause);
      return;
    }
    const recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const take = new Blob(chunks, { type: uploadType(recorder.mimeType || type) });
      setTakeUrl(URL.createObjectURL(take));
      setPhase("sending");
      finish(take)
        .then((fileKey) => {
          onChange?.({ file_key: fileKey });
          setPhase("idle");
        })
        .catch(fail);
    };
    recorderRef.current = recorder;
    recorder.start(1000);
    const at = serverNow();
    setTakeStartedAt(at);
    setNow(at);
    setPhase("recording");
  }

  const busy = phase === "starting" || phase === "sending";
  const preparing = stage === "preparing" && phase === "idle";
  // The ring: preparation draining towards the start, or the take draining towards its end.
  const ring = preparing && partClock?.openedAt && partClock.prepEndsAt
    ? { left: secondsUntil(Date.parse(partClock.prepEndsAt), now), total: (Date.parse(partClock.prepEndsAt) - Date.parse(partClock.openedAt)) / 1000 }
    : phase === "recording" && takeEnd !== null
      ? { left: secondsUntil(takeEnd, now), total: (takeEnd - takeStartedAt) / 1000 }
      : null;
  const clock = preparing && partClock?.prepEndsAt
    ? formatClock(Math.ceil(secondsUntil(Date.parse(partClock.prepEndsAt), now)))
    : phase === "recording"
      ? formatClock(takeEnd !== null ? Math.ceil(secondsUntil(takeEnd, now)) : (now - takeStartedAt) / 1000)
      : null;
  const press = () => {
    if (phase === "recording") recorderRef.current?.stop();
    else if (!busy && !startBlocked) void record();
  };
  const buttonLabel =
    phase === "recording"
      ? t("exercise.speaking.stop", "Stop and Hand In")
      : preparing
        ? t("exercise.speaking.preparingLabel", "Preparing")
        : handedIn
          ? t("exercise.speaking.again", "Record Again")
          : t("exercise.speaking.record", "Start Recording");
  const limit = node.content.max_seconds;
  const status =
    preparing
      ? partClock?.autoStart
        ? t("exercise.speaking.preparing", "Prepare your answer. Recording starts on its own.")
        : t("exercise.speaking.preparingPress", "Prepare your answer. You can record when the time is up.")
      : phase === "recording"
        ? takeEnd !== null
          ? t("exercise.speaking.recordingLeft", "Recording. It stops and hands in when the time runs out.")
          : t("exercise.speaking.recordingOpen", "Recording. Press the button when you finish.")
        : phase === "starting"
          ? t("exercise.speaking.starting", "Getting ready to record…")
          : phase === "sending"
            ? t("exercise.speaking.sending", "Handing in your recording…")
            : (stage === "over" || files.canStartRecording === false) && handedIn
              ? // Closed with a take in: say it went in, not only that time is up.
                file?.handedInAt
                ? t("exercise.speaking.handedInAt", "Recording handed in {time}.", { time: formatStamp(file.handedInAt) })
                : t("exercise.speaking.handedInClosed", "Your recording is handed in.")
              : stage === "over"
              ? t("exercise.speaking.partOver", "Time is up for this part.")
              : files.canStartRecording === false
                ? t("exercise.speaking.timeUp", "Time is up, so no new recording can start.")
                : file?.handedInAt
                  ? t("exercise.speaking.handedInAt", "Recording handed in {time}.", { time: formatStamp(file.handedInAt) })
                  : handedIn
                    ? t("exercise.speaking.handedIn", "Your recording is handed in. A new one replaces it.")
                    : limit
                      ? t("exercise.speaking.idleSpeak", "Press to start. You can speak for up to {speak}.", { speak: formatClock(limit) })
                      : t("exercise.speaking.idleOpen", "Press to start recording.");

  return (
    <Frame node={node} mode={mode}>
      {pool && editing ? (
        // The question's own prompt is a placeholder the API replaces with the drawn topic.
        <TopicPoolPrompts sectionKey={pool.sectionKey} />
      ) : pool ? (
        <DrawnTopic prompt={node.content.prompt} />
      ) : (
        <p className={cn(promptTextClass(promptDensity(node.content.prompt)), "text-foreground")}><EditablePrompt node={node} /></p>
      )}
      {canRecord || handedIn || file ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border-2 bg-card px-4 py-6 text-center">
          {canRecord ? (
            <div className="relative size-28">
              {/* The countdown ring: full at the start, empty when time runs out. */}
              <svg viewBox="0 0 112 112" className="absolute inset-0 size-full -rotate-90" aria-hidden>
                <circle cx="56" cy="56" r={RING_R} fill="none" strokeWidth="6" className="stroke-muted" />
                {ring && ring.total > 0 ? (
                  <circle
                    cx="56"
                    cy="56"
                    r={RING_R}
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={RING_LENGTH}
                    strokeDashoffset={RING_LENGTH * (1 - Math.min(1, ring.left / ring.total))}
                    className={phase === "recording" ? "stroke-destructive" : "stroke-primary"}
                  />
                ) : null}
              </svg>
              <button
                type="button"
                onClick={press}
                disabled={busy || (phase !== "recording" && startBlocked)}
                aria-label={buttonLabel}
                className={cn(
                  "absolute inset-3 flex items-center justify-center rounded-full text-primary-foreground shadow-sm transition-colors focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  phase === "recording" ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90",
                )}
              >
                {busy ? (
                  <Loader2 className="size-9 animate-spin" />
                ) : phase === "recording" ? (
                  <Square className="size-8 fill-current" />
                ) : preparing ? (
                  <Hourglass className="size-9" />
                ) : handedIn ? (
                  <RotateCcw className="size-9" />
                ) : (
                  <Mic className="size-9" />
                )}
              </button>
            </div>
          ) : null}
          {canRecord ? <p className="text-sm font-bold text-foreground">{buttonLabel}</p> : null}
          {clock ? (
            <p className="text-3xl font-extrabold tabular-nums text-foreground" aria-live="off">
              {clock}
            </p>
          ) : null}
          <p className="max-w-md text-sm font-semibold text-muted-foreground" role="status">{status}</p>
          {phase === "error" ? (
            <p className="flex items-center gap-2 text-sm font-bold text-destructive"><CircleAlert className="size-4" />{error}</p>
          ) : null}
          {takeUrl && phase !== "recording" ? <audio controls src={takeUrl} className="w-full max-w-md" /> : null}
        </div>
      ) : null}
    </Frame>
  );
}

/** What went wrong with a take, in the student's terms. */
function recordError(cause: unknown, t: ReturnType<typeof useI18n>["t"]): string {
  if (cause instanceof DOMException && (cause.name === "NotAllowedError" || cause.name === "SecurityError")) {
    return t("exercise.speaking.noMic", "This page can’t use your microphone. Allow it in the browser, then try again.");
  }
  if (cause instanceof DOMException && cause.name === "NotFoundError") {
    return t("exercise.speaking.noDevice", "No microphone was found. Connect one, then try again.");
  }
  if (cause instanceof Error && cause.message) return cause.message;
  return t("exercise.speaking.failed", "Your recording couldn’t be handed in. Try again.");
}
