import { useEffect, useRef, useState } from "react";
import { CircleAlert, Loader2, Mic, RotateCcw, Square } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { useAnswerFiles, type FinishRecording } from "../lib/answer-files";
import { fileAnswerKey, type ExerciseNode } from "../lib/exercises";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";
import { formatClock } from "../lib/media-window";
import { pickRecordingType, resolveRecordingTimes, secondsLeft, uploadType } from "../lib/recorder";

import { formatStamp } from "./essay-response";
import { Frame, type SubProps } from "./frame";

type SpeakingNode = Extract<ExerciseNode, { type: "speaking" }>;

type Phase = "idle" | "preparing" | "starting" | "recording" | "sending" | "error";

// The ring around the button: its radius in a 112-unit box, and its length.
const RING_R = 52;
const RING_LENGTH = 2 * Math.PI * RING_R;

/**
 * A speaking question: the prompt, and one round button in the middle that runs
 * the take. Pressed, it counts down the preparation time when there is one,
 * starts recording on its own, counts down the speaking time, and stops and hands
 * the take in when that runs out (or when pressed again). Recording needs the
 * runner's `beginRecording`; without it the prompt shows alone.
 */
export function SpeakingResponse({ node, mode, value, onChange }: SubProps<SpeakingNode>) {
  const { t } = useI18n();
  const files = useAnswerFiles();
  const file = files.file(node.id);
  const handedIn = Boolean(fileAnswerKey(value));
  const times = resolveRecordingTimes(files.recordingTimes?.(node.id), node.content.max_seconds);
  const canRecord = mode === "practice" && Boolean(files.beginRecording);
  const startBlocked = files.canStartRecording === false;
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [phaseStartedAt, setPhaseStartedAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [takeUrl, setTakeUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Let go of the microphone and the last take when the question unmounts.
  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );
  useEffect(() => () => { if (takeUrl) URL.revokeObjectURL(takeUrl); }, [takeUrl]);

  // One clock for both countdowns: preparing ends by starting the take, and a
  // take ends by stopping and handing itself in.
  useEffect(() => {
    if (phase !== "preparing" && phase !== "recording") return;
    const id = window.setInterval(() => {
      const at = Date.now();
      setNow(at);
      if (phase === "preparing" && times.prepareSeconds && secondsLeft(times.prepareSeconds, phaseStartedAt, at) <= 0) void record();
      if (phase === "recording" && times.speakSeconds && secondsLeft(times.speakSeconds, phaseStartedAt, at) <= 0) recorderRef.current?.stop();
    }, 200);
    return () => window.clearInterval(id);
    // `record` reads only refs and state setters; the interval restarts with each phase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, phaseStartedAt, times.prepareSeconds, times.speakSeconds]);

  const enter = (next: Phase) => {
    const at = Date.now();
    setPhase(next);
    setPhaseStartedAt(at);
    setNow(at);
  };
  const fail = (cause: unknown) => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setError(recordError(cause, t));
    setPhase("error");
  };

  /** The press: asks for the microphone first, so preparing never waits on a browser prompt. */
  async function begin() {
    if (!files.beginRecording) return;
    setError("");
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (cause) {
      fail(cause);
      return;
    }
    if (times.prepareSeconds) enter("preparing");
    else await record();
  }

  /** Asks the API for the take's upload slot, then records into it. */
  async function record() {
    const stream = streamRef.current;
    if (!files.beginRecording || !stream) return;
    enter("starting");
    const type = typeof MediaRecorder.isTypeSupported === "function" ? pickRecordingType((candidate) => MediaRecorder.isTypeSupported(candidate)) : "";
    let finish: FinishRecording;
    try {
      // Asked before the first word, so a take can't start after time is up.
      finish = await files.beginRecording(node.id, uploadType(type));
    } catch (cause) {
      fail(cause);
      return;
    }
    const recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      const take = new Blob(chunks, { type: uploadType(recorder.mimeType || type) });
      setTakeUrl(URL.createObjectURL(take));
      enter("sending");
      finish(take)
        .then((fileKey) => {
          onChange?.({ file_key: fileKey });
          setPhase("idle");
        })
        .catch(fail);
    };
    recorderRef.current = recorder;
    recorder.start(1000);
    enter("recording");
  }

  const busy = phase === "starting" || phase === "sending";
  const total = phase === "preparing" ? times.prepareSeconds : phase === "recording" ? times.speakSeconds : null;
  const left = total ? secondsLeft(total, phaseStartedAt, now) : null;
  const elapsed = (now - phaseStartedAt) / 1000;
  const press = () => {
    if (phase === "recording") recorderRef.current?.stop();
    else if (phase === "preparing") void record();
    else if (!busy) void begin();
  };
  const buttonLabel =
    phase === "recording"
      ? t("exercise.speaking.stop", "Stop and Hand In")
      : phase === "preparing"
        ? t("exercise.speaking.startNow", "Start Recording Now")
        : handedIn
          ? t("exercise.speaking.again", "Record Again")
          : t("exercise.speaking.record", "Start Recording");
  const status =
    phase === "preparing"
      ? t("exercise.speaking.preparing", "Prepare your answer. Recording starts on its own.")
      : phase === "recording"
        ? times.speakSeconds
          ? t("exercise.speaking.recordingLeft", "Recording. It stops and hands in when the time runs out.")
          : t("exercise.speaking.recordingOpen", "Recording. Press the button when you finish.")
        : phase === "starting"
          ? t("exercise.speaking.starting", "Getting ready to record…")
          : phase === "sending"
            ? t("exercise.speaking.sending", "Handing in your recording…")
            : startBlocked
              ? t("exercise.speaking.timeUp", "Time is up, so no new recording can start.")
              : file?.handedInAt
                ? t("exercise.speaking.handedInAt", "Recording handed in {time}.", { time: formatStamp(file.handedInAt) })
                : handedIn
                  ? t("exercise.speaking.handedIn", "Your recording is handed in. A new one replaces it.")
                  : times.prepareSeconds
                    ? t("exercise.speaking.idlePrepare", "Press to start. You get {prepare} to prepare, then {speak} to speak.", {
                        prepare: formatClock(times.prepareSeconds),
                        speak: times.speakSeconds ? formatClock(times.speakSeconds) : t("exercise.speaking.noLimit", "as long as you need"),
                      })
                    : times.speakSeconds
                      ? t("exercise.speaking.idleSpeak", "Press to start. You can speak for up to {speak}.", { speak: formatClock(times.speakSeconds) })
                      : t("exercise.speaking.idleOpen", "Press to start recording.");

  return (
    <Frame node={node} mode={mode}>
      <p className={cn(promptTextClass(promptDensity(node.content.prompt)), "text-foreground")}>{node.content.prompt}</p>
      {canRecord || handedIn || file ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border-2 bg-card px-4 py-6 text-center">
          {canRecord ? (
            <div className="relative size-28">
              {/* The countdown ring: full at the start of a phase, empty when it ends. */}
              <svg viewBox="0 0 112 112" className="absolute inset-0 size-full -rotate-90" aria-hidden>
                <circle cx="56" cy="56" r={RING_R} fill="none" strokeWidth="6" className="stroke-muted" />
                {total && left !== null ? (
                  <circle
                    cx="56"
                    cy="56"
                    r={RING_R}
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={RING_LENGTH}
                    strokeDashoffset={RING_LENGTH * (1 - left / total)}
                    className={phase === "recording" ? "stroke-destructive" : "stroke-primary"}
                  />
                ) : null}
              </svg>
              <button
                type="button"
                onClick={press}
                disabled={busy || (startBlocked && phase === "idle") || (startBlocked && phase === "error")}
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
                ) : handedIn && phase !== "preparing" ? (
                  <RotateCcw className="size-9" />
                ) : (
                  <Mic className="size-9" />
                )}
              </button>
            </div>
          ) : null}
          {canRecord ? <p className="text-sm font-bold text-foreground">{buttonLabel}</p> : null}
          {phase === "preparing" || phase === "recording" ? (
            <p className="text-3xl font-extrabold tabular-nums text-foreground" aria-live="off">
              {left !== null ? formatClock(Math.ceil(left)) : formatClock(elapsed)}
            </p>
          ) : null}
          <p className="max-w-md text-sm font-semibold text-muted-foreground" role="status">{status}</p>
          {phase === "error" ? (
            <p className="flex items-center gap-2 text-sm font-bold text-destructive"><CircleAlert className="size-4" />{error}</p>
          ) : null}
          {takeUrl && phase !== "recording" && phase !== "preparing" ? <audio controls src={takeUrl} className="w-full max-w-md" /> : null}
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
