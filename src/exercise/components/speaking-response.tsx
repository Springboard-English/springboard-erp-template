import { useEffect, useRef, useState } from "react";
import { CircleAlert, Loader2, Mic, RotateCcw, Square } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { useAnswerFiles, type FinishRecording } from "../lib/answer-files";
import { fileAnswerKey, type ExerciseNode } from "../lib/exercises";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";
import { formatClock } from "../lib/media-window";
import { pickRecordingType, uploadType } from "../lib/recorder";

import { formatStamp } from "./essay-response";
import { Frame, type SubProps } from "./frame";

type SpeakingNode = Extract<ExerciseNode, { type: "speaking" }>;

type Phase = "idle" | "starting" | "recording" | "sending" | "error";

/**
 * A speaking question: the prompt, and a recorder that hands each take in as
 * the student's answer. Recording needs the runner's `beginRecording`; without
 * it (a teacher preview, a review) the prompt shows alone.
 */
export function SpeakingResponse({ node, mode, value, onChange }: SubProps<SpeakingNode>) {
  const { t } = useI18n();
  const files = useAnswerFiles();
  const file = files.file(node.id);
  const handedIn = Boolean(fileAnswerKey(value));
  const maxSeconds = node.content.max_seconds;
  const canRecord = mode === "practice" && Boolean(files.beginRecording);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [takeUrl, setTakeUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

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

  // The clock, and the stop at the question's limit.
  useEffect(() => {
    if (phase !== "recording") return;
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      const seconds = (Date.now() - startedAt) / 1000;
      setElapsed(seconds);
      if (maxSeconds && seconds >= maxSeconds) recorderRef.current?.stop();
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, maxSeconds]);

  async function start() {
    if (!files.beginRecording) return;
    setError("");
    setElapsed(0);
    setPhase("starting");
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = typeof MediaRecorder.isTypeSupported === "function" ? pickRecordingType((candidate) => MediaRecorder.isTypeSupported(candidate)) : "";
      // Asked before the first word, so a take can't start after time is up.
      const finish = await files.beginRecording(node.id, uploadType(type));
      record(stream, type, finish);
    } catch (cause) {
      stream?.getTracks().forEach((track) => track.stop());
      setError(recordError(cause, t));
      setPhase("error");
    }
  }

  function record(stream: MediaStream, type: string, finish: FinishRecording) {
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
        .catch((cause) => {
          setError(recordError(cause, t));
          setPhase("error");
        });
    };
    recorderRef.current = recorder;
    recorder.start(1000);
    setPhase("recording");
  }

  const startBlocked = !files.canStartRecording && files.canStartRecording !== undefined;
  return (
    <Frame node={node} mode={mode}>
      <p className={cn(promptTextClass(promptDensity(node.content.prompt)), "text-foreground")}>{node.content.prompt}</p>
      {maxSeconds ? (
        <p className="mt-2 text-xs font-bold text-muted-foreground">{t("exercise.speaking.limit", "Speak for up to {time}.", { time: formatClock(maxSeconds) })}</p>
      ) : null}
      {canRecord || handedIn || file ? (
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border-2 bg-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            {phase === "recording" ? (
              <Button type="button" variant="destructive" onClick={() => recorderRef.current?.stop()}>
                <Square className="size-4" />
                {t("exercise.speaking.stop", "Stop and Hand In")}
              </Button>
            ) : canRecord ? (
              <Button type="button" onClick={() => void start()} disabled={phase === "starting" || phase === "sending" || startBlocked}>
                {phase === "starting" ? <Loader2 className="size-4 animate-spin" /> : handedIn ? <RotateCcw className="size-4" /> : <Mic className="size-4" />}
                {handedIn ? t("exercise.speaking.again", "Record Again") : t("exercise.speaking.record", "Start Recording")}
              </Button>
            ) : null}
            <span className="text-sm font-bold text-muted-foreground" role="status">
              {phase === "recording"
                ? t("exercise.speaking.recording", "Recording {time}", { time: maxSeconds ? `${formatClock(elapsed)} / ${formatClock(maxSeconds)}` : formatClock(elapsed) })
                : phase === "sending"
                  ? t("exercise.speaking.sending", "Handing in your recording…")
                  : startBlocked && phase !== "error"
                    ? t("exercise.speaking.timeUp", "Time is up, so no new recording can start.")
                    : file?.handedInAt
                      ? t("exercise.speaking.handedInAt", "Recording handed in {time}.", { time: formatStamp(file.handedInAt) })
                      : handedIn
                        ? t("exercise.speaking.handedIn", "Your recording is handed in. A new one replaces it.")
                        : null}
            </span>
          </div>
          {phase === "recording" ? <span className="sr-only">{t("exercise.speaking.live", "The microphone is on.")}</span> : null}
          {takeUrl && phase !== "recording" ? <audio controls src={takeUrl} className="w-full" /> : null}
          {phase === "error" ? (
            <p className="flex items-center gap-2 text-sm font-bold text-destructive"><CircleAlert className="size-4" />{error}</p>
          ) : null}
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
