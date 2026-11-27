import { useMemo, useState, type ReactNode } from "react";
import { BookOpenCheck } from "lucide-react";

import { ExercisePage } from "../components/exercise-page";
import { RecordingBar, RecordingDeck } from "../components/recording-deck";
import { PageTranscripts } from "../components/transcript-panel";
import { buildPages, pageLayout } from "../lib/exercise-pages";
import type { ExerciseAnswer, ExerciseNode } from "../lib/exercises";
import { MediaPlaybackProvider, teacherPlayback } from "../lib/media-playback";
import { deckRecordings, sessionRecordingSource } from "../lib/recording-deck";
import { transcriptContent, type TranscriptContent } from "../lib/transcript";
import { PaginationBar } from "../runner/pagination-bar";
import type { SessionRecording } from "../types";
import { requestRecordingUrl, type CollectionStub, type ParticipantResult } from "./api";
import { QuestionMarks } from "./attempt-result-view";
import { useStableI18n } from "./i18n";
import { RunnerHeading } from "./runner-heading";
import { StudentShell } from "./student-shell";

const NO_CHANGE = () => undefined;

/**
 * Review mode: a finished attempt reopened as the paper the student sat, page
 * by page, with their own answers in place and nothing editable. Under each
 * page, a card per question with the verdict, the released key and the
 * explanation (`QuestionMarks`). The recordings replay at will once the run
 * has released its key, each with its transcript, whose lines light up and
 * seek. The host decides when to offer it: after the result is out.
 */
export function AttemptReviewPaper({
  sessionKey,
  participantKey,
  nodes,
  result,
  recordings,
  collectionByNode,
  onExit,
  banner,
}: {
  sessionKey: string;
  participantKey: string;
  /** The session's student-safe exercises, in paper order; ids are link keys. */
  nodes: ExerciseNode[];
  result: ParticipantResult;
  /** The run's recordings (`listSessionRecordings`); carry transcripts once released. */
  recordings: SessionRecording[];
  collectionByNode: Map<string, CollectionStub | null>;
  onExit: () => void;
  /** Replaces the line above the page saying this is a review. */
  banner?: ReactNode;
}) {
  const { t } = useStableI18n();
  const [pageIndex, setPageIndex] = useState(0);
  const pages = useMemo(() => buildPages(nodes, collectionByNode), [nodes, collectionByNode]);

  // Their submission per question, which is the shape the runner held.
  const answers = useMemo(() => {
    const out: Record<string, ExerciseAnswer> = {};
    for (const item of result.items ?? []) {
      if (item.answer !== undefined && item.answer !== null) out[item.exercise_key] = item.answer as ExerciseAnswer;
    }
    return out;
  }, [result]);

  const deck = useMemo(
    () =>
      deckRecordings(
        recordings.map(sessionRecordingSource),
        nodes.map((node) => node.id),
        (nodeId) => collectionByNode.get(nodeId),
        t,
      ),
    [recordings, nodes, collectionByNode, t],
  );
  const transcripts = useMemo(
    () => new Map<string, TranscriptContent>(recordings.map((r) => [r.recording_key, transcriptContent(r)])),
    [recordings],
  );
  // At will, like a teacher: a released run's recording-url opens no window.
  const playback = useMemo(
    () => teacherPlayback((recordingKey) => requestRecordingUrl(sessionKey, participantKey, recordingKey)),
    [sessionKey, participantKey],
  );

  if (pages.length === 0) return null;
  const index = Math.min(pageIndex, pages.length - 1);
  const page = pages[index];
  const pageNodes = page.nodeIndices.map((i) => nodes[i]).filter(Boolean);
  const nodeIds = pageNodes.map((node) => node.id);
  const isLast = index === pages.length - 1;

  return (
    <MediaPlaybackProvider value={playback}>
      <RecordingDeck recordings={deck} currentNodeIds={nodeIds}>
        <StudentShell
          strip={<RecordingBar className="mb-2" />}
          current={page.nodeIndices[page.nodeIndices.length - 1] + 1}
          total={nodes.length}
          onExit={onExit}
          wide={pageLayout(page, nodes).hasPassage}
          scrollKey={String(index)}
          heading={<RunnerHeading stub={page.stub} />}
          footer={
            <PaginationBar
              index={index}
              total={pages.length}
              onPrev={() => setPageIndex(index - 1)}
              onNext={() => (isLast ? onExit() : setPageIndex(index + 1))}
              nextLabel={isLast ? t("exercise.review.done", "Done") : undefined}
            />
          }
        >
          <div className="mb-5 flex shrink-0 items-center gap-2 rounded-full bg-mint-bg px-4 py-2 text-xs font-extrabold text-mint-700">
            <BookOpenCheck className="size-4" />
            {banner ?? t("exercise.review.banner", "Review — your answers as you handed them in, marked below each page")}
          </div>
          <ExercisePage page={page} nodes={nodes} answers={answers} onChange={NO_CHANGE} />
          <PageTranscripts nodeIds={nodeIds} transcripts={transcripts} className="mt-6" />
          <div className="mt-6">
            <QuestionMarks
              nodes={pageNodes}
              numbers={page.nodeIndices.map((i) => i + 1)}
              result={result}
              collectionByNode={collectionByNode}
            />
          </div>
        </StudentShell>
      </RecordingDeck>
    </MediaPlaybackProvider>
  );
}
