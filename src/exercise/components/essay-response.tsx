import { CircleAlert, ExternalLink, FileText, Loader2, Lock } from "lucide-react";

import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { driveFileUrl, useAnswerFiles, type AnswerFile } from "../lib/answer-files";
import type { ExerciseNode } from "../lib/exercises";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";
import { EXAM_FIELD_PROPS } from "../lib/exam-field";

import { Frame, type SubProps } from "./frame";

// An essay: written in the student's own Doc when the runner supplies one,
// otherwise in a large textarea with a live word count.
type EssayNode = Extract<ExerciseNode, { type: "essay" }>;

/** Renders an essay question, in the student's Doc or inline. */
export function EssayResponse({ node, mode, value, onChange }: SubProps<EssayNode>) {
  const { t } = useI18n();
  const doc = useAnswerFiles().file(node.id);
  const answer = typeof value === "string" ? value : "";
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const aim = node.content.min_words
    ? t("exercise.renderer.aimForWords", "Aim for at least {n} words", { n: node.content.min_words })
    : t("exercise.renderer.writeClearly", "Write clearly and support your ideas");
  return (
    <Frame node={node} mode={mode}>
      <p className={cn(promptTextClass(promptDensity(node.content.prompt)), "text-foreground")}>{node.content.prompt}</p>
      {doc ? (
        <>
          <EssayDocCard doc={doc} />
          <p className="mt-3 text-xs font-bold text-muted-foreground">{aim}</p>
        </>
      ) : (
        <>
          <Textarea {...EXAM_FIELD_PROPS} value={answer} disabled={mode === "result"} onChange={(event) => onChange?.(event.target.value)} placeholder={node.content.placeholder} className="mt-5 min-h-48 rounded-2xl border-2 bg-card p-4 text-base leading-7" />
          <div className="mt-3 flex justify-between text-xs font-bold text-muted-foreground"><span>{aim}</span><span>{t("exercise.renderer.wordCount", "{n} words", { n: wordCount })}</span></div>
        </>
      )}
    </Frame>
  );
}

/** The student's Doc for one essay: being made, open to write in, handed in, or failed. */
export function EssayDocCard({ doc }: { doc: AnswerFile }) {
  const { t } = useI18n();
  const link = doc.driveFileId ? driveFileUrl(doc.driveFileId) : null;
  const locked = Boolean(doc.handedInAt);
  const failed = doc.status === "failed";
  const pending = !failed && (doc.status === "pending" || !link);
  return (
    <div className="mt-5 flex flex-col gap-4 rounded-2xl border-2 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          {failed ? <CircleAlert className="size-5 text-destructive" /> : pending ? <Loader2 className="size-5 animate-spin" /> : locked ? <Lock className="size-5" /> : <FileText className="size-5" />}
        </span>
        <div className="min-w-0">
          <p className="font-bold text-foreground">{t("exercise.essayDoc.title", "Your Essay Doc")}</p>
          <p className="text-sm text-muted-foreground">
            {failed
              ? t("exercise.essayDoc.failed", "Your Doc couldn’t be made. Tell your teacher.")
              : pending
                ? t("exercise.essayDoc.pending", "Your Doc is being made. This takes a few seconds.")
                : locked
                  ? t("exercise.essayDoc.handedIn", "Handed in {time}. It can no longer be edited.", { time: formatStamp(doc.handedInAt) })
                  : t("exercise.essayDoc.ready", "Write your essay in this Doc. It saves as you type and is handed in when you finish.")}
          </p>
        </div>
      </div>
      {link && !failed ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 md:pointer-fine:min-h-9"
        >
          <ExternalLink className="size-4" />
          {locked ? t("exercise.essayDoc.view", "View Doc") : t("exercise.essayDoc.open", "Open Doc")}
        </a>
      ) : null}
    </div>
  );
}

/** A short local date and time for a hand-in stamp; "" for none. */
export function formatStamp(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";
}
