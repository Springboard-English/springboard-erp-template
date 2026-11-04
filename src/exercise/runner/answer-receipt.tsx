import { CheckCircle2, CircleAlert, Minus } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { AnswerValue, rawAnswer } from "../components/answer-value";
import { formatAnswer } from "../lib/attempt-answer";
import { huntParagraph } from "../lib/error-hunt";
import type { CollectionStub } from "../types";
import {
  exerciseNodeSchema,
  type ExerciseAnswer,
  type SpringboardTest,
} from "../lib/exercises";
import { unansweredNodeIds } from "../lib/grading";
import { questionLabel } from "../lib/question-summary";

// What the student handed in, as they gave it — their record of having sat the
// paper, shown whether or not the server answered.
//
// Drawn on the completion screen after a submit or a time-up, and under the
// submit dialog while a failed hand-in retries. Each row says whether the
// server confirmed that answer, so a network failure reads as "Not confirmed"
// rather than as a clean hand-in or as nothing at all.
//
// No marks and no key: the nodes are the student-safe session exercises, and
// what is printed is what THEY put, formatted the way their result screen
// prints it.
export function AnswerReceipt({
  test,
  answers,
  isSaved,
  refusal,
  collectionByNode,
}: {
  test: SpringboardTest;
  answers: Record<string, ExerciseAnswer>;
  isSaved: (nodeId: string) => boolean;
  /** The server's reason for refusing this answer's last send, if it did. */
  refusal?: (nodeId: string) => string | undefined;
  collectionByNode: Map<string, CollectionStub | null>;
}) {
  const { t } = useI18n();
  const unanswered = new Set(unansweredNodeIds(test, answers));
  const unsavedIds = test.nodes
    .filter((node) => !unanswered.has(node.id) && !isSaved(node.id))
    .map((node) => node.id);
  const refusals = unsavedIds.flatMap((id) => refusal?.(id) ?? []);
  const unconfirmed = unsavedIds.length - refusals.length;

  return (
    <div className="space-y-3 text-left">
      {refusals.length > 0 ? (
        // Up here and not only on the rows: the rows can be a long scroll away,
        // and a refusal will not go away by waiting.
        <div
          role="alert"
          className="space-y-1 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700"
        >
          <p>
            {refusals.length === 1
              ? t("exercise.receipt.refusedOne", "1 answer wasn’t accepted by the server. Show this to your teacher.")
              : t("exercise.receipt.refusedOther", "{n} answers weren’t accepted by the server. Show this to your teacher.", { n: refusals.length })}
          </p>
          <ul className="list-disc pl-5 font-semibold">
            {[...new Set(refusals)].map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {unconfirmed > 0 ? (
        <p
          role="status"
          className="rounded-2xl border bg-butter-bg px-4 py-2.5 text-sm font-bold text-butter-700"
        >
          {unconfirmed === 1
            ? t("exercise.receipt.unconfirmedOne", "1 answer is not confirmed by the server yet. Keep this screen open, and show it to your teacher if it stays this way.")
            : t("exercise.receipt.unconfirmedOther", "{n} answers are not confirmed by the server yet. Keep this screen open, and show it to your teacher if it stays this way.", { n: unconfirmed })}
        </p>
      ) : null}
      <ol className="divide-y rounded-2xl border bg-card shadow-sm">
        {test.nodes.map((node, index) => {
          const answered = !unanswered.has(node.id);
          const saved = isSaved(node.id);
          // Only while unsaved: a later save of the same answer clears it anyway.
          const refused = answered && !saved ? refusal?.(node.id) : undefined;
          const parsed = exerciseNodeSchema.safeParse(node);
          const formatted = !answered
            ? null
            : parsed.success
              ? formatAnswer(
                  parsed.data,
                  answers[node.id],
                  huntParagraph(collectionByNode.get(node.id)),
                )
              : rawAnswer(answers[node.id]);
          return (
            <li key={node.id} className="flex items-start justify-between gap-4 px-5 py-3">
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-bold text-foreground">
                  {index + 1}. {questionLabel(node.type, node.content, t, node.title)}
                </p>
                <div className="text-sm">
                  {formatted ? (
                    <AnswerValue formatted={formatted} />
                  ) : (
                    <span className="font-semibold text-muted-foreground">{t("exercise.receipt.noAnswer", "No answer")}</span>
                  )}
                </div>
                {refused ? (
                  <p className="text-xs font-semibold text-rose-700">{refused}</p>
                ) : null}
              </div>
              <ReceiptStatus answered={answered} saved={saved} refused={Boolean(refused)} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ReceiptStatus({
  answered,
  saved,
  refused,
}: {
  answered: boolean;
  saved: boolean;
  refused: boolean;
}) {
  const { t } = useI18n();
  if (!answered) {
    return (
      <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-muted-foreground">
        <Minus className="size-4" />
        {t("exercise.receipt.blank", "Blank")}
      </span>
    );
  }
  return saved ? (
    <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-mint-700">
      <CheckCircle2 className="size-4" />
      {t("exercise.receipt.saved", "Saved")}
    </span>
  ) : refused ? (
    <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-rose-700">
      <CircleAlert className="size-4" />
      {t("exercise.receipt.notAccepted", "Not accepted")}
    </span>
  ) : (
    <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-butter-700">
      <CircleAlert className="size-4" />
      {t("exercise.receipt.notConfirmed", "Not confirmed")}
    </span>
  );
}
