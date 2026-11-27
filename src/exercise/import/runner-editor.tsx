import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Eye, Headphones, Pencil, Settings2 } from "lucide-react";
import { toast } from "sonner";

import {
  ExerciseEditProvider,
  AddRow,
  ExercisePage,
  HighlighterProvider,
  PaginationBar,
  answerFromKey,
  placeInOrder,
  buildPages,
  pageLayout,
  rootBank,
  type CollectionMove,
  type ExerciseAnswer,
  type ExerciseEditor,
  type ExerciseNode,
  type RunPage,
  type SpringboardTest,
} from "../index";
import {
  Button,
  confirmAction,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../exports";
import { uploadQuestionImage, type CollectionStub } from "./api";
import { StudentShell } from "../index";
import { QuestionListDialog } from "../index";
import { RunnerHeading } from "../index";
import {
  AcceptedAnswers,
  AnswerRules,
  ExplanationField,
  PlaceholderField,
  SplitPassageFields,
  TitleFields,
} from "./question-settings-fields";
import { SaveReviewDialog } from "./save-review-dialog";
import { useStableI18n } from "./i18n";
import type { EditorChange, SaveTask } from "./editor-changes";
import { retypedNode } from "./exercise-draft";
import { sectionOf } from "./test-structure";

// The question editor IS the student runner.
//
// The same composition as the student preview (`student-preview.tsx`):
// StudentShell, RunnerHeading, the runner's pages (`buildPages`), PaginationBar
// and QuestionNav (a dialog from the bottom bar, marking which questions have a key),
// with the template's edit mode switched on. Every question is
// drawn by the student's own renderer, answered with its key: answering it sets
// the key, its text edits in place, passages are typed into where they print and cloze blanks
// drag between words. What students never see sits in a ⚙ settings sheet. The
// host holds every edit and saves through the pending-changes bar, which floats
// over the shell.

/** What the host says about one question: how it may change and its controls. */
export interface RunnerQuestionOptions {
  /** Whether the question's type may be switched (clears its answer). */
  canRetype: boolean;
  /** Not saved yet. */
  draft?: boolean;
  /** Marks and their setter; omit the setter for read-only marks. */
  points?: number | null;
  onPointsChange?: (points: number) => void;
  /** Set aside, as a discarded import question is. */
  dimmed?: boolean;
  /** The host's controls for this question (remove, discard, keep). */
  actions?: ReactNode;
  /** A warning the host knows and the page can't show (a hunt sentence gone). */
  notice?: string | null;
  /** Host-only settings for the sheet (tags, reviewer notes, test to add to). */
  settings?: ReactNode;
}

/**
 * What the host holds unsaved, for the final check. With it the last page's
 * Next reads "Save N changes", and Exit asks before throwing them away.
 */
export interface RunnerChanges {
  items: EditorChange[];
  /** The writes for Save all, built when it is pressed. */
  tasks: () => SaveTask[];
  /** Warnings for the whole save (the test has been run). */
  notices?: string[];
  /** Put everything back to what is stored; called before Exit leaves. */
  onDiscard: () => void;
  /** Every change was stored. */
  onSaved?: () => void;
  /** Replaces "Save N changes". */
  saveLabel?: string;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * An option's picture, uploaded as soon as it is picked: the API stores it by
 * content hash and answers its key and a signed URL. The option itself only
 * changes when the question is saved.
 */
async function uploadOptionImage(file: File): Promise<{ image_key: string; url: string }> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("An image may be at most 5 MB.");
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn’t read the file."));
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });
  return uploadQuestionImage(base64);
}

/** The paper, the selection and where each edit goes. */
export interface RunnerEditorProps {
  /** Every question in paper order; a node's id is the host's key for it. */
  nodes: ExerciseNode[];
  collectionByNode: Map<string, CollectionStub | null>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNodeChange: (id: string, node: ExerciseNode) => void;
  /** A part's or section's passage, every paragraph. */
  onPassageChange: (collectionKey: string, passage: string[]) => void;
  /** A cloze blank moved: the section's passage and its questions' new order. */
  onBlanksMove: (collectionKey: string, passage: string[], order: string[]) => void;
  questionOptions: (node: ExerciseNode) => RunnerQuestionOptions;
  /** Leaves the editor (the shell's Exit). */
  onExit: () => void;
  /** The host's controls in the top bar (save). */
  toolbar?: ReactNode;
  /** The host's notice above every page in edit mode (an import's unread sections). */
  banner?: ReactNode;
  /**
   * Placeholder nodes for questions still being read. A page of them draws as
   * a skeleton, and the last page's button waits until none are left.
   */
  pendingIds?: ReadonlySet<string>;
  /** What the last page's Next does, as a student's Submit: the save. */
  finish?: { label: string; onFinish: () => void; disabled?: boolean };
  /** Unsaved edits: the last page's Next opens their final check instead of `finish`. */
  changes?: RunnerChanges;
  /** A part's or section's title or instruction edited in the heading's drop-down. */
  onCollectionChange?: (collectionKey: string, patch: { title?: string; instruction?: string }) => void;
  /** Further settings for the page's section, at the foot of the heading's drop-down. */
  sectionSettings?: (stub: CollectionStub | null) => ReactNode;
  /**
   * The host's controls at the foot of the question list (new question,
   * section and part, settings, recordings), given the page's part/section.
   */
  navActions?: (stub: CollectionStub | null, close: () => void) => ReactNode;
  /**
   * Questions dragged into a new order inside one part/section run of the
   * question list: the run's collection key (null outside any) and its node
   * ids in the new order. The editor shows the new order at once; the host
   * keeps it with its other unsaved edits. Without it the list can't reorder.
   */
  onReorder?: (collectionKey: string | null, orderedNodeIds: string[]) => void;
  /**
   * With `onReorder`, parts dragged into a new order and sections into
   * another part in the question list. The host moves the collection and
   * passes the paper back in its new order.
   */
  onMoveCollection?: (move: CollectionMove) => void;
  /** A new question in the page's section (or part), offered under its last question. */
  onAddQuestion?: (collectionKey: string | null) => void;
  /** A speaking topic pool's topics, edited where its question shows them. */
  topicPrompts?: ExerciseEditor["topicPrompts"];
  /**
   * The paper's audio: a button in the bottom bar, beside the question list,
   * opens `content` in a dialog. `count` is how many recordings it holds.
   */
  audio?: { count: number; content: ReactNode };
  /** A flow's steps for the top bar's centre (the AI import); the heading then folds into a chip at the left. */
  steps?: ReactNode;
  /** Replaces the top bar's question line (the import's six segments). */
  stepsBar?: ReactNode;
}

/**
 * The runner, full screen over the teacher page, in edit mode — with a toggle
 * that shows the same page exactly as a student answers it.
 */
export function RunnerEditor({
  nodes: hostNodes,
  collectionByNode,
  selectedId,
  onSelect,
  onNodeChange,
  onPassageChange,
  onBlanksMove,
  questionOptions,
  onExit,
  toolbar,
  banner,
  finish: hostFinish,
  changes,
  onCollectionChange,
  sectionSettings,
  navActions,
  onAddQuestion,
  onReorder,
  onMoveCollection,
  topicPrompts,
  audio,
  pendingIds,
  steps,
  stepsBar,
}: RunnerEditorProps) {
  const { t } = useStableI18n();
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({});
  const [settingsFor, setSettingsFor] = useState<string | null>(null);
  const [panel, setPanel] = useState<"questions" | "audio" | null>(null);
  // The teacher page stays mounted under the runner; inert keeps its covered
  // buttons out of the tab order and away from screen readers.
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return undefined;
    root.setAttribute("inert", "");
    return () => root.removeAttribute("inert");
  }, []);
  const [reviewing, setReviewing] = useState(false);

  const pending = changes?.items.length ?? 0;
  const finish = changes
    ? {
        label:
          changes.saveLabel ??
          (pending === 1
            ? t("exercise.import.runnerEditor.saveOne", "Save 1 change")
            : t("exercise.import.runnerEditor.saveMany", "Save {n} changes", { n: pending })),
        disabled: pending === 0,
        onFinish: () => setReviewing(true),
      }
    : hostFinish;
  // Leaving with unsaved edits asks first; what is kept is nothing.
  const exit = async () => {
    if (changes && pending > 0) {
      const discard = await confirmAction({
        title:
          pending === 1
            ? t("exercise.import.runnerEditor.discardOne", "Discard 1 unsaved change?")
            : t("exercise.import.runnerEditor.discardMany", "Discard {n} unsaved changes?", { n: pending }),
        description: t("exercise.import.runnerEditor.discardHint", "Nothing you changed here has been saved. Save from the last page to keep it."),
        confirmLabel: t("exercise.import.runnerEditor.discard", "Discard changes"),
        cancelLabel: t("exercise.import.runnerEditor.keepEditing", "Keep editing"),
      });
      if (!discard) return;
      changes.onDiscard();
    }
    onExit();
  };

  // Every run reordered in the list, oldest first, replayed over the host's
  // order. Replaying is a no-op once the host's nodes carry the order too.
  const [moves, setMoves] = useState<string[][]>([]);
  const nodes = useMemo(() => {
    if (moves.length === 0) return hostNodes;
    const byId = new Map(hostNodes.map((node) => [node.id, node]));
    const ids = moves.reduce(placeInOrder, hostNodes.map((node) => node.id));
    return ids.flatMap((id) => byId.get(id) ?? []);
  }, [hostNodes, moves]);
  const reorder = onReorder
    ? (collectionKey: string | null, orderedNodeIds: string[]) => {
        setMoves((current) => [...current, orderedNodeIds]);
        onReorder(collectionKey, orderedNodeIds);
      }
    : undefined;

  // Each matching task keeps its own page here: the page's section settings
  // and "Add question" act on `page.stub`, which a paired page would leave
  // pointing at the first task only.
  const pages = useMemo<RunPage[]>(
    () => buildPages(nodes, collectionByNode, { pairMatching: false }),
    [nodes, collectionByNode],
  );
  const selectedIndex = Math.max(0, nodes.findIndex((node) => node.id === selectedId));
  const pageIndex = Math.max(0, pages.findIndex((page) => page.nodeIndices.includes(selectedIndex)));
  const page = pages[pageIndex];
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const settingsNode = settingsFor ? (nodeById.get(settingsFor) ?? null) : null;

  // The navigator's paper, and what it marks as answered: a question with a key.
  const test = useMemo<SpringboardTest>(
    () => ({
      id: "editor",
      title: "",
      description: "",
      teacherName: "",
      status: "draft",
      durationMinutes: 0,
      updatedAt: "",
      nodes,
    }),
    [nodes],
  );
  const keyed = useMemo(() => {
    const out: Record<string, ExerciseAnswer> = {};
    for (const node of nodes) out[node.id] = answerFromKey(node);
    return out;
  }, [nodes]);

  const editor = useMemo<ExerciseEditor>(
    () => ({
      selectedId,
      onSelect,
      onNodeChange,
      onPassageChange,
      onBlanksMove,
      uploadOptionImage,
      topicPrompts,
      questionMeta: (node) => {
        const options = questionOptions(node);
        return {
          retype: options.canRetype
            ? (type) => onNodeChange(node.id, retypedNode(node, type))
            : undefined,
          points: options.points ?? null,
          onPointsChange: options.onPointsChange,
        };
      },
      questionTools: (node) => (
        <>
          {questionOptions(node).actions}
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("exercise.import.runnerEditor.settingsFor", "Question {n} settings", {
              n: nodes.indexOf(node) + 1,
            })}
            onClick={() => setSettingsFor(node.id)}
          >
            <Settings2 className="size-4" />
          </Button>
        </>
      ),
    }),
    [selectedId, onSelect, onNodeChange, onPassageChange, onBlanksMove, questionOptions, topicPrompts, nodes, t],
  );

  if (!page) return null;
  const goTo = (index: number) => {
    const target = pages[index];
    const node = target ? nodes[target.nodeIndices[0]] : undefined;
    if (node) onSelect(node.id);
  };
  const selected = nodes[selectedIndex];
  const selectedOptions = selected ? questionOptions(selected) : null;
  const { hasPassage } = pageLayout(page, nodes);
  const pagePending = Boolean(pendingIds?.size) && page.nodeIndices.some((index) => pendingIds?.has(nodes[index]?.id ?? ""));
  const waiting = (pendingIds?.size ?? 0) > 0;

  const heading = (
    <RunnerHeading
      // A new page closes the drop-down.
      key={page.stub?.appsheet_key ?? pageIndex}
      stub={page.stub}
      compact={Boolean(steps)}
      edit={
        mode === "edit" && onCollectionChange
          ? {
              onChange: onCollectionChange,
              // Passages are typed into on the page itself, where the student reads them.
              extra: sectionSettings?.(page.stub),
            }
          : undefined
      }
    />
  );

  return createPortal(
    // Over the teacher page, below the pending-changes bar and the sheet.
    <div className="fixed inset-0 z-[55] flex flex-col bg-background">
      <div className="min-h-0 flex-1">
      <StudentShell
        fill
        hideLogo
        current={selectedIndex + 1}
        total={nodes.length}
        onExit={() => void exit()}
        wide={hasPassage}
        scrollKey={`${pageIndex}:${mode}`}
        // With the import's steps, they take the centre and the heading folds into a chip at the left.
        heading={steps ?? heading}
        lead={steps ? heading : undefined}
        progress={stepsBar}
        actions={
          // One line, so the top bar keeps its height.
          <div className="flex items-center justify-end gap-2">
            {toolbar}
            <Button variant="outline" size="sm" onClick={() => setMode(mode === "edit" ? "preview" : "edit")}>
              {mode === "edit" ? <Eye className="size-4" /> : <Pencil className="size-4" />}
              {/* A phone keeps the icon; the label would crowd the heading. */}
              <span className="max-sm:sr-only">
                {mode === "edit"
                  ? t("exercise.import.runnerEditor.preview", "Preview as student")
                  : t("exercise.import.runnerEditor.edit", "Back to editing")}
              </span>
            </Button>
          </div>
        }
        footer={
          <PaginationBar
            index={pageIndex}
            total={pages.length}
            onPrev={() => goTo(pageIndex - 1)}
            onNext={() =>
              pageIndex < pages.length - 1 ? goTo(pageIndex + 1) : finish && !finish.disabled && !waiting ? finish.onFinish() : undefined
            }
            // The last page saves, as a student's submits; without a save it just ends.
            nextLabel={finish?.label ?? t("exercise.import.runnerEditor.next", "Next page")}
            center={
              <div className="flex min-w-0 items-center gap-1 sm:gap-2">
              <QuestionListDialog
                test={test}
                answers={keyed}
                currentIndex={selectedIndex}
                onJump={(index) => (nodes[index] ? onSelect(nodes[index].id) : undefined)}
                open={panel === "questions"}
                onOpenChange={(next) => setPanel(next ? "questions" : null)}
                collectionByNode={collectionByNode}
                actions={navActions?.(page.stub, () => setPanel(null))}
                states="keys"
                // With a flow's steps, the count is the current step's status up there instead.
                hideCount={Boolean(steps)}
                onReorder={reorder}
                onMoveCollection={reorder ? onMoveCollection : undefined}
              />
              {audio ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  aria-label={t("exercise.import.runnerEditor.audioLabel", "Audio, {n} recordings", { n: audio.count })}
                  onClick={() => setPanel("audio")}
                >
                  <Headphones className="size-4" />
                  <span className="max-sm:sr-only">{t("exercise.import.runnerEditor.audio", "Audio")}</span>
                  <span className="font-mono tabular-nums text-muted-foreground">{audio.count}</span>
                </Button>
              ) : null}
              </div>
            }
          />
        }
      >
        {mode === "edit" && banner ? <div className="mb-4 shrink-0">{banner}</div> : null}
        {/* Only what the page itself can't show: a host's warning about the selection. */}
        {mode === "edit" && (selectedOptions?.notice || selectedOptions?.dimmed) ? (
          <div className="mb-4 flex shrink-0 flex-wrap items-center gap-2">
            {selectedOptions?.notice ? (
              <span className="rounded-full bg-butter-bg px-4 py-2 text-xs font-extrabold text-ink-700">
                {selectedOptions.notice}
              </span>
            ) : null}
            {selectedOptions?.dimmed ? (
              <span className="rounded-full bg-muted px-4 py-2 text-xs font-extrabold text-muted-foreground">
                {t("exercise.import.runnerEditor.setAside", "Question {n} is discarded and won’t be saved", { n: selectedIndex + 1 })}
              </span>
            ) : null}
          </div>
        ) : null}

        {pagePending ? (
          // Still being read: the page's place is held so nothing moves when it arrives.
          <div role="status" aria-live="polite" className="space-y-4">
            <p className="text-sm font-bold text-lav-700">
              {t("exercise.import.runnerEditor.reading", "Reading these questions…")}
            </p>
            {page.nodeIndices.slice(0, 4).map((index) => (
              <div key={index} className="space-y-3 rounded-3xl border bg-card p-6 shadow-sm">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-10 animate-pulse rounded-xl bg-muted/70" />
                <div className="h-10 animate-pulse rounded-xl bg-muted/70" />
              </div>
            ))}
          </div>
        ) : mode === "edit" ? (
          <ExerciseEditProvider editor={editor}>
            <ExercisePage page={page} nodes={nodes} answers={{}} onChange={() => undefined} />
            {onAddQuestion ? (
              // A new question joins the page's section, or its part.
              <div className="mt-4">
                <AddRow
                  className="rounded-2xl px-5 py-4 text-[15px]"
                  chipClassName="size-7 rounded-[9px]"
                  label={t("exercise.import.runnerEditor.newQuestion", "New question")}
                  onClick={() => onAddQuestion(page.stub?.appsheet_key ?? null)}
                />
              </div>
            ) : null}
          </ExerciseEditProvider>
        ) : (
          <HighlighterProvider onLimitReached={(message) => toast.info(message)}>
            <ExercisePage
              page={page}
              nodes={nodes}
              answers={answers}
              onChange={(nodeId, value) => setAnswers((current) => ({ ...current, [nodeId]: value }))}
              enableAnnotations
            />
          </HighlighterProvider>
        )}
      </StudentShell>
      </div>

      {settingsNode ? (
        <QuestionSettingsDialog
          node={settingsNode}
          number={nodes.indexOf(settingsNode) + 1}
          stub={collectionByNode.get(settingsNode.id) ?? null}
          options={questionOptions(settingsNode)}
          onChange={(next) => onNodeChange(settingsNode.id, next)}
          onClose={() => setSettingsFor(null)}
        />
      ) : null}

      {audio ? (
        <Dialog open={panel === "audio"} onOpenChange={(open) => setPanel(open ? "audio" : null)}>
          <DialogContent aria-describedby={undefined} className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("exercise.import.runnerEditor.audioTitle", "Audio")}</DialogTitle>
            </DialogHeader>
            {audio.content}
          </DialogContent>
        </Dialog>
      ) : null}

      {changes ? (
        <SaveReviewDialog
          open={reviewing}
          onOpenChange={setReviewing}
          changes={changes.items}
          notices={changes.notices}
          tasks={changes.tasks}
          onSaved={changes.onSaved}
        />
      ) : null}
    </div>,
    document.body,
  );
}

/**
 * What a student never sees, for one question: the other answers it accepts,
 * its marking rules, the answer-box hint, explanation, title and the host's
 * own fields. A dialog holds a copy and applies it with its own Save, since
 * the pending-changes bar sits under it.
 */
function QuestionSettingsDialog({
  node,
  number,
  stub,
  options,
  onChange,
  onClose,
}: {
  node: ExerciseNode;
  number: number;
  stub: CollectionStub | null;
  options: RunnerQuestionOptions;
  onChange: (node: ExerciseNode) => void;
  onClose: () => void;
}) {
  const { t } = useStableI18n();
  const [draft, setDraft] = useState<ExerciseNode>(node);
  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("exercise.import.runnerEditor.settingsTitle", "Question {n}", { n: number })}</DialogTitle>
          <DialogDescription>
            {t("exercise.import.runnerEditor.settingsHint", "Students don’t see these. Save adds them to your changes.")}
          </DialogDescription>
        </DialogHeader>
        {/* `min-w-0`: the dialog is a grid, whose track would otherwise grow to a field's longest line. */}
        <div className="min-w-0 space-y-5">
          {draft.type === "gap-filling" || draft.type === "rewriting" || draft.type === "short-answer" ? (
            <AcceptedAnswers node={draft} onChange={setDraft} rootBank={rootBank(sectionOf(stub)?.info)} />
          ) : null}
          {draft.type === "reading-full-test" ? <SplitPassageFields node={draft} onChange={setDraft} /> : null}
          <AnswerRules node={draft} onChange={setDraft} />
          {"placeholder" in draft.content ? <PlaceholderField node={draft} onChange={setDraft} /> : null}
          <ExplanationField node={draft} onChange={setDraft} />
          <TitleFields node={draft} onChange={setDraft} />
          {options.settings}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("exercise.import.runnerEditor.cancel", "Cancel")}
          </Button>
          <Button
            onClick={() => {
              onChange(draft);
              onClose();
            }}
          >
            {t("exercise.import.runnerEditor.saveSettings", "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
