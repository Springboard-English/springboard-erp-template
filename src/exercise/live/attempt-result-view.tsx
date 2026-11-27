import { useState, type ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  SimpleDataTable,
  type SimpleDataTableColumn,
} from "../../exports";

import { AnswerValue, rawAnswer } from "../components/answer-value";
import { Explanation } from "../components/explanation";
import { ScoreSummary } from "../runner/score-summary";
import { formatAnswer } from "../lib/attempt-answer";
import { huntParagraph } from "../lib/error-hunt";
import { exerciseNodeSchema, type ExerciseNode } from "../lib/exercises";
import { questionLabel } from "../lib/question-summary";
import { SkillBreakdown } from "./skill-breakdown-panel";
import { StandingPanel } from "./standing-panel";
import type {
  AnswerResultItem,
  ParticipantResult,
} from "./api";
import type { CollectionStub } from "./api";
import { useStableI18n } from "./i18n";
import { gradedFromResult } from "./grading";
import { releasedAnswerKey } from "./released-key";
import { formatMarks } from "./results";
import { participantSkillRows } from "./skill-breakdown";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour";

// A student's graded paper: a top section — the score beside its split by
// skill — and one table row per question with the verdict, their own answer,
// the teacher's explanation and any comment.
//
// ONE component for two screens. The runner draws this the moment the gated
// result comes back after Submit, and the review screen (`/student/attempts`)
// draws it again for any past run — the runner keeps its inline copy because a
// guest on a public link has no student home to be sent to. Two renderings of
// the same result that were written twice would drift, and the first thing to
// drift would be which row gets called "not answered".
//
// The top section is a CONTAINER query (`@3xl`), not a viewport one: the same
// component renders inside the runner's 48rem page shell and the dashboard's
// full-width content pane, and a viewport `lg:` would split the runner's narrow
// column into two unreadable slivers.
//
// The key appears only when the run released it (`answer_key_released`, once
// the run has ENDED — api `get_participant_result`), as its own column printed by
// `releasedAnswerKey`. The nodes stay the student-safe session exercises; the
// key rides the gated result item and is never handed to a renderer.
// `AnswerResultItem.answer` is their own submission, released on the same gate
// as the score.
export function AttemptResultView({
  nodes,
  result,
  studentName,
  footer,
  collectionByNode,
}: {
  nodes: ExerciseNode[];
  result: ParticipantResult;
  studentName?: string;
  footer?: ReactNode;
  /** Each node's collection stub. An error hunt's pick is an offset into its
   * section's passage, so without this the word they marked can't be named. */
  collectionByNode?: Map<string, CollectionStub | null>;
}) {
  const { t } = useStableI18n();
  const graded = gradedFromResult(result);
  const itemByKey = new Map(
    (result.items ?? []).map((item) => [item.exercise_key, item]),
  );
  const rows: ResultRow[] = nodes.map((node, index) => ({
    index,
    node,
    item: itemByKey.get(node.id),
    huntText: huntParagraph(collectionByNode?.get(node.id)),
  }));
  const skillRows = participantSkillRows(result.by_skill, t);

  return (
    <div className="@container space-y-6">
      <section
        {...tourAnchorProps(TOUR_ANCHORS.runnerScore)}
        className={
          skillRows.length > 0
            ? "grid gap-6 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
            : undefined
        }
      >
        <ScoreSummary result={graded} studentName={studentName} />
        <SkillBreakdown
          title={t("exercise.live.attemptResult.bySkill", "By skill")}
          rows={skillRows}
          className="rounded-3xl border bg-card p-6 shadow-sm"
        />
      </section>
      <StandingPanel
        standing={result.standing}
        bySkill={result.standing_by_skill}
        title={t("exercise.live.standing.titleStudent", "Where you sit in the class")}
        subject={t("exercise.live.standing.you", "You")}
      />
      <ResultTable rows={rows} showKey={result.answer_key_released === true} />
      {footer}
    </div>
  );
}

type ResultRow = {
  index: number;
  node: ExerciseNode;
  item: AnswerResultItem | undefined;
  huntText: string | null;
};

/**
 * Whether this row was answered at all.
 *
 * `answered` is on the item where the API lists every linked question. On an
 * older API an unreached question simply has no item, so a missing item means
 * the same thing — and must not fall through to the "marked" branch, or a
 * question the student never reached would print "Marked · 0".
 */
function wasAnswered(item: AnswerResultItem | undefined): boolean {
  if (!item) return false;
  return item.answered !== false;
}

function Verdict({ item }: { item: AnswerResultItem | undefined }) {
  const { t } = useStableI18n();
  if (!wasAnswered(item)) {
    return <span className="font-semibold text-muted-foreground">{t("exercise.live.attemptResult.notAnswered", "Not answered")}</span>;
  }
  if (item?.correct === true) {
    return (
      <span className="flex items-center gap-1 font-semibold text-mint-700">
        <CheckCircle2 className="size-4" />
        {t("exercise.live.attemptResult.correct", "Correct")}
      </span>
    );
  }
  if (item?.correct === false) {
    return (
      <span className="flex items-center gap-1 font-semibold text-error">
        <XCircle className="size-4" />
        {t("exercise.live.attemptResult.incorrect", "Incorrect")}
      </span>
    );
  }
  // `correct` alone cannot tell a marked essay from an unmarked one — it stays
  // null through both — so this reads `pending` instead.
  if (item?.pending) {
    return <span className="font-semibold text-muted-foreground">{t("exercise.live.attemptResult.withTeacher", "With your teacher")}</span>;
  }
  // Marked by hand: a real score, and not a right/wrong one.
  return <span className="font-semibold text-mint-700">{t("exercise.live.attemptResult.marked", "Marked")}</span>;
}

/** The student's own answer in words, or null when there is none to show. */
function givenAnswer(row: ResultRow) {
  const answer = row.item?.answer;
  // Only when the API sent one: the field is absent from an older API, and an
  // absent answer must not print as "—" beside a tick.
  if (!wasAnswered(row.item) || answer === undefined || answer === null) return null;
  // Parsed rather than trusted, the same way the teacher's screen does it: the
  // runner builds its nodes with a cast, and a question whose content doesn't
  // fit its type must fall back to the raw value rather than be formatted down
  // a branch that doesn't apply to it.
  const parsed = exerciseNodeSchema.safeParse(row.node);
  return parsed.success
    ? formatAnswer(parsed.data, answer, row.huntText)
    : rawAnswer(answer);
}

/** The correct answer in words — not on a row they already got right, where it
 * would only repeat their own answer. */
function correctAnswer(row: ResultRow) {
  if (row.item?.correct === true) return null;
  const formatted = releasedAnswerKey(row.node, row.item?.answer_key);
  return formatted.kind === "none" ? null : formatted;
}

/** A question's points as "got/out of", or what there is of that. */
function pointsLine(item: AnswerResultItem | undefined): string {
  // `max_points` is absent on an older API; without it there is nothing
  // honest to print the points out of.
  if (item?.max_points !== undefined && item?.max_points !== null) {
    return `${formatMarks(item.points)}/${formatMarks(item.max_points)}`;
  }
  return item?.points !== undefined && item?.points !== null ? formatMarks(item.points) : "—";
}

/**
 * The marks for some questions of a graded paper, one card each: verdict and
 * points, their answer, the released key and the explanation. The review
 * paper draws it under each page; the rows are the results table's, so the
 * two screens name every answer in the same words.
 */
export function QuestionMarks({
  nodes,
  numbers,
  result,
  collectionByNode,
}: {
  nodes: ExerciseNode[];
  /** Each node's 1-based number on the paper. */
  numbers: number[];
  result: ParticipantResult;
  collectionByNode?: Map<string, CollectionStub | null>;
}) {
  const { t } = useStableI18n();
  const showKey = result.answer_key_released === true;
  const itemByKey = new Map((result.items ?? []).map((item) => [item.exercise_key, item]));
  return (
    <div className="space-y-3">
      {nodes.map((node, k) => {
        const row: ResultRow = {
          index: numbers[k] - 1,
          node,
          item: itemByKey.get(node.id),
          huntText: huntParagraph(collectionByNode?.get(node.id)),
        };
        const given = givenAnswer(row);
        const key = showKey ? correctAnswer(row) : null;
        return (
          <section key={node.id} className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-extrabold text-foreground">
                {t("exercise.renderer.questionNo", "Question {n}", { n: numbers[k] })}
              </span>
              <span className="flex items-center gap-3">
                <Verdict item={row.item} />
                <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                  {pointsLine(row.item)}
                </span>
              </span>
            </div>
            <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="mb-1 font-bold text-muted-foreground">
                  {t("exercise.live.attemptResult.yourAnswer", "Your Answer")}
                </dt>
                <dd>{given ? <AnswerValue formatted={given} /> : <span className="font-semibold text-muted-foreground">—</span>}</dd>
              </div>
              {key ? (
                <div className="min-w-0">
                  <dt className="mb-1 font-bold text-muted-foreground">
                    {t("exercise.live.attemptResult.correctAnswer", "Correct Answer")}
                  </dt>
                  <dd><AnswerValue formatted={key} /></dd>
                </div>
              ) : null}
            </dl>
            <Explanation text={row.item?.explanation ?? undefined} mode="result" className="mt-3" />
            {row.item?.feedback ? (
              <p className="mt-3 rounded-xl bg-lav-bg p-3 text-sm font-semibold text-lav-700">{row.item.feedback}</p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function ResultTable({ rows, showKey }: { rows: ResultRow[]; showKey: boolean }) {
  const { t } = useStableI18n();
  const [page, setPage] = useState(0);
  // The whole paper on one page by default: a student reads their result top
  // to bottom, and a pager in the middle of it is a pager they never asked for.
  const [pageSize, setPageSize] = useState(50);

  const columns: Array<SimpleDataTableColumn<ResultRow>> = [
    {
      id: "order",
      header: "#",
      className: "text-left w-12",
      cellClassName: "text-left align-top font-mono text-xs font-bold tabular-nums text-muted-foreground",
      render: (row) => String(row.index + 1),
    },
    {
      id: "question",
      header: t("exercise.live.attemptResult.question", "Question"),
      className: "text-left",
      cellClassName: "text-left align-top",
      render: (row) => (
        <div className="space-y-2">
          <p className="font-bold text-foreground">
            {questionLabel(
              row.node.type,
              row.node.content as Record<string, unknown>,
              t,
              row.node.title,
            )}
          </p>
          {/* The teacher's explanation, which is the whole point of releasing
              results — a score alone teaches nothing. */}
          <Explanation text={row.item?.explanation ?? undefined} mode="result" />
          {/* And their comment, released on the same gate. This is the only
              place a student ever reads it. */}
          {row.item?.feedback ? (
            <p className="rounded-xl bg-lav-bg p-3 text-sm font-semibold text-lav-700">
              {row.item.feedback}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      id: "answer",
      header: t("exercise.live.attemptResult.yourAnswer", "Your Answer"),
      className: "text-left",
      cellClassName: "text-left align-top text-xs",
      render: (row) => {
        const given = givenAnswer(row);
        return given ? (
          <AnswerValue formatted={given} />
        ) : (
          <span className="font-semibold text-muted-foreground">—</span>
        );
      },
    },
    ...(showKey
      ? [
          {
            id: "key",
            header: t("exercise.live.attemptResult.correctAnswer", "Correct Answer"),
            className: "text-left",
            cellClassName: "text-left align-top text-xs",
            render: (row: ResultRow) => {
              const key = correctAnswer(row);
              return key ? (
                <AnswerValue formatted={key} />
              ) : (
                <span className="font-semibold text-muted-foreground">—</span>
              );
            },
          },
        ]
      : []),
    {
      id: "verdict",
      header: t("exercise.live.attemptResult.result", "Result"),
      className: "text-left w-36",
      cellClassName: "text-left align-top text-sm",
      render: (row) => <Verdict item={row.item} />,
    },
    {
      id: "points",
      header: t("exercise.live.attemptResult.points", "Points"),
      className: "text-right w-24",
      cellClassName: "text-right align-top text-xs font-semibold tabular-nums text-muted-foreground",
      render: (row) => pointsLine(row.item),
    },
  ];

  return (
    <SimpleDataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.node.id}
      page={page}
      pageSize={pageSize}
      pageSizeOptions={[25, 50, 100]}
      onPageChange={setPage}
      onPageSizeChange={(next) => {
        setPageSize(next);
        setPage(0);
      }}
      emptyMessage={t("exercise.live.attemptResult.empty", "This paper has no questions.")}
      classNames={{
        root: "rounded-[20px] border-border shadow-sm",
        headCell: "bg-mint-bg text-mint-700",
        row: "hover:bg-mint-bg/30",
      }}
    />
  );
}
