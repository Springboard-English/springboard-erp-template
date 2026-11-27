import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Check, ChevronDown, FileText, KeyRound, Loader2, Plus, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { TeacherShell } from "./shell";
import { DetailSkeleton } from "../index";
import {
  placeInOrder,
  type ExerciseNode,
  type QuestionType,
  dropGaps,
  hasGapToken,
  joinPassage,
  splitPassage,
  questionLabel,
  ERROR_HUNT,
  sectionTask,
  sharesOnePool,
  taskRequiredType,
  usesBlanks,
} from "../index";
import { DetectedUnitPicker } from "./detected-unit-picker";
import { RunnerEditor } from "./runner-editor";
import { AddToTestDialog } from "./add-to-test-dialog";
import { AddSourceDialog } from "./add-source-dialog";
import { ImportFrame } from "./import-frame";
import {
  IMPORT_AUDIO_TEST,
  ImportAudioPanel,
  type AudioPlacement,
  type PendingRecording,
} from "./import-audio-panel";
import { ImportSteps, ImportStepsBar, type ImportStep, type ImportStepCounts } from "./import-steps";
import {
  chosenQuestionCount,
  detectedUnitRefs,
  pickDetected,
  prefixDetectedRefs,
  retypeDetectedSection,
} from "./detect-selection";
import { valueLabel, type Translate } from "./i18n";
import { useStableI18n } from "./i18n";
import {
  ExtractionQuestionNav,
  type NavEntry,
} from "./extraction-question-nav";
import {
  ExerciseReorderList,
  type ReorderRow,
} from "./exercise-reorder-list";
import { Button, confirmAction, ApiError, errorMessage } from "../../exports";
import {
  scopeToCollectionBody,
  scopeToCreateBody,
  type TestScope,
} from "./test-scope-fields";
import {
  SaveImportDialog,
  SAVE_IMPORT_FORM,
  importSaveReady,
  IMPORT_NEW_TEST as NEW_TEST,
  IMPORT_NO_TEST as NO_TEST,
} from "./save-import-dialog";
import { Input, Label } from "../../exports";
import { Textarea } from "../../exports";
import { PartTimerFields } from "./part-timer-fields";
import { EMPTY_PART_TIMERS, partTimersBody } from "./part-timers";
import { QUESTIONS_PART_TITLE } from "./questions-part";
import {
  cleanPrompts,
  SectionLayoutField,
  SectionPromptsField,
  SectionWordBankField,
} from "./section-info-fields";
import {
  testingKeys,
  useCreateExercise,
  useCreateRecording,
  useCreateTest,
  useExerciseTags,
  useTestTags,
  useTests,
} from "./queries";
import {
  createCollection,
  detectStructure,
  linkCollectionToTest,
  type DetectStructure,
  type CollectionStub,
  type ExtractedCollection,
  type ExtractSource,
} from "./api";
import { nodeAnswerError } from "./answer-key";
import { useLeaveGuard } from "./use-leave-guard";
import { importIssues, questionTally } from "./import-issues";
import { draftMoveFromNav, LOOSE_REF, nextCollectionRef, nextManualId, type ReviewItem } from "./import-draft";
import { runPool, useImportDraft } from "./use-import-draft";
import { chainsBy } from "./save-chains";
import { nodeToExercisePost } from "./exercise-import";

import { blankNodeOfType, QUESTION_TYPE_LABELS } from "./exercise-draft";
import { MARKS_STEP, marksFromInput } from "./marks";
import { PassageEditor } from "./passage-editor";
import { ExtractIssues, type LabelledIssue } from "./extract-issues";
import { QuickKeyDialog } from "./quick-key-dialog";
import { applyQuickKey, parseQuickKey } from "./quick-key";
import { StatusScreen } from "./status-screen";
import { cn } from "../../lib/utils";
import { tourAnchorProps, TOUR_ANCHORS } from "./tour-anchor";
import { SAMPLE_IMPORT_STRUCTURE, SAMPLE_IMPORT_TEXT, sampleSectionExtract } from "./sample-import";
import {
  IMPORT_MODE_PARAM,
  importModeFromParams,
  tourImportViewFromParams,
  type ImportMode,
  importOptions,
  teacherTestRoute,
} from "./config";

// AI import: upload/paste a worksheet, extract its part/section structure and
// every question, then REVIEW what came back before anything is saved.
//
// The extractor returns a hierarchy — parts (a paper's own units), sections
// (single-type runs of questions tied to one shared passage), and questions —
// mirroring how real papers are organised. The review keeps that shape: the
// left rail groups questions under their part/section headers, and saving
// persists collections first, then questions, then links whole parts to the
// target test in one call each (the collection travels as a unit).
//
// The flow is deliberately two-visual-stages so a long paper never looks stuck:
// a full-screen indicator while the single *detect* call maps the paper, then
// the review opens **immediately** with a skeleton per detected question that
// fills in as the per-section / per-question extract calls return. Between the
// two, `choosing` lets the teacher tick which detected units to extract — the
// way to import one exercise out of a whole paper.
type Phase = "idle" | "detecting" | "choosing" | "review" | "done";

// How many questions are POSTed at once when saving an import. Lower than the
// extract fan-out on purpose: these are writes against one test, and the point
// is to stop a 60-question paper making 60 sequential round trips, not to open
// as many connections as possible.
const SAVE_CONCURRENCY = 10;
// The API's inline source limit.
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

// NO_TEST / NEW_TEST are the save dialog's sentinels, imported above: the
// dialog owns the "where does this go" question, and this screen only maps
// its answer onto the save.

/**
 * What the destination select starts on, per mode.
 *
 * An exercise import is pinned to NO_TEST — the mode IS the destination, and
 * the dialog shows no picker to move it off. A test import starts on NEW_TEST
 * rather than NO_TEST both because a paper usually arrives as a test that does
 * not exist yet, and because NO_TEST is not a destination it can save to:
 * left as the initial value it would open the dialog on a choice that cannot be
 * confirmed.
 */
function initialTestKey(mode: ImportMode): string {
  return mode === "exercises" ? NO_TEST : NEW_TEST;
}

/** What a save has written so far, keyed by the review's own refs and ids. */
interface SaveProgress {
  /** The test this import created, if it made one. */
  createdTest: string | null;
  collections: Map<string, string>;
  questions: Map<string, string>;
  questionsPart: string | null;
  /** Parts already linked to the target test. */
  linked: Set<string>;
  /** Queued recordings already attached, by their queue id. */
  recordings: Set<string>;
}

/** A save that has written nothing yet. */
function emptySaveProgress(): SaveProgress {
  return { createdTest: null, collections: new Map(), questions: new Map(), questionsPart: null, linked: new Set(), recordings: new Set() };
}

/** Strip the `data:<mime>;base64,` prefix FileReader prepends. */
function readAsBase64(file: File, t: Translate): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(t("exercise.import.aiExtract.fileReadFailed", "Couldn’t read the file.")));
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });
}

// --- Rail entries -----------------------------------------------------------
// The left rail, flattened in reading order: part header -> its sections (each
// header + questions or skeletons) -> questions added by hand to the part.
const UPLOAD_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

type RailEntry =
  | { kind: "header"; ref: string; collection: ExtractedCollection }
  | { kind: "item"; id: string; number: number; item: ReviewItem }
  | { kind: "skeleton"; id: string; number: number; collectionRef: string };

export function AiExtract() {
  const { t } = useStableI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Which import this is — read from the URL, so a reload or a pasted link
  // lands in the same one. See `ImportMode` for why it isn't router state.
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = importModeFromParams(searchParams);
  // The tour's practice import: the sample paper stands in for both AI calls,
  // and the save writes nothing (`content/tour/sample-import.ts`).
  const tourView = tourImportViewFromParams(searchParams);
  const practice = tourView !== null;
  const [phase, setPhase] = useState<Phase>("idle");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  // The teacher's instruction to the extractor, sent with every call.
  const [note, setNote] = useState("");
  const [count, setCount] = useState(0);
  // True while a further file is being read into the open review: detection
  // and the choosing step then ADD to it, and backing out returns to it.
  const [appending, setAppending] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [keyOpen, setKeyOpen] = useState(false);
  // What detection found, held through the `choosing` step with the source it
  // was read from, since extraction re-sends that source per unit.
  const [detection, setDetection] = useState<{
    source: ExtractSource;
    structure: DetectStructure;
  } | null>(null);
  const [chosenUnits, setChosenUnits] = useState<Set<string>>(new Set());
  // The detected paper, its extract calls and the teacher's edits on it, in
  // one reducer (`lib/import-draft.ts`), so "this import" has one owner.
  const importDraft = useImportDraft(practice ? async (_source, section) => sampleSectionExtract(section.ref) : undefined);
  const { draft, dispatch, retrying } = importDraft;
  const { structure, collections, units, outcomes, progress, dropped, orderOverride, manualIds, huntRefs, fileCount } = draft;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [testKey, setTestKey] = useState<string>(() => initialTestKey(mode));
  const [newTestName, setNewTestName] = useState("");
  const [newTestScope, setNewTestScope] = useState<TestScope | null>(null);
  // Applied to every question the save writes — see the note on the dialog's
  // `tags` prop for why this is per-import and not per-question.
  const [importTags, setImportTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  // The save dialog — where the import is filed is asked here, once, when Save
  // is pressed, rather than sitting in the action bar throughout the review.
  const [saveOpen, setSaveOpen] = useState(false);
  // Where "Open the test" should go once saving is done.
  const [savedTestKey, setSavedTestKey] = useState<string | null>(null);
  // How many parts this import wrote, so the done screen can offer them. Held
  // rather than derived: `collections` is the reviewed draft and is reset for
  // the next import, while the done screen is describing the one just saved.
  const [savedPartCount, setSavedPartCount] = useState(0);
  // What the save has actually done so far. The run is a sequence of REST
  // calls — test, then collections, then one per question, then the links —
  // and on a 60-question paper a single "Saving…" would give no way to tell
  // progress from a hang. It also matters when it FAILS:
  // the run is not transactional, so knowing it stopped at question 34 of 60
  // is the difference between retrying and hunting for duplicates.
  const [saveStep, setSaveStep] = useState<{
    label: string;
    done: number;
    total: number;
  } | null>(null);
  // The same step, readable from the save's own catch: state read there is the
  // value from before the save began, which is always empty.
  const saveStepRef = useRef<{ label: string; done: number; total: number } | null>(null);
  const trackStep = (next: { label: string; done: number; total: number } | null) => {
    saveStepRef.current = next;
    setSaveStep(next);
  };
  const stepDone = () => {
    if (saveStepRef.current) saveStepRef.current = { ...saveStepRef.current, done: saveStepRef.current.done + 1 };
    setSaveStep(saveStepRef.current);
  };
  // What a save that stopped partway already wrote, so pressing Save again
  // carries on from there instead of writing a second copy.
  const savedRef = useRef<SaveProgress>(emptySaveProgress());
  // The reorder view; the order it sets lives in the draft and applies at save.
  const [reordering, setReordering] = useState(false);
  const sectionTypesOf = (ref: string | undefined) =>
    ref ? (units[ref]?.items ?? []).map((item) => item.node.type) : [];
  const setHunt = (ref: string, hunt: boolean) => dispatch({ type: "setHunt", ref, hunt });
  // A part/section opened in its own right, with no question selected.
  //
  // The detail pane is otherwise keyed on a question, so without this a part or
  // section with no questions could not be opened, and therefore not named.
  // Seeding every new collection with a blank question instead would put a
  // question the teacher never asked for into the paper and block the save on
  // it (`needAnswers` counts a blank).
  const [selectedCollectionRef, setSelectedCollectionRef] = useState<string | null>(
    null,
  );

  const { data: tests } = useTests();
  const { data: tagSuggestions } = useExerciseTags();
  // A new test takes the import's tags too (see `save`), so while one is being
  // created the field also offers the tags the test library filters by.
  const { data: testTagSuggestions } = useTestTags();
  const createExercise = useCreateExercise();
  const createRecording = useCreateRecording();
  // The paper's audio, queued in the review and attached at the save (`ImportAudioPanel`).
  const [pendingAudio, setPendingAudio] = useState<PendingRecording[]>([]);
  const createTest = useCreateTest();

  const extracting = phase === "review" && progress.done < progress.total;
  const allItems = useMemo(
    () => Object.values(units).flatMap((u) => u.items),
    [units],
  );
  const keptItems = useMemo(
    () => allItems.filter((i) => !dropped.has(i.node.id)),
    [allItems, dropped],
  );
  const keptCount = keptItems.length;
  // A review is kept nowhere but this page, so leaving it loses the checking:
  // asked in the suite's dialog, from Exit and from any in-app link alike.
  const leaveConfirm = {
    title: t("exercise.import.aiExtract.leaveTitle", "Leave this import?"),
    description: t("exercise.import.aiExtract.leaveBody", "What the AI read and everything you reviewed will be lost. Nothing has been saved yet."),
    confirmLabel: t("exercise.import.aiExtract.leaveConfirmLabel", "Leave import"),
    cancelLabel: t("exercise.import.aiExtract.leaveCancel", "Keep importing"),
  };
  // A practice import holds nothing to lose, and the tour moves on from it by navigating.
  useLeaveGuard(!practice && (phase === "choosing" || (phase === "review" && allItems.length > 0)), leaveConfirm);
  // Questions extraction declined to answer. Surfaced up front because they are
  // the work left before this import can be saved at all.
  const needAnswerIds = useMemo(
    () =>
      new Set(
        keptItems
          .filter((item) => nodeAnswerError(item.node, t) !== null)
          .map((item) => item.node.id),
      ),
    [keptItems, t],
  );
  const needAnswers = needAnswerIds.size;
  // Kept items in the teacher-set order, when they set one. Dropped ids fall
  // out; items kept after reordering append at the end (they weren't ranked).
  const orderedKept = useMemo(() => {
    if (!orderOverride) return keptItems;
    const byId = new Map(keptItems.map((item) => [item.node.id, item]));
    const seen = new Set<string>();
    const ordered: ReviewItem[] = [];
    for (const id of orderOverride) {
      const item = byId.get(id);
      if (item) {
        ordered.push(item);
        seen.add(id);
      }
    }
    for (const item of keptItems) {
      if (!seen.has(item.node.id)) ordered.push(item);
    }
    return ordered;
  }, [keptItems, orderOverride]);
  // Mode-gated, not just the sentinel: an exercise import never creates a test,
  // whatever the destination state happens to hold.
  const creatingTest = mode === "tests" && testKey === NEW_TEST;
  const newTestScopeBody = scopeToCreateBody(newTestScope);
  // Opening the dialog only needs questions to save; whether the *destination*
  // is complete is the dialog's own confirm button to enforce.
  const canSave = keptCount > 0 && !saving && !extracting;

  /**
   * Switch modes, before any reading has started.
   *
   * Offered on the source step because the sidebar's `AI import` tab is one
   * tab, and the question library's button — the other way into exercise mode —
   * sits on a screen whose nav tab is currently hidden. Without this, the mode
   * would only be reachable by knowing the URL.
   *
   * `replace` so the toggle doesn't fill the back button with mode flips, and
   * the destination is reset with it: the sentinel that is valid in one mode is
   * not a destination the other can save to.
   */
  function changeMode(next: ImportMode) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set(IMPORT_MODE_PARAM, next);
        return params;
      },
      { replace: true },
    );
    setTestKey(initialTestKey(next));
  }

  const colByRef = useMemo(() => {
    const map = new Map<string, ExtractedCollection>();
    for (const c of collections) map.set(c.ref, c);
    return map;
  }, [collections]);

  // The reorder view's rows. Only a *section* groups (matching the runner), so
  // sectionKey is set only when a question's own collection is a section; a
  // loose or part-level question reorders freely.
  const reorderRows = useMemo<ReorderRow[]>(
    () =>
      orderedKept.map((item) => {
        const own = item.collectionRef ? colByRef.get(item.collectionRef) : null;
        const section = own?.kind === "section" ? own : null;
        const part = section
          ? (section.parent_ref ? colByRef.get(section.parent_ref) : null)
          : own?.kind === "part"
            ? own
            : null;
        return {
          key: item.node.id,
          title: questionLabel(item.node.type, item.node.content, t, item.node.title),
          subtitle: valueLabel(t, QUESTION_TYPE_LABELS[item.node.type]),
          skill: item.node.skillTag,
          sectionKey: section ? section.ref : null,
          sectionLabel: section
            ? section.instruction || t("exercise.import.aiExtract.section", "Section")
            : null,
          partLabel: part?.title ?? null,
        };
      }),
    [orderedKept, colByRef, t],
  );

  // Build the rail from the detected structure (headers + skeleton counts) and
  // the live units (real questions replace their skeletons as they arrive).
  const rail = useMemo<RailEntry[]>(() => {
    if (!structure) return [];
    const rows: RailEntry[] = [];
    let number = 0;
    // A section's questions, or its skeletons until its extract answers.
    const pushUnit = (ref: string, skeletonCount: number) => {
      const unit = units[ref];
      if (!unit || unit.status === "pending") {
        for (let i = 0; i < Math.max(skeletonCount, 1); i += 1) {
          rows.push({ kind: "skeleton", id: `pending-${ref}-${i}`, number: ++number, collectionRef: ref });
        }
        return;
      }
      for (const item of unit.items) {
        rows.push({ kind: "item", id: item.node.id, number: ++number, item });
      }
    };
    // Loose questions lead, with NO header before them. That is not incidental:
    // `toGroups` files everything arriving before the first header into the
    // "Questions" group, so emitting them here is what makes that group appear.
    for (const item of units[LOOSE_REF]?.items ?? []) {
      rows.push({ kind: "item", id: item.node.id, number: ++number, item });
    }
    for (const part of structure.parts) {
      const partCol = colByRef.get(part.ref);
      if (partCol) rows.push({ kind: "header", ref: part.ref, collection: partCol });
      for (const section of part.sections) {
        const secCol = colByRef.get(section.ref);
        if (secCol) rows.push({ kind: "header", ref: section.ref, collection: secCol });
        pushUnit(section.ref, section.question_count);
      }
      // Questions added by hand to the part, in no section (`addQuestion`).
      for (const item of units[part.ref]?.items ?? []) {
        rows.push({ kind: "item", id: item.node.id, number: ++number, item });
      }
    }
    return rows;
  }, [structure, units, colByRef]);

  // Resolve the selected question; fall back to the first real one, else the
  // first skeleton, so the detail pane always has something to show.
  const questionEntries = rail.filter(
    (r): r is Extract<RailEntry, { kind: "item" | "skeleton" }> =>
      r.kind === "item" || r.kind === "skeleton",
  );
  const activeEntry =
    questionEntries.find((r) => r.id === selectedId) ??
    questionEntries.find((r) => r.kind === "item") ??
    questionEntries[0] ??
    null;
  const activeItem = activeEntry?.kind === "item" ? activeEntry.item : null;
  // The part and section the active question belongs to, so their text (title,
  // instruction, passage) can be edited alongside the question.
  const activeOwn = activeItem
    ? collections.find((c) => c.ref === activeItem.collectionRef) ?? null
    : null;
  const activeSection = activeOwn?.kind === "section" ? activeOwn : null;
  // Whether the active question's section could carry a word box.
  // Only a gap question can sit in a word-formation section, which is what the
  // shared word box belongs to. Short-answer is not one: it can never carry a
  // bank, because it has no blank to fill.
  const gapFamily =
    activeItem?.node.type === "gap-filling" || activeItem?.node.type === "rewriting";

  // The collection opened in its own right, and its parent (a section names its
  // part). Null unless the teacher clicked a rail header or just made one.
  const selectedCollection = selectedCollectionRef
    ? collections.find((c) => c.ref === selectedCollectionRef) ?? null
    : null;
  const selectedCollectionParent = selectedCollection?.parent_ref
    ? collections.find((c) => c.ref === selectedCollection.parent_ref) ?? null
    : null;
  const activePart = activeSection
    ? collections.find((c) => c.ref === activeSection.parent_ref) ?? null
    : activeOwn?.kind === "part"
      ? activeOwn
      : null;

  // The review as the runner editor's paper: every extracted question in rail
  // order (discarded ones too, faded), each with its part/section as a stub.
  const paper = useMemo(() => {
    const stubs = new Map<string, CollectionStub>();
    const stubOf = (ref: string | null | undefined): CollectionStub | null => {
      if (!ref) return null;
      const known = stubs.get(ref);
      if (known) return known;
      const col = colByRef.get(ref);
      if (!col) return null;
      const stub: CollectionStub = {
        appsheet_key: col.ref,
        kind: col.kind,
        title: col.title,
        instruction: col.instruction,
        passage_title: col.passage_title,
        passage: col.passage ?? [],
        info: col.info,
        parent: stubOf(col.parent_ref),
      };
      stubs.set(ref, stub);
      return stub;
    };
    const nodes: ExerciseNode[] = [];
    const collectionByNode = new Map<string, CollectionStub | null>();
    // A question still being read holds its place with a placeholder, so the
    // runner opens at once and its numbering doesn't move as units answer.
    // The runner draws these as skeletons (`pendingIds`), never as questions.
    const pendingIds = new Set<string>();
    for (const row of rail) {
      if (row.kind === "item") {
        nodes.push(row.item.node);
        collectionByNode.set(row.item.node.id, stubOf(row.item.collectionRef));
      } else if (row.kind === "skeleton") {
        nodes.push(blankNodeOfType(row.id, "mcq", "reading"));
        collectionByNode.set(row.id, stubOf(row.collectionRef));
        pendingIds.add(row.id);
      }
    }
    // The parts and sections the question list shows, in paper order: its
    // drops count only these (an empty section has no questions to show).
    const shown = { parts: [] as string[], sectionsByPart: new Map<string, string[]>() };
    for (const stub of collectionByNode.values()) {
      const part = stub?.kind === "part" ? stub : stub?.parent;
      if (!part) continue;
      if (!shown.sectionsByPart.has(part.appsheet_key)) {
        shown.parts.push(part.appsheet_key);
        shown.sectionsByPart.set(part.appsheet_key, []);
      }
      const sections = shown.sectionsByPart.get(part.appsheet_key)!;
      if (stub?.kind === "section" && !sections.includes(stub.appsheet_key)) sections.push(stub.appsheet_key);
    }
    return { nodes, collectionByNode, pendingIds, shown };
  }, [rail, colByRef]);

  // Units in reading order with the name a teacher knows each by, for the
  // rows that say what extraction lost.
  const unitLabels = useMemo(() => {
    const labels = new Map<string, string>();
    for (const part of structure?.parts ?? []) {
      const partName = part.title ? `${part.title} · ` : "";
      part.sections.forEach((section, index) => {
        labels.set(
          section.ref,
          partName + (section.instruction || t("exercise.import.extractIssues.sectionN", "Section {n}", { n: index + 1 })),
        );
      });
    }
    return labels;
  }, [structure, t]);
  const issues = useMemo<LabelledIssue[]>(
    () => importIssues([...unitLabels.keys()], outcomes).map((issue) => ({ ...issue, label: unitLabels.get(issue.ref) ?? issue.ref })),
    [unitLabels, outcomes],
  );
  // Read against what detection found in every unit picked, not only those
  // that have answered, so the total holds still while they come in.
  const tally = {
    read: questionTally(outcomes).read,
    expected: (structure?.parts ?? []).reduce(
      (sum, part) => sum + part.sections.reduce((n, section) => n + section.question_count, 0),
      0,
    ),
  };
  const issuesBanner = issues.length ? (
    <ExtractIssues issues={issues} retrying={retrying} onRetry={(ref) => void importDraft.retry(ref)} />
  ) : null;

  /**
   * A section's passage as it saves: a cloze loses the `{gap}` of each
   * discarded question, because tokens fill questions in order and a stale
   * one would shift every later question into the blank before its own.
   */
  function keptPassage(ref: string, passage: string[] | null | undefined): string[] | null | undefined {
    const text = joinPassage(passage);
    if (!passage || !hasGapToken(text)) return passage;
    const items = [...(units[ref]?.items ?? [])].sort((a, b) => (a.collectionOrder ?? 0) - (b.collectionOrder ?? 0));
    const drop = items.flatMap((item, at) => (dropped.has(item.node.id) ? [at] : []));
    if (!drop.length) return passage;
    const next = dropGaps(text, drop);
    return splitPassage(next) ?? [next];
  }

  /**
   * A cloze section's blanks were dragged: its new passage, and its questions
   * in the new token order, which the save numbers them by.
   */
  function moveBlanks(ref: string, passage: string[], order: string[]) {
    dispatch({ type: "moveBlanks", ref, passage, order });
  }

  /**
   * Forget the import in hand, so the next one starts clean: its questions,
   * order, tags, destination, hand-added ids and hunt flags, and its calls
   * still running. `keepSource` keeps the pasted text, file and note, for a
   * teacher who left to change them and read the same paper again.
   */
  function resetImport(keepSource: boolean) {
    importDraft.reset();
    setPhase("idle");
    setAppending(false);
    setAddOpen(false);
    setKeyOpen(false);
    setDetection(null);
    setChosenUnits(new Set());
    setSelectedId(null);
    setTestKey(initialTestKey(mode));
    setNewTestName("");
    setNewTestScope(null);
    setImportTags([]);
    setSaveOpen(false);
    setPendingAudio([]);
    trackStep(null);
    savedRef.current = emptySaveProgress();
    setReordering(false);
    setSelectedCollectionRef(null);
    setSavedTestKey(null);
    setSavedPartCount(0);
    if (!keepSource) {
      setFile(null);
      setText("");
      setNote("");
    }
  }


  // Read a source: the import's first file, or (`append`) a further one into the
  // review already open. A failure returns to wherever the teacher came from.
  async function start(
    source: { file: File | null; text: string; note: string },
    append = false,
  ) {
    const back: Phase = append ? "review" : "idle";
    // Refused here, before it is encoded and uploaded only to be refused there.
    if (source.file && source.file.size > MAX_SOURCE_BYTES) {
      toast.error(
        t("exercise.import.aiExtract.fileTooLarge", "That file is {size}MB; the most AI import can read is 15MB. Split it, or export it at a lower resolution.", {
          size: Math.ceil(source.file.size / (1024 * 1024)),
        }),
      );
      return;
    }
    const run = importDraft.run();
    setAppending(append);
    setPhase("detecting");
    const trimmedNote = source.note.trim();
    const trimmedText = source.text.trim();
    let payload: ExtractSource;
    try {
      payload = {
        // A file and pasted text go together: the text is often the key.
        ...(source.file
          ? { data: await readAsBase64(source.file, t), mime_type: source.file.type, ...(trimmedText ? { text: source.text } : {}) }
          : { text: source.text }),
        ...(trimmedNote ? { note: trimmedNote } : {}),
      };
    } catch (err) {
      setPhase(back);
      toast.error(errorMessage(err, t("exercise.import.aiExtract.fileReadFailed", "Couldn’t read the file.")));
      return;
    }

    let detected: DetectStructure;
    try {
      detected = practice ? SAMPLE_IMPORT_STRUCTURE : await detectStructure(payload, importDraft.signal());
    } catch (err) {
      if (!importDraft.isCurrent(run)) return;
      setPhase(back);
      // The server says why it refused (too large, too long, AI not set up),
      // and "try again" helps with none of those.
      toast.error(errorMessage(err, t("exercise.import.aiExtract.sourceReadFailed", "Couldn’t read that source. Please try again.")));
      return;
    }
    if (!importDraft.isCurrent(run)) return;
    // Detection numbers refs from scratch, so a later file's would collide.
    if (append) detected = prefixDetectedRefs(detected, `f${fileCount + 1}-`);

    const refs = detectedUnitRefs(detected);
    if (refs.length === 0) {
      setPhase(back);
      toast.error(t("exercise.import.aiExtract.noQuestionsFound", "No questions could be found in that source."));
      return;
    }
    // One unit leaves nothing to choose between.
    if (refs.length === 1) {
      extract(payload, detected, append);
      return;
    }
    setDetection({ source: payload, structure: detected });
    setChosenUnits(new Set(refs));
    setPhase("choosing");
  }

  function extractChosen() {
    if (!detection) return;
    extract(detection.source, pickDetected(detection.structure, chosenUnits), appending);
  }

  function extract(payload: ExtractSource, detected: DetectStructure, append: boolean) {
    setDetection(null);
    setAppending(false);
    if (!append) setSelectedId(null);
    setPhase("review");
    importDraft.begin(payload, detected, append);
  }

  // The tour's practice import moves between steps by navigating, so each view
  // in the URL puts the screen on that step with the sample paper, keeping
  // whatever the teacher already did on the way there.
  useEffect(() => {
    if (!tourView) return;
    const source: ExtractSource = { text: SAMPLE_IMPORT_TEXT };
    if (tourView === "source") {
      if (phase !== "idle") resetImport(true);
      setText(SAMPLE_IMPORT_TEXT);
      return;
    }
    if (tourView === "choose") {
      if (phase === "choosing") return;
      resetImport(true);
      setText(SAMPLE_IMPORT_TEXT);
      setDetection({ source, structure: SAMPLE_IMPORT_STRUCTURE });
      setChosenUnits(new Set(detectedUnitRefs(SAMPLE_IMPORT_STRUCTURE)));
      setPhase("choosing");
      return;
    }
    if (phase !== "review") extract(source, SAMPLE_IMPORT_STRUCTURE, false);
    setSaveOpen(tourView === "save");
    // Keyed on the view alone: the step is what moves the screen, not its own state.
  }, [tourView]);

  // Verifying an extraction is exactly when a wrong prompt or key surfaces, so
  // the review lets the teacher fix the whole draft node in place (prompt,
  // options, answer). The saved question (nodeToExercisePost) carries it.
  // What every question in the active section is worth, or null when they
  // differ. A section is a single-type run and papers price them as one
  // ("Questions 1-10, 1 mark each"), so the shared value is the useful reading;
  // "mixed" is the honest answer to the rest and must not be shown as a number
  // a teacher could unknowingly flatten the run with.
  const sectionMarks = useMemo(() => {
    const items = activeSection ? (units[activeSection.ref]?.items ?? []) : [];
    if (!items.length) return null;
    const first = items[0].node.points;
    return items.every((item) => item.node.points === first) ? first : null;
  }, [activeSection, units]);

  const setSectionMarks = (ref: string, points: number) => dispatch({ type: "setSectionMarks", ref, points });
  // Any section's shared mark, or null when its questions disagree (the heading drop-down's field).
  const marksOf = (ref: string): number | null => {
    const items = units[ref]?.items ?? [];
    if (!items.length) return null;
    const first = items[0].node.points;
    return items.every((item) => item.node.points === first) ? first : null;
  };

  const updateNode = (nodeId: string, node: ExerciseNode) => dispatch({ type: "updateNode", id: nodeId, node });

  // Add a question by hand, in the review. A paper almost always has one the
  // extractor couldn't read — a diagram question, a handwritten addition — and
  // the alternative would be saving the import, leaving for the manual composer,
  // and coming back. It joins the ACTIVE section when there is one (so it lands in
  // the right run, in the right order) and otherwise sits on the active part,
  // in no section.
  //
  // It starts blank and therefore has no answer, so `needAnswers` counts it and
  // the save refuses until it's filled — the same path an unanswered extracted
  // question takes.
  // Create a part, or a section inside one — the collection equivalent of adding
  // a question by hand.
  //
  // Without it, a run the extractor missed entirely would have nowhere to go:
  // its questions would have to be filed under an unrelated section, or the
  // import saved and rebuilt by hand in the composer.
  //
  // It joins BOTH `structure` (which the rail walks, so it appears and keeps its
  // place in reading order) and `collections` (which the save walks, and which
  // the context editor binds to). Missing either leaves a collection that exists
  // in one half of the screen only.
  //
  // An empty one is not saved: `keptRefs` is derived from the questions actually
  // kept, so a section persists once it holds a question and a part once one of
  // its sections does. That is the right rule — an empty section is nothing —
  // and it means creating one speculatively costs nothing either.

  /**
   * A new part or section from the runner's question list: made with one blank
   * question in it, so it has a page to open on, where its heading's drop-down
   * names it and sets it up. (A collection with no questions is never saved.)
   */
  function addCollectionInRunner(kind: "part" | "section", parentRef: string | null) {
    if (!structure) return;
    const ref = nextCollectionRef(draft);
    const skill = activeItem?.node.skillTag ?? "reading";
    const blank = blankNodeOfType(nextManualId(draft), "mcq", skill);
    if (kind === "part") {
      dispatch({ type: "addPart" });
      dispatch({ type: "addQuestion", target: { kind: "part", partRef: ref }, node: blank });
    } else {
      const partRef = parentRef ?? activePart?.ref ?? structure.parts[0]?.ref;
      if (!partRef) return;
      dispatch({ type: "addSection", partRef });
      dispatch({ type: "addQuestion", target: { kind: "section", ref }, node: blank });
    }
    setSelectedCollectionRef(null);
    setSelectedId(blank.id);
  }

  function addQuestion(targetRef: string | null) {
    // Where it lands, and what it must be to fit there.
    const target = targetRef
      ? collections.find((c) => c.ref === targetRef) ?? null
      : null;
    const section = target?.kind === "section" ? target : null;
    const layout = section?.info?.layout ?? null;

    // A laid-out section pins the type: every layout is defined over exactly one
    // base type, and `pageLayout` only draws the combined UI when EVERY node on
    // the page matches — so one wrong type silently degrades the whole section
    // back to a stack of cards. Otherwise inherit from the run's existing
    // questions, because a new question in a True/False run is a True/False.
    const siblings = section ? (units[section.ref]?.items ?? []) : [];
    const type: QuestionType =
      taskRequiredType(section && huntRefs.has(section.ref) ? ERROR_HUNT : layout) ??
      siblings[0]?.node.type ??
      "mcq";
    const skill = siblings[0]?.node.skillTag ?? activeItem?.node.skillTag ?? "reading";

    const id = nextManualId(draft);
    let blank = blankNodeOfType(id, type, skill);

    // PAIRING. Gapped text, jumbled paragraphs, multiple matching and "choose
    // several" print ONE lettered list that every question in the run draws
    // from, so a new question has to be given the same options as its
    // siblings — an mcq with two empty
    // options in the middle of a matching task is unanswerable, and the section
    // stops rendering as one task at all. A guided cloze is deliberately
    // excluded: its blanks each print their OWN options.
    if (sharesOnePool(layout) && blank.type === "mcq") {
      const sibling = siblings.find((item) => item.node.type === "mcq")?.node;
      const pool = sibling?.type === "mcq" ? sibling.content.options : undefined;
      if (pool?.length) {
        blank = {
          ...blank,
          content: { ...blank.content, options: pool.map((option) => ({ ...option })) },
        } as ExerciseNode;
      }
    }
    if (section) {
      dispatch({ type: "addQuestion", target: { kind: "section", ref: section.ref }, node: blank });
    } else if (target === null && targetRef === null) {
      // NO collection at all: it goes in the loose bucket, which the rail emits
      // before any header, filing it under the leading "Questions" group.
      dispatch({ type: "addQuestion", target: { kind: "loose" }, node: blank });
    } else {
      const partRef =
        (target?.kind === "part" ? target.ref : null) ??
        activePart?.ref ??
        structure?.parts[0]?.ref;
      if (!partRef) return;
      dispatch({ type: "addQuestion", target: { kind: "part", partRef }, node: blank });
    }
    setSelectedId(blank.id);
  }

  /** Fill answers from a pasted key, numbered as the review numbers its questions. */
  function applyKey(text: string) {
    const { updates, unmatched } = applyQuickKey(paper.nodes, parseQuickKey(text));
    for (const [id, node] of updates) updateNode(id, node);
    setKeyOpen(false);
    const filled = t("exercise.import.quickKey.filled", "Filled {n} answers.", { n: updates.size });
    if (unmatched.length) {
      toast.warning(
        `${filled} ${t("exercise.import.quickKey.unmatched", "Couldn’t use the answers for {list}: no such question, or the answer doesn’t fit it.", { list: unmatched.join(", ") })}`,
        { duration: 12000 },
      );
    } else {
      toast.success(filled);
    }
  }

  const toggleDropped = (nodeId: string) => dispatch({ type: "toggleDropped", id: nodeId });

  // Edit a part's / section's own text (title, instruction, passage) — the
  // headers and passage the questions hang off, saved with the collection.
  const updateCollection = (ref: string, patch: Partial<ExtractedCollection>) =>
    dispatch({ type: "updateCollection", ref, patch });

  /**
   * What must be true before the save can even be *offered*, checked before the
   * dialog opens rather than after it is filled in: a teacher shouldn't choose
   * where an import is filed only to be told it can't be saved at all.
   *
   * A question with no answer is refused by the API's registry — partway
   * through the save, after earlier questions are already in the library. Caught
   * here it's one toast instead of a half-imported worksheet. These exist by
   * design: extraction returns a null key rather than guessing one when the
   * source prints no answers (see the API's _validated_blobs).
   */
  function readyToSave(): boolean {
    if (orderedKept.length === 0) {
      toast.error(t("exercise.import.aiExtract.nothingToSave", "Nothing to save — every question was discarded."));
      return false;
    }
    const missing = orderedKept.filter((item) => nodeAnswerError(item.node, t) !== null);
    if (missing.length > 0) {
      setSelectedId(missing[0].node.id);
      toast.error(
        missing.length === 1
          ? t(
              "exercise.import.aiExtract.needAnswerOne",
              "1 question needs an answer before saving. Set it, or discard them.",
            )
          : t(
              "exercise.import.aiExtract.needAnswerOther",
              "{n} questions need an answer before saving. Set it, or discard them.",
              { n: missing.length },
            ),
      );
      return false;
    }
    return true;
  }

  async function save() {
    // Kept questions in the reviewed order (sections stay contiguous).
    const keep = orderedKept;
    // Re-checked here, not only at the dialog: the review stays editable while
    // the dialog is open, so the paper can change between the two.
    if (!readyToSave()) return;
    if (practice) {
      toast(t("exercise.import.aiExtract.practiceNotSaved", "This is a practice import, so nothing is saved."));
      return;
    }
    setSaving(true);
    trackStep({
      label: t("exercise.import.aiExtract.stepPreparing", "Preparing"),
      done: 0,
      total: keep.length,
    });
    // A save that stopped partway left these behind: reuse them, don't remake them.
    const saved = savedRef.current;
    try {
      // 1. The target test, created first when asked for — everything else
      //    hangs off its key. A failure here saves nothing.
      //
      //    An exercise import has no target at all, and does not consult
      //    `testKey` to find that out: the mode decides it, so a stale key left
      //    behind by a mode switch mid-review can't put questions in a test the
      //    teacher is no longer filing them into.
      let target: string | null =
        mode === "exercises" || testKey === NO_TEST || creatingTest
          ? null
          : testKey;
      if (creatingTest && saved.createdTest) {
        target = saved.createdTest;
      } else if (creatingTest) {
        if (!newTestScopeBody) return;
        try {
          // The import's tags go on the new test as well as on its questions.
          // They describe the paper ("cambridge, b2, unit-7"), and the test IS
          // that paper — asking for a second set in the same dialog would be a
          // second answer to one question. An EXISTING test is left alone: a
          // PATCH replaces its tags, and filing questions into it is not a
          // reason to re-describe it.
          const test = await createTest.mutateAsync({
            ...newTestScopeBody,
            name: newTestName.trim(),
            ...(importTags.length ? { tags: importTags } : {}),
          });
          target = test.appsheet_key;
          saved.createdTest = target;
        } catch (err) {
          toast.error(
            errorMessage(
              err,
              t("exercise.import.aiExtract.createTestFailed", "Couldn’t create the test, so nothing was saved."),
            ),
          );
          return;
        }
      }

      // 2. Collections, parts before sections (a section names its parent).
      //    Only refs that still hold kept questions are created — discarding a
      //    whole section discards its container too.
      const keptRefs = new Set(
        keep.map((item) => item.collectionRef).filter(Boolean) as string[],
      );
      for (const c of collections) {
        if (c.kind === "section" && keptRefs.has(c.ref) && c.parent_ref) {
          keptRefs.add(c.parent_ref);
        }
      }
      const refToKey = saved.collections;
      const partsToCreate = collections.filter(
        (c) => c.kind === "part" && keptRefs.has(c.ref),
      );
      const sectionsToCreate = collections.filter(
        (c) => c.kind === "section" && keptRefs.has(c.ref),
      );
      trackStep({
        label: t("exercise.import.aiExtract.stepCollections", "Saving parts & sections"),
        done: 0,
        total: partsToCreate.length + sectionsToCreate.length,
      });
      // Only the PART is scoped. A section reaches the same readers through
      // `collection#parent`, so scoping it as well is a second tuple to keep in
      // step when the part is re-scoped, for no extra reach. In test mode this
      // is empty and the parts get their reach from the test they are linked to
      // in step 4 instead.
      const libraryScope =
        mode === "exercises" ? scopeToCollectionBody(newTestScope) : {};
      for (const part of partsToCreate) {
        if (refToKey.has(part.ref)) {
          stepDone();
          continue;
        }
        const created = await createCollection({
          kind: "part",
          title: part.title ?? undefined,
          instruction: part.instruction ?? undefined,
          passage_title: part.passage_title ?? undefined,
          passage: part.passage ?? undefined,
          position: part.position ?? undefined,
          source: "import",
          ...libraryScope,
        });
        refToKey.set(part.ref, created.appsheet_key);
        stepDone();
      }
      for (const section of sectionsToCreate) {
        if (refToKey.has(section.ref)) {
          stepDone();
          continue;
        }
        const created = await createCollection({
          kind: "section",
          parent_key: section.parent_ref
            ? refToKey.get(section.parent_ref)
            : undefined,
          // Sent like the part's; left out, a title typed in the review would be
          // silently dropped.
          title: section.title ?? undefined,
          instruction: section.instruction ?? undefined,
          passage_title: section.passage_title ?? undefined,
          passage: keptPassage(section.ref, section.passage) ?? undefined,
          info: section.info ?? undefined,
          prompts: section.info?.layout === "topic-pool" ? cleanPrompts(section.prompts) ?? undefined : undefined,
          position: section.position ?? undefined,
          source: "import",
        });
        refToKey.set(section.ref, created.appsheet_key);
        stepDone();
      }

      // 3. Questions, carrying their collection membership. No test_key here —
      //    test linking happens per collection below, so the group is one unit.
      //    `collection_order` is the question's place in the reviewed order of
      //    its collection.
      const nodeToExerciseKey = saved.questions;
      trackStep({
        label: t("exercise.import.aiExtract.stepQuestions", "Saving questions"),
        done: 0,
        total: keep.length,
      });

      // The API reads `collection_order` as "insert here", clamped to the
      // questions the collection already holds, so a collection's questions are
      // posted one after another in reviewed order (`chainsBy` below); posted
      // together they land in arrival order. Separate collections still save
      // in parallel.
      const orderOf = new Map<string, number>();
      const sectionCounter = new Map<string, number>();
      for (const item of keep) {
        const collectionKey = item.collectionRef
          ? refToKey.get(item.collectionRef)
          : undefined;
        if (collectionKey && item.collectionRef) {
          const n = sectionCounter.get(item.collectionRef) ?? 0;
          orderOf.set(item.node.id, n);
          sectionCounter.set(item.collectionRef, n + 1);
        } else {
          orderOf.set(item.node.id, item.collectionOrder ?? 0);
        }
      }

      // No "choose N" cap is stamped here: the API counts the group the test
      // links when it grades (`_choose_n_answer_key`), so discarding or adding a
      // question can never leave a stale cap behind.
      // Every question on a test sits in a part: loose ones go in a "Questions"
      // part, made here and linked with the others in step 4.
      const looseKeep = keep.filter((item) => !item.collectionRef);
      if (target && looseKeep.length && !saved.questionsPart) {
        saved.questionsPart = (await createCollection({ kind: "part", title: QUESTIONS_PART_TITLE, source: "import" })).appsheet_key;
      }
      const questionsPartKey = target && looseKeep.length ? (saved.questionsPart ?? undefined) : undefined;
      const looseOrder = new Map(looseKeep.map((item, index) => [item.node.id, index]));
      const collectionKeyOf = (item: (typeof keep)[number]) =>
        item.collectionRef ? refToKey.get(item.collectionRef) : questionsPartKey;
      const saveOne = async (item: (typeof keep)[number]) => {
        if (nodeToExerciseKey.has(item.node.id)) {
          stepDone();
          return;
        }
        const collectionKey = collectionKeyOf(item);
        const created = await createExercise.mutateAsync({
          ...nodeToExercisePost(item.node, "import"),
          ...(importTags.length ? { tags: importTags } : {}),
          ...(collectionKey
            ? {
                collection_key: collectionKey,
                collection_order: item.collectionRef
                  ? orderOf.get(item.node.id) ?? 0
                  : looseOrder.get(item.node.id) ?? 0,
              }
            : {}),
        });
        // Safe without a lock: the runtime is single-threaded, so a Map write
        // between awaits cannot interleave with another job's.
        nodeToExerciseKey.set(item.node.id, created.appsheet_key);
        stepDone();
      };
      await runPool(
        chainsBy(keep, collectionKeyOf).map((chain) => async () => {
          for (const item of chain) await saveOne(item);
        }),
        SAVE_CONCURRENCY,
      );

      // 4. Link each part to the target test as one unit.
      if (target) {
        trackStep({ label: t("exercise.import.aiExtract.stepLinking", "Adding to the test"), done: 0, total: 0 });
        for (const part of collections.filter(
          (c) => c.kind === "part" && refToKey.has(c.ref),
        )) {
          const partKey = refToKey.get(part.ref)!;
          if (saved.linked.has(partKey)) continue;
          const timers = partTimersBody(part.timers ?? EMPTY_PART_TIMERS);
          await linkCollectionToTest(target, partKey, "timers" in timers ? timers.timers : {});
          saved.linked.add(partKey);
        }
        if (questionsPartKey && !saved.linked.has(questionsPartKey)) {
          await linkCollectionToTest(target, questionsPartKey);
          saved.linked.add(questionsPartKey);
        }
      }

      // 5. The audio queued in the review, onto the parts and sections it plays for
      //    (now that they exist), or onto the test. One whose part was discarded is skipped.
      if (pendingAudio.length) {
        trackStep({ label: t("exercise.import.aiExtract.stepAudio", "Attaching audio"), done: 0, total: pendingAudio.length });
        for (const rec of pendingAudio) {
          if (saved.recordings.has(rec.id)) continue;
          const owner =
            rec.placement === IMPORT_AUDIO_TEST
              ? target ? { owner_kind: "test" as const, owner_key: target } : null
              : refToKey.has(rec.placement) ? { owner_kind: "collection" as const, owner_key: refToKey.get(rec.placement)! } : null;
          if (owner) await createRecording.mutateAsync({ ...owner, title: rec.title, media: rec.upload.media });
          saved.recordings.add(rec.id);
        }
      }

      if (target) {
        queryClient.invalidateQueries({
          queryKey: testingKeys.testExercises(target),
        });
      }

      savedRef.current = emptySaveProgress();
      setSavedTestKey(target);
      setSavedPartCount(partsToCreate.length);
      setCount(keep.length);
      setSaveOpen(false);
      setPhase("done");
    } catch (err) {
      // Lead with the server's reason when it gave one (e.g. a registry
      // rejection on one question), then the partial-state warning.
      const detail = err instanceof ApiError ? err.detail : undefined;
      const step = saveStepRef.current;
      const reached = step
        ? step.total > 0
          ? t("exercise.import.aiExtract.stoppedAtCount", "Stopped at {step} {done} of {total}. ", {
              step: step.label.toLowerCase(),
              done: step.done,
              total: step.total,
            })
          : t("exercise.import.aiExtract.stoppedAt", "Stopped at {step}. ", {
              step: step.label.toLowerCase(),
            })
        : "";
      toast.error(
        (detail ? `${detail} — ` : "")
          + reached
          + t(
            "exercise.import.aiExtract.resumeSave",
            "Save again to carry on from there: what was already saved is not sent twice. Leaving this page loses that.",
          ),
        { duration: 15000 },
      );
    } finally {
      setSaving(false);
      trackStep(null);
    }
  }

  const canStart = text.trim().length > 0 || file !== null;
  const progressPct =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  // What the save has actually done, on the save page while it runs. The run is
  // a sequence of REST calls and is NOT transactional, so this is both a
  // progress bar and, if it stops, the record of how far it got.
  const saveProgress = saveStep ? (
    <div className="space-y-1.5 rounded-2xl border bg-card p-3">
      <p className="flex items-center gap-1.5 text-xs font-bold text-foreground">
        <Loader2 className="size-3.5 animate-spin text-lav-700" />
        {saveStep.label}
        {saveStep.total > 0 ? (
          <span className="font-mono tabular-nums text-muted-foreground">
            {saveStep.done} / {saveStep.total}
          </span>
        ) : null}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-mint-500 transition-all duration-300"
          style={{
            width: `${
              saveStep.total > 0
                ? Math.round((saveStep.done / saveStep.total) * 100)
                : 100
            }%`,
          }}
        />
      </div>
      <p className="text-[11px] font-semibold text-muted-foreground">
        {t(
          "exercise.import.aiExtract.dontClose",
          "Don’t close this tab — questions are saved one at a time.",
        )}
      </p>
    </div>
  ) : null;

  // The review is the runner; it steps aside only for a part's or section's
  // settings, the reorder and the save dialog.
  const runnerOpen = !selectedCollectionRef && !reordering && !saveOpen;

  // Where the import stands, for its steps in the runner frame's top bar.
  const importStep: ImportStep =
    phase === "idle"
      ? "source"
      : phase === "detecting"
        ? "detect"
        : phase === "choosing"
          ? "choose"
          : phase === "done" || saving || saveOpen
            ? "save"
            : extracting
              ? "extract"
              : "review";
  const stepCounts: ImportStepCounts = {
    chosen: phase === "choosing" ? chosenUnits.size : undefined,
    read: phase === "review" ? tally.read : undefined,
    expected: phase === "review" ? tally.expected : undefined,
    kept: phase === "review" ? keptCount : undefined,
    needAnswers,
    discarded: dropped.size,
    saving: saveStep ? (saveStep.total > 0 ? `${saveStep.label} · ${saveStep.done}/${saveStep.total}` : saveStep.label) : null,
    done: phase === "done",
    onNeedAnswers: () => {
      const first = orderedKept.find((item) => needAnswerIds.has(item.node.id));
      if (!first) return;
      setSelectedCollectionRef(null);
      setSaveOpen(false);
      setSelectedId(first.node.id);
    },
  };
  // Where a queued recording can play: the test (when there will be one), each part, each section.
  const audioPlacements: AudioPlacement[] = [
    ...(mode === "exercises" ? [] : [{ value: IMPORT_AUDIO_TEST, label: t("exercise.import.importAudio.wholeTest", "The whole test") }]),
    ...collections
      .filter((c) => c.kind === "part")
      .flatMap((part, index) => {
        const partLabel = part.title?.trim() || t("exercise.import.detectPicker.partNumber", "Part {n}", { n: index + 1 });
        const sections = collections.filter((c) => c.kind === "section" && c.parent_ref === part.ref);
        return [
          { value: part.ref, label: partLabel },
          ...sections.map((section, n) => ({
            value: section.ref,
            label: `${partLabel} · ${section.instruction?.trim().slice(0, 48) || t("exercise.import.importAudio.sectionN", "Section {n}", { n: n + 1 })}`,
          })),
        ];
      }),
  ];
  const audio = {
    count: pendingAudio.length,
    content: <ImportAudioPanel recordings={pendingAudio} placements={audioPlacements} onChange={setPendingAudio} />,
  };
  const steps = <ImportSteps current={importStep} counts={stepCounts} />;
  const stepsBar = <ImportStepsBar current={importStep} counts={stepCounts} />;
  // Exit leaves the import for the dashboard; once the AI has read anything, only after a confirm.
  const exitImport = async () => {
    const unsaved = phase !== "idle" && phase !== "done";
    if (
      unsaved &&
      !(await confirmAction(leaveConfirm))
    ) {
      return;
    }
    resetImport(false);
    navigate(importOptions().homeRoute);
  };
  // Back from the choice: to the source, or to the open review a further file was read into.
  const leaveChoose = () => {
    setDetection(null);
    setPhase(appending ? "review" : "idle");
    setAppending(false);
  };
  const chooseCount = phase === "choosing" && detection ? chosenQuestionCount(detection.structure, chosenUnits) : 0;
  const saveReady = importSaveReady({ mode, testKey, newTestName, newTestScope, tags: importTags });

  return (
    <TeacherShell
      title={
        mode === "exercises"
          ? t("exercise.import.aiExtract.titleQuestions", "AI import · questions")
          : t("exercise.import.aiExtract.titleTest", "AI import · test")
      }
    >
      {/* Whole-screen indicator for the single detect call, so a long paper
          never looks stuck on a spinner inside a card. Replaced the moment the
          paper structure is known and the review opens with skeletons. */}
      {phase === "detecting" ? (
        <ImportFrame steps={steps} stepsBar={stepsBar} onExit={exitImport} pageKey="detect">
          {/* A further file's read can't be cancelled alone: the reset would take the open review with it. */}
          <DetectingScreen onCancel={appending ? undefined : () => resetImport(true)} />
        </ImportFrame>
      ) : null}

      <div className={cn(phase === "review" ? "w-full lg:flex lg:min-h-0 lg:flex-1 lg:flex-col" : "mx-auto max-w-3xl space-y-6")}>
        {phase === "idle" ? (
          <ImportFrame
            steps={steps}
            stepsBar={stepsBar}
            onExit={exitImport}
            pageKey="source"
            primary={
              <Button disabled={!canStart} onClick={() => void start({ file, text, note })}>
                <Sparkles className="size-4" />
                {t("exercise.import.aiExtract.importWithAi", "Import with AI")}
              </Button>
            }
          >
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Asked FIRST, before the paper: the two modes read the same paper
                but file it differently, and one of them requires tags — which
                is not a thing to spring on a teacher at the save dialog after
                they have checked forty questions. It is also the only way to
                reach exercise mode from the sidebar's single AI import tab. */}
            {importOptions().libraryMode ? <ImportModeChoice mode={mode} onChange={changeMode} /> : null}

            {/* A file input takes a drop only on itself, and this one is
                sr-only — without these handlers the browser opened the file. */}
            <label
              {...tourAnchorProps(TOUR_ANCHORS.importSource)}
              className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-2 border-dashed bg-muted/40 p-5 text-center sm:p-10 transition-colors hover:border-rose-300", dragging && "border-rose-300 bg-rose-50")}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                setDragging(true);
              }}
              onDragLeave={(event) => {
                // dragleave also fires on entering a child span.
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                const dropped = event.dataTransfer.files[0];
                if (!dropped) return;
                // `accept` filters the picker only, never a drop.
                if (!UPLOAD_TYPES.includes(dropped.type)) {
                  toast.error(t("exercise.import.aiExtract.dropInvalid", "Drop a PDF or a PNG, JPEG or WebP image."));
                  return;
                }
                setFile(dropped);
              }}
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-rose-100 text-rose-700"><Upload className="size-6" /></span>
              <span className="mt-2 text-sm font-bold text-foreground">{t("exercise.import.aiExtract.upload", "Upload a PDF or an image")}</span>
              <span className="text-xs font-semibold text-muted-foreground">
                {file
                  ? t("exercise.import.aiExtract.selected", "Selected: {name}", { name: file.name })
                  : (
                    // Nothing to drag on a phone.
                    <span className="max-sm:hidden">{t("exercise.import.aiExtract.dragDrop", "or drag and drop your worksheet here")}</span>
                  )}
              </span>
              {/* PDF and images only: the import endpoint takes those mime
                  types inline. A .docx would need converting server-side. */}
              <input type="file" accept={UPLOAD_TYPES.join(",")} className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>

            <div className="flex items-center gap-3 text-xs font-extrabold text-muted-foreground"><span className="h-px flex-1 bg-border" />{t("exercise.import.aiExtract.orPaste", "or paste text")}<span className="h-px flex-1 bg-border" /></div>

            <Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={t("exercise.import.aiExtract.pastePlaceholder", "Paste the questions from your existing test or worksheet...")} className="min-h-40 rounded-2xl border-2 p-4 leading-7" />

            {/* An instruction, unlike the paper: the extractor follows it on
                every call, and is told the paper itself is only content. */}
            <div className="space-y-1.5">
              <label htmlFor="ai-import-note" className="text-xs font-extrabold text-muted-foreground">{t("exercise.import.aiExtract.noteLabel", "Note for the AI (optional)")}</label>
              <Textarea id="ai-import-note" value={note} maxLength={2000} onChange={(event) => setNote(event.target.value)} placeholder={t("exercise.import.aiExtract.notePlaceholder", "e.g. The answer key is on the last page. Part 2 is a listening task.")} className="min-h-20 rounded-2xl border-2 p-4" />
            </div>

            <p className="text-center text-xs font-semibold text-muted-foreground">
              {t("exercise.import.aiExtract.onlyOneQuestion", "Only have one question?")}{" "}
              <Link to={importOptions().exerciseNewRoute} className="font-bold text-rose-700 underline-offset-2 hover:underline">
                {t("exercise.import.aiExtract.writeManually", "Write it manually")}
              </Link>
              .
            </p>
          </div>
          </ImportFrame>
        ) : null}

        {phase === "choosing" && detection ? (
          <ImportFrame
            steps={steps}
            stepsBar={stepsBar}
            onExit={exitImport}
            pageKey="choose"
            back={
              <Button variant="ghost" onClick={leaveChoose}>
                {t("exercise.import.detectPicker.back", "Back")}
              </Button>
            }
            primary={
              <Button disabled={chooseCount === 0} onClick={extractChosen}>
                <Sparkles className="size-4" />
                {chooseCount === 0
                  ? t("exercise.import.detectPicker.chooseSomething", "Choose Something to Import")
                  : chooseCount === 1
                    ? t("exercise.import.detectPicker.importOne", "Import 1 Question")
                    : t("exercise.import.detectPicker.importOther", "Import {n} Questions", { n: chooseCount })}
              </Button>
            }
          >
            <div className="mx-auto max-w-3xl">
              <DetectedUnitPicker
                hideActions
                structure={detection.structure}
                chosen={chosenUnits}
                onChange={setChosenUnits}
                onBack={leaveChoose}
                onExtract={extractChosen}
                onRetype={(ref, task) =>
                  setDetection((current) => (current ? { ...current, structure: retypeDetectedSection(current.structure, ref, task) } : current))
                }
              />
            </div>
          </ImportFrame>
        ) : null}

        {phase === "review" ? (
          // A column that takes the shell's whole pane: the action bar stays put and
          // the workspace below scrolls INTERNALLY (nav + detail each own their
          // scroll), so the page itself doesn't grow past the fold on a long paper.
          <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
            {/* Action bar: ONE row. Status reads as chips rather than two lines
                of prose, and the extract/save progress is a hairline strip below,
                so the bar stays small on a screen whose whole job is showing one
                question. */}
            <div className="shrink-0 rounded-2xl border bg-card px-4 py-2.5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                {/* Only what is true of the WHOLE import. The per-question
                    counts sit on the rail, which is the thing they count. */}
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  {extracting ? (
                    <StatusChip tone="busy">
                      <Loader2 className="size-3 animate-spin" />
                      {t("exercise.import.aiExtract.readingCount", "Reading · {read} of {expected} questions", { read: tally.read, expected: tally.expected })}
                    </StatusChip>
                  ) : (
                    <StatusChip tone="ready">
                      {t("exercise.import.aiExtract.readyToSave", "{n} ready to save", { n: keptCount })}
                    </StatusChip>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* No "Add question" here: it would have to GUESS a destination
                      from whatever happened to be selected. Every part and
                      section carries its own `+`, where the target is the thing
                      you clicked next to. Reorder sits on the rail for the same
                      reason — it acts on that list. */}
                  {/* Not "as drafts" — there is no draft state; what the
                      review saves is finished. It opens the save dialog, which
                      is where the import's destination is chosen. */}
                  {/* A paper split across scans, or a second paper's parts:
                      read into THIS review rather than a separate import. */}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={saving}
                    onClick={() => setAddOpen(true)}
                  >
                    <Plus className="size-4" />
                    {t("exercise.import.aiExtract.addFile", "Add a File")}
                  </Button>
                  <Button
                    size="sm"
                    disabled={!canSave}
                    onClick={() => {
                      if (readyToSave()) setSaveOpen(true);
                    }}
                  >
                    <Check className="size-4" />
                    {saving
                      ? t("exercise.import.aiExtract.saving", "Saving…")
                      : extracting
                        ? t("exercise.import.aiExtract.reading", "Reading…")
                        : orderOverride
                          ? t("exercise.import.aiExtract.saveInOrder", "Save {n} in Order", { n: keptCount })
                          : t("exercise.import.aiExtract.saveCount", "Save {n}", { n: keptCount })}
                  </Button>
                </div>
              </div>

              {extracting ? (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-lav-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              ) : null}

            </div>

            {/* Where the import is filed — the destination, and a new test's
                name and scope. A dialog rather than the action bar, where a
                select that grows two more rows for "a new test" would break a
                strip whose whole point is to stay one row. */}
            <QuickKeyDialog open={keyOpen} onOpenChange={setKeyOpen} onApply={applyKey} />
            <AddSourceDialog
              open={addOpen}
              onOpenChange={setAddOpen}
              defaultNote={note}
              onRead={(source) => {
                setAddOpen(false);
                void start(source, true);
              }}
            />

            {saveOpen ? (
            // The save is the import's last page, in the same frame: Back returns to the review.
            <ImportFrame
              steps={steps}
              stepsBar={stepsBar}
              onExit={exitImport}
              pageKey="save"
              back={
                <Button variant="ghost" disabled={saving} onClick={() => setSaveOpen(false)}>
                  {t("exercise.import.aiExtract.backToReview", "Back to Review")}
                </Button>
              }
              primary={
                <Button type="submit" form={SAVE_IMPORT_FORM} disabled={!saveReady || saving}>
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                  {saving ? t("exercise.import.aiExtract.saving", "Saving…") : t("exercise.import.saveImport.saveCount", "Save {n}", { n: keptCount })}
                </Button>
              }
            >
            {saveProgress}
            {/* Locked while the save runs: the page stays up to show its progress. */}
            <fieldset disabled={saving} className="contents">
            <SaveImportDialog
              asPage
              open={saveOpen}
              onOpenChange={setSaveOpen}
              mode={mode}
              tests={tests ?? []}
              testKey={testKey}
              onTestKeyChange={setTestKey}
              newTestName={newTestName}
              onNewTestNameChange={setNewTestName}
              newTestScope={newTestScope}
              onNewTestScopeChange={setNewTestScope}
              tags={importTags}
              onTagsChange={setImportTags}
              tagSuggestions={[
                ...new Set(
                  [...(tagSuggestions ?? []), ...(creatingTest ? testTagSuggestions ?? [] : [])]
                    .map((option) => option.tag),
                ),
              ]}
              questionCount={keptCount}
              ordered={orderOverride !== null}
              // The page stays up while saving, and a save that stops leaves it
              // here to try again. Questions still needing a key send the
              // teacher back to the review, where they are fixed.
              onConfirm={() => {
                if (!readyToSave()) {
                  setSaveOpen(false);
                  return;
                }
                void save();
              }}
            />
            </fieldset>
            </ImportFrame>
            ) : null}

            {reordering ? (
              <div className="min-h-0 flex-1 rounded-2xl border bg-card p-4 shadow-sm lg:overflow-y-auto">
                <ExerciseReorderList
                  rows={reorderRows}
                  heading={
                    <p className="text-sm font-semibold text-muted-foreground">
                      {t(
                        "exercise.import.aiExtract.reorderHint",
                        "Drag to set the order students will see. A section moves as one block; drag a question inside a section to reorder it there. Nothing is saved until the import is.",
                      )}
                    </p>
                  }
                  saveLabel={t("exercise.import.aiExtract.useThisOrder", "Use This Order")}
                  onSave={(order) => {
                    dispatch({ type: "setOrder", order });
                    setReordering(false);
                  }}
                  onCancel={() => setReordering(false)}
                />
              </div>
            ) : (
              // The workspace: a tinted canvas so the white cards read clearly
              // against it (the plain cream page gives almost no separation). Both
              // columns scroll on their own inside the bounded height.
              <div className="grid min-h-0 flex-1 gap-3 rounded-3xl border bg-muted/40 p-3 lg:grid-cols-[minmax(0,220px)_1fr] lg:overflow-hidden">
                {/* Compact numbered navigator — jump to any question without
                    scrolling a wall of cards. */}
                <div className="rounded-2xl border bg-card p-3 lg:overflow-y-auto">
                  <ExtractionQuestionNav
                    entries={rail as NavEntry[]}
                    status={{
                      total: keptCount,
                      needAnswers,
                      pending: dropped.size,
                      pendingLabel: t("exercise.import.aiExtract.discarded", "discarded"),
                    }}
                    reordering={reordering}
                    onReorder={
                      extracting ? undefined : () => setReordering((v) => !v)
                    }
                    activeId={activeEntry?.id ?? null}
                    dropped={dropped}
                    needsAnswer={needAnswerIds}
                    onSelect={(id) => {
                      setSelectedCollectionRef(null);
                      setSelectedId(id);
                    }}
                    onSelectCollection={setSelectedCollectionRef}
                    onAdd={(ref) => {
                      setSelectedCollectionRef(null);
                      addQuestion(ref);
                    }}
                    onAddCollection={addCollectionInRunner}
                    onAddLoose={() => {
                      setSelectedCollectionRef(null);
                      addQuestion(null);
                    }}
                  />
                </div>

                {/* Detail: the selected question, or a skeleton while it extracts.
                    The part/section context shows first, then the editable
                    question with its answer marked green — no separate answer
                    card. */}
                <div className="lg:overflow-y-auto lg:pr-1">
                  {/* A part/section opened on its own — how one with no questions
                      yet gets named. It takes precedence over the selected
                      question, and picking a question in the rail closes it. */}
                  {selectedCollection ? (
                    <CollectionPane
                      collection={selectedCollection}
                      parent={selectedCollectionParent}
                      sectionTypes={sectionTypesOf(selectedCollection.ref)}
                      hunt={huntRefs.has(selectedCollection.ref)}
                      onHuntChange={setHunt}
                      onChange={updateCollection}
                      onAddQuestion={() => {
                        setSelectedCollectionRef(null);
                        addQuestion(selectedCollection.ref);
                      }}
                      onClose={() => setSelectedCollectionRef(null)}
                    />
                  ) : activeEntry && paper.nodes.length > 0 ? (
                    <div className="space-y-4">
                      {runnerOpen ? (
                      <RunnerEditor
                        // The review IS the runner: its Exit leaves the import, as on every other step.
                        onExit={() => void exitImport()}
                        finish={{
                          // While questions still lack an answer the button says so, and takes the teacher to the first.
                          label:
                            needAnswers > 0
                              ? t("exercise.import.aiExtract.needAnswerShort", "{n} to answer", { n: needAnswers })
                              : t("exercise.import.aiExtract.saveCount", "Save {n}", { n: keptCount }),
                          disabled: !canSave,
                          onFinish: () => {
                            if (readyToSave()) setSaveOpen(true);
                          },
                        }}
                        banner={issuesBanner}
                        steps={steps}
                        stepsBar={stepsBar}
                        audio={audio}
                        toolbar={
                          <Button
                            {...tourAnchorProps(TOUR_ANCHORS.importAnswerKey)}
                            size="icon"
                            variant="outline"
                            disabled={extracting}
                            title={t("exercise.import.quickKey.open", "Paste Answer Key")}
                            aria-label={t("exercise.import.quickKey.open", "Paste Answer Key")}
                            onClick={() => setKeyOpen(true)}
                          >
                            {/* An icon alone: with its label the top bar's buttons wrap onto a second line. */}
                            <KeyRound className="size-4" />
                          </Button>
                        }
                        onCollectionChange={(ref, patch) => updateCollection(ref, patch)}
                        sectionSettings={(stub) => {
                          if (!stub) return null;
                          const section = stub.kind === "section" ? collections.find((c) => c.ref === stub.appsheet_key) : undefined;
                          const partRef = stub.kind === "part" ? stub.appsheet_key : (stub.parent?.appsheet_key ?? null);
                          // Everything the settings pane held, in the drop-down itself.
                          const part = partRef ? collections.find((c) => c.ref === partRef) ?? null : null;
                          return (
                            <HeadingExtras
                              part={part}
                              section={section ?? null}
                              onChange={updateCollection}
                              sectionTypes={section ? sectionTypesOf(section.ref) : []}
                              hunt={section ? huntRefs.has(section.ref) : false}
                              onHuntChange={setHunt}
                              marks={section ? marksOf(section.ref) : null}
                              onMarksChange={setSectionMarks}
                            />
                          );
                        }}
                        topicPrompts={(ref) => {
                          const pool = collections.find((c) => c.ref === ref);
                          return pool?.info?.layout === "topic-pool"
                            ? { prompts: pool.prompts ?? [], onChange: (prompts) => updateCollection(ref, { prompts }) }
                            : null;
                        }}
                        onAddQuestion={(ref) => addQuestion(ref)}
                        navActions={(stub, close) => {
                          const partRef = stub?.kind === "part" ? stub.appsheet_key : (stub?.parent?.appsheet_key ?? null);
                          return (
                            <AddToTestDialog
                              onDone={close}
                              choices={[
                                {
                                  key: "question",
                                  icon: <Plus className="size-5" />,
                                  title: t("exercise.import.addToTest.question", "New question"),
                                  description: t("exercise.import.addToTest.questionHere", "Added next to the one you are on."),
                                  onSelect: () => addQuestion(stub?.appsheet_key ?? null),
                                },
                                {
                                  key: "section",
                                  icon: <Plus className="size-5" />,
                                  title: t("exercise.import.addToTest.section", "New section"),
                                  description: t("exercise.import.addToTest.sectionHint", "A group of questions in the current part."),
                                  onSelect: () => addCollectionInRunner("section", partRef),
                                },
                                {
                                  key: "part",
                                  icon: <Plus className="size-5" />,
                                  title: t("exercise.import.addToTest.part", "New part"),
                                  description: t("exercise.import.addToTest.partHint", "A top-level part of the test."),
                                  onSelect: () => addCollectionInRunner("part", null),
                                },
                                {
                                  // A paper split across scans, or a second paper's parts: read into this review.
                                  key: "file",
                                  icon: <Upload className="size-5" />,
                                  title: t("exercise.import.aiExtract.addFile", "Add a File"),
                                  description: t("exercise.import.aiExtract.addFileHint", "Read another file or more pages into this import."),
                                  onSelect: () => setAddOpen(true),
                                },
                              ]}
                            />
                          );
                        }}
                        // A run dragged in the question list joins the order the save applies.
                        onReorder={
                          extracting
                            ? undefined
                            : (_ref, ids) =>
                                dispatch({
                                  type: "setOrder",
                                  order: placeInOrder(orderOverride ?? orderedKept.map((item) => item.node.id), ids),
                                })
                        }
                        // A part or section dragged to a new place moves it in the
                        // draft, so the paper and the save both follow.
                        onMoveCollection={
                          extracting
                            ? undefined
                            : (move) => dispatch({ type: "moveCollection", move: draftMoveFromNav(move, paper.shown) })
                        }
                        nodes={paper.nodes}
                        collectionByNode={paper.collectionByNode}
                        selectedId={activeEntry.id}
                        pendingIds={paper.pendingIds}
                        onSelect={(id) => {
                          setSelectedCollectionRef(null);
                          setSelectedId(id);
                        }}
                        onNodeChange={updateNode}
                        onPassageChange={(ref, passage) => updateCollection(ref, { passage })}
                        onBlanksMove={moveBlanks}
                        questionOptions={(node) => ({
                          canRetype: manualIds.has(node.id),
                          // The LIBRARY value: nothing is saved yet, so this is the
                          // question's own default, which the test link copies.
                          points: node.points,
                          onPointsChange: (points) => updateNode(node.id, { ...node, points }),
                          dimmed: dropped.has(node.id),
                          actions: (
                            <Button
                              {...tourAnchorProps(TOUR_ANCHORS.importDiscard)}
                              size="sm"
                              variant={dropped.has(node.id) ? "default" : "outline"}
                              onClick={() => toggleDropped(node.id)}
                            >
                              {dropped.has(node.id) ? (
                                <>
                                  <Check className="size-4" />
                                  {t("exercise.import.aiExtract.keep", "Keep")}
                                </>
                              ) : (
                                <>
                                  <X className="size-4" />
                                  {t("exercise.import.aiExtract.discard", "Discard")}
                                </>
                              )}
                            </Button>
                          ),
                        })}
                      />
                      ) : null}
                      <ContextEditor
                        part={activePart}
                        section={activeSection}
                        onChange={updateCollection}
                        sectionMarks={sectionMarks}
                        onSectionMarksChange={setSectionMarks}
                        showWordBank={gapFamily}
                        sectionTypes={sectionTypesOf(activeSection?.ref)}
                        hunt={activeSection ? huntRefs.has(activeSection.ref) : false}
                        onHuntChange={setHunt}
                      />
                    </div>
                  ) : !extracting && allItems.length === 0 ? (
                    // Every call has answered and none brought a question back:
                    // say so, rather than a skeleton that never resolves.
                    <div className="space-y-4 rounded-3xl border bg-card p-6 text-center shadow-sm">
                      <h2 className="text-lg font-extrabold">
                        {t("exercise.import.aiExtract.nothingReadTitle", "No questions could be read from this paper")}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {t("exercise.import.aiExtract.nothingReadBody", "Try the sections again, or go back and add a note for the AI about how the paper is laid out.")}
                      </p>
                      <ExtractIssues className="text-left" issues={issues} retrying={retrying} onRetry={(ref) => void importDraft.retry(ref)} />
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button
                          disabled={retrying.size > 0}
                          onClick={() => issues.forEach((issue) => void importDraft.retry(issue.ref))}
                        >
                          {t("exercise.import.aiExtract.retryAll", "Retry All")}
                        </Button>
                        <Button variant="outline" onClick={() => resetImport(true)}>
                          {t("exercise.import.aiExtract.backToSource", "Back to the Paper")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // The selected question's extract call hasn't returned yet.
                    <DetailSkeleton label={t("exercise.import.aiExtract.extractingQuestion", "Extracting this question…")} />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {phase === "done" ? (
          <ImportFrame steps={steps} stepsBar={stepsBar} onExit={exitImport} pageKey="done">
          <StatusScreen
            icon={Check}
            tone="mint"
            title={t("exercise.import.aiExtract.savedTitle", "Import saved")}
            description={
              count === 1
                ? savedTestKey
                  ? t("exercise.import.aiExtract.savedOneTest", "1 question is now in your library and added to the test.")
                  : t("exercise.import.aiExtract.savedOne", "1 question is now in your library.")
                : savedTestKey
                  ? t("exercise.import.aiExtract.savedOtherTest", "{n} questions are now in your library and added to the test.", { n: count })
                  : t("exercise.import.aiExtract.savedOther", "{n} questions are now in your library.", { n: count })
            }
          >
            <Button
              size="lg"
              className="w-full"
              onClick={() =>
                navigate(
                  savedTestKey
                    ? teacherTestRoute(savedTestKey)
                    : importOptions().exercisesRoute,
                )
              }
            >
              {savedTestKey
                ? t("exercise.import.aiExtract.openTest", "Open the Test")
                : t("exercise.import.aiExtract.viewInLibrary", "View in Library")}
            </Button>
            {/* A library import of a reading paper is mostly PARTS — the
                passages the questions hang off — and the question list is not
                where you go to reuse one. Offered only when this import made
                some, and only when there is no test, since a test import ends
                on the test. */}
            {!savedTestKey && savedPartCount > 0 ? (
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => navigate(importOptions().partsRoute)}
              >
                {savedPartCount === 1
                  ? t("exercise.import.aiExtract.viewPartOne", "View the Part")
                  : t("exercise.import.aiExtract.viewPartOther", "View All {n} Parts", { n: savedPartCount })}
              </Button>
            ) : null}
            {/* The second thing a teacher does after an import is another
                import, so it is offered here without navigating away. */}
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => resetImport(false)}
            >
              {t("exercise.import.aiExtract.importAnother", "Import Another Paper")}
            </Button>
          </StatusScreen>
          </ImportFrame>
        ) : null}
      </div>
    </TeacherShell>
  );
}

// Editable part/section text (title, instruction, passage) for the active
// question. Open by default — it's the shared context the question hangs off,
// and the first thing a teacher reads to judge the extraction — but collapsible
// so it can be tucked away once checked.
// A part/section opened on its own, with no question selected.
//
// The detail pane is otherwise keyed on a question, so without this a newly
// created part or section, having none, could not be opened and therefore not
// named — and seeding it with a blank question would put one the teacher never
// asked for into the paper and block the save on it.
function CollectionPane({
  collection,
  parent,
  sectionTypes,
  hunt,
  onHuntChange,
  onChange,
  onAddQuestion,
  onClose,
}: {
  collection: ExtractedCollection;
  parent: ExtractedCollection | null;
  sectionTypes: string[];
  hunt: boolean;
  onHuntChange: (ref: string, hunt: boolean) => void;
  onChange: (ref: string, patch: Partial<ExtractedCollection>) => void;
  onAddQuestion: () => void;
  onClose: () => void;
}) {
  const { t } = useStableI18n();
  const isPart = collection.kind === "part";
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-foreground">
          {isPart ? t("exercise.import.aiExtract.part", "Part") : t("exercise.import.aiExtract.section", "Section")}
          <span className="ml-2 font-semibold text-muted-foreground">
            {isPart
              ? collection.title || t("exercise.import.aiExtract.untitled", "Untitled")
              : collection.title || collection.instruction || t("exercise.import.aiExtract.untitled", "Untitled")}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("exercise.import.aiExtract.backToQuestions", "Back to Questions")}
          </Button>
          <Button size="sm" onClick={onAddQuestion}>
            <Plus className="size-4" />
            {t("exercise.import.aiExtract.addQuestionHere", "Add a Question Here")}
          </Button>
        </div>
      </div>

      {/* An empty collection is NEVER saved — `keptRefs` comes from the questions
          actually kept — so say so rather than letting it look saved and vanish. */}
      <p className="rounded-2xl border-2 border-butter-300 bg-butter-bg px-4 py-2.5 text-xs font-bold text-ink-700">
        {t(
          "exercise.import.aiExtract.emptyCollectionNote",
          "Name it here, then add its questions. A part or section with no questions isn’t saved.",
        )}
      </p>

      <ContextEditor
        part={isPart ? collection : parent}
        section={isPart ? null : collection}
        onChange={onChange}
        sectionTypes={sectionTypes}
        hunt={hunt}
        onHuntChange={onHuntChange}
        defaultOpen
      />
    </div>
  );
}

function ContextEditor({
  part,
  section,
  onChange,
  showWordBank,
  defaultOpen,
  sectionMarks,
  onSectionMarksChange,
  sectionTypes = [],
  hunt = false,
  onHuntChange,
}: {
  part: ExtractedCollection | null;
  section: ExtractedCollection | null;
  onChange: (ref: string, patch: Partial<ExtractedCollection>) => void;
  /** The section's question types, to name and check its task. */
  sectionTypes?: string[];
  /** The section is set as a passage error hunt (see `huntRefs`). */
  hunt?: boolean;
  onHuntChange?: (ref: string, hunt: boolean) => void;
  /** The active question is gap-family, so this section could carry a word box. */
  showWordBank?: boolean;
  /** Start open — the collection pane exists to edit exactly this. */
  defaultOpen?: boolean;
  /** The marks shared by every question in the section, or null when mixed. */
  sectionMarks?: number | null;
  onSectionMarksChange?: (ref: string, points: number) => void;
}) {
  const { t } = useStableI18n();
  // CLOSED by default: five open textareas would push the question itself off
  // screen, and the part/section wording is usually right. The headline stays visible on the toggle, so it is still glanceable
  // and one click away when it isn't.
  const [open, setOpen] = useState(Boolean(defaultOpen));
  if (!part && !section) return null;
  const summary = [part?.title, section?.title || section?.instruction]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2 text-xs font-extrabold text-muted-foreground">
          <BookOpen className="size-4 shrink-0" />
          <span className="shrink-0">{t("exercise.import.aiExtract.partAndSection", "Part & section")}</span>
          {summary ? (
            <span className="min-w-0 truncate font-semibold normal-case tracking-normal text-ink-300">
              {summary}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open ? (
        <div className="space-y-4 border-t p-4">
          {part ? (
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold text-rose-700">
                {t("exercise.import.aiExtract.part", "Part")}
              </p>
              <Input
                value={part.title ?? ""}
                placeholder={t("exercise.import.aiExtract.partTitle", "Part title")}
                onChange={(e) => onChange(part.ref, { title: e.target.value || null })}
              />
              {/* Set on the test when the import adds the part to one. */}
              <PartTimerFields
                value={part.timers ?? EMPTY_PART_TIMERS}
                onChange={(timers) => onChange(part.ref, { timers })}
                idPrefix={`import-timer-${part.ref}`}
              />
              <Textarea
                value={part.instruction ?? ""}
                placeholder={t("exercise.import.aiExtract.partInstruction", "Part instruction")}
                className="min-h-14"
                onChange={(e) =>
                  onChange(part.ref, { instruction: e.target.value || null })
                }
              />
              {/* The passage's own heading ("The history of glass"), which the
                  runner prints over the text. Detection reads one and the save
                  sends it; without this field a misread title could only be
                  saved as read. */}
              <Input
                value={part.passage_title ?? ""}
                placeholder={t("exercise.import.aiExtract.partPassageTitle", "Part passage title")}
                onChange={(e) =>
                  onChange(part.ref, { passage_title: e.target.value || null })
                }
              />
              <PassageEditor
                value={joinPassage(part.passage)}
                rows={5}
                placeholder={t("exercise.import.aiExtract.partPassage", "Part passage")}
                onChange={(text) => onChange(part.ref, { passage: splitPassage(text) })}
              />
            </div>
          ) : null}
          {section ? (
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold text-muted-foreground">
                {t("exercise.import.aiExtract.section", "Section")}
              </p>
              {/* The section's task: shown and editable here because a
                  misdetected layout is exactly what verification exists to
                  catch, and a section made by hand has none until it is set. */}
              <SectionLayoutField
                info={section.info}
                questionTypes={sectionTypes}
                hunt={hunt}
                onHuntChange={
                  onHuntChange ? (next) => onHuntChange(section.ref, next) : undefined
                }
                onChange={(info) => onChange(section.ref, { info })}
              />
              {/* A speaking pool's topics, also edited on its question in the runner. */}
              {section.info?.layout === "topic-pool" ? (
                <SectionPromptsField
                  prompts={section.prompts}
                  onChange={(prompts) => onChange(section.ref, { prompts })}
                />
              ) : null}
              <SectionMarksField
                section={section}
                marks={sectionMarks}
                onChange={onSectionMarksChange}
              />
              {/* A section's title is optional (its instruction usually does the
                  naming) but it is a real field on the collection, and a
                  section added by hand has no other way to be given one. */}
              <Input
                value={section.title ?? ""}
                placeholder={t("exercise.import.aiExtract.sectionTitle", "Section title (optional)")}
                onChange={(e) =>
                  onChange(section.ref, { title: e.target.value || null })
                }
              />
              <Textarea
                value={section.instruction ?? ""}
                placeholder={t("exercise.import.aiExtract.sectionInstruction", "Section instruction")}
                className="min-h-14"
                onChange={(e) =>
                  onChange(section.ref, { instruction: e.target.value || null })
                }
              />
              <Input
                value={section.passage_title ?? ""}
                placeholder={t("exercise.import.aiExtract.sectionPassageTitle", "Section passage title")}
                onChange={(e) =>
                  onChange(section.ref, { passage_title: e.target.value || null })
                }
              />
              <PassageEditor
                value={joinPassage(section.passage)}
                rows={5}
                placeholder={
                  hunt || sectionTask(section.info?.layout, sectionTypes) === ERROR_HUNT
                    ? t("exercise.import.aiExtract.sectionPassageHunt", "Section passage, with its mistakes still in it")
                    : t("exercise.import.aiExtract.sectionPassage", "Section passage")
                }
                blanks={usesBlanks(section.info?.layout)}
                markup={
                  !hunt && sectionTask(section.info?.layout, sectionTypes) !== ERROR_HUNT
                }
                onChange={(text) => onChange(section.ref, { passage: splitPassage(text) })}
              />
              {/* Offered on any gap-family section, so a teacher can add the
                  box the extractor missed rather than having no way to say the
                  paper had one. */}
              <SectionWordBankField
                info={section.info}
                show={showWordBank}
                onChange={(info) => onChange(section.ref, { info })}
              />

            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// What one question in this run is worth, set once for the whole run.
//
// The extractor reads a section's marks off the paper, and this is where a
// misread gets corrected. Without it the only marks control on the review is the
// per-question one on the card, so fixing a ten-question section the extractor
// read as 1 mark would mean ten edits — and a section extracted at the wrong weight
// would usually just be saved that way.
//
// It writes to every QUESTION in the run, not to the collection. Marks are what
// a question is worth; a collection groups and displays and never grades, which
// is what gives partial credit. So this is a bulk edit of N questions wearing a
// section-level control, which is also why it reads back "Mixed" rather than a
// number: a per-question override made on the card is a real answer, and showing
// a single value here would invite flattening it by accident.
/**
 * What the runner's heading drop-down adds for the page's section and part,
 * beyond the titles and instructions it types in place: the section's task,
 * title, marks and word bank, each one's passage title, a passage where none
 * was found, and the part's timers. Everything the old settings pane held,
 * where the teacher already looks.
 */
function HeadingExtras({
  part,
  section,
  onChange,
  sectionTypes,
  hunt,
  onHuntChange,
  marks,
  onMarksChange,
}: {
  part: ExtractedCollection | null;
  section: ExtractedCollection | null;
  onChange: (ref: string, patch: Partial<ExtractedCollection>) => void;
  sectionTypes: string[];
  hunt: boolean;
  onHuntChange: (ref: string, hunt: boolean) => void;
  marks: number | null;
  onMarksChange: (ref: string, points: number) => void;
}) {
  const { t } = useStableI18n();
  // The group heading is the design system's caption (700 / 12); each field has a Label, as on the save page.
  const label = "text-xs font-bold text-muted-foreground";
  return (
    <div className="space-y-4">
      {section ? (
        <div className="space-y-2.5">
          <p className={label}>{t("exercise.import.aiExtract.section", "Section")}</p>
          <SectionLayoutField
            info={section.info}
            questionTypes={sectionTypes}
            hunt={hunt}
            onHuntChange={(next) => onHuntChange(section.ref, next)}
            onChange={(info) => onChange(section.ref, { info })}
          />
          <SectionMarksField section={section} marks={marks} onChange={onMarksChange} />
          <div className="grid gap-1.5">
            <Label htmlFor={`heading-section-title-${section.ref}`}>
              {t("exercise.import.aiExtract.sectionTitle", "Section title (optional)")}
            </Label>
            <Input
              id={`heading-section-title-${section.ref}`}
              value={section.title ?? ""}
              onChange={(e) => onChange(section.ref, { title: e.target.value || null })}
            />
          </div>
          <PassageAdder
            collection={section}
            onChange={onChange}
            titlePlaceholder={t("exercise.import.aiExtract.sectionPassageTitle", "Section passage title")}
            passagePlaceholder={
              hunt || sectionTask(section.info?.layout, sectionTypes) === ERROR_HUNT
                ? t("exercise.import.aiExtract.sectionPassageHunt", "Section passage, with its mistakes still in it")
                : t("exercise.import.aiExtract.sectionPassage", "Section passage")
            }
            blanks={usesBlanks(section.info?.layout)}
            markup={!hunt && sectionTask(section.info?.layout, sectionTypes) !== ERROR_HUNT}
          />
          {/* Offered on any gap-family section, so a box the extractor missed can be added. */}
          <SectionWordBankField
            info={section.info}
            show={sectionTypes.some((type) => type === "gap-filling" || type === "rewriting")}
            onChange={(info) => onChange(section.ref, { info })}
          />
        </div>
      ) : null}
      {part ? (
        <div className={cn("space-y-2.5", section && "border-t pt-3")}>
          <p className={label}>{t("exercise.import.aiExtract.part", "Part")}</p>
          {/* Set on the test when the import adds the part to one. */}
          <PartTimerFields
            value={part.timers ?? EMPTY_PART_TIMERS}
            onChange={(timers) => onChange(part.ref, { timers })}
            idPrefix={`heading-timer-${part.ref}`}
          />
          <PassageAdder
            collection={part}
            onChange={onChange}
            titlePlaceholder={t("exercise.import.aiExtract.partPassageTitle", "Part passage title")}
            passagePlaceholder={t("exercise.import.aiExtract.partPassage", "Part passage")}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * A part's or section's passage title, and its passage when none was found:
 * an "Add passage" button that opens the editor. A passage the page already
 * shows is edited there, with Edit passage.
 */
function PassageAdder({
  collection,
  onChange,
  titlePlaceholder,
  passagePlaceholder,
  blanks,
  markup,
}: {
  collection: ExtractedCollection;
  onChange: (ref: string, patch: Partial<ExtractedCollection>) => void;
  titlePlaceholder: string;
  passagePlaceholder: string;
  blanks?: boolean;
  markup?: boolean;
}) {
  const { t } = useStableI18n();
  const hasPassage = Boolean(collection.passage?.some((p) => p.trim()));
  const [adding, setAdding] = useState(false);
  return (
    <div className="space-y-2">
      <div className="grid gap-1.5">
        <Label htmlFor={`heading-passage-title-${collection.ref}`}>{titlePlaceholder}</Label>
        <Input
          id={`heading-passage-title-${collection.ref}`}
          value={collection.passage_title ?? ""}
          onChange={(e) => onChange(collection.ref, { passage_title: e.target.value || null })}
        />
      </div>
      {hasPassage && !adding ? null : adding ? (
        <PassageEditor
          value={joinPassage(collection.passage)}
          rows={5}
          placeholder={passagePlaceholder}
          blanks={blanks}
          markup={markup}
          onChange={(text) => onChange(collection.ref, { passage: splitPassage(text) })}
        />
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="size-4" />
          {t("exercise.import.aiExtract.addPassage", "Add passage")}
        </Button>
      )}
    </div>
  );
}

function SectionMarksField({
  section,
  marks,
  onChange,
}: {
  section: ExtractedCollection;
  marks?: number | null;
  onChange?: (ref: string, points: number) => void;
}) {
  const { t } = useStableI18n();
  if (!onChange) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <label
        htmlFor={`section-marks-${section.ref}`}
        className="text-sm font-medium text-foreground"
      >
        {t("exercise.import.aiExtract.marksEach", "Marks each")}
      </label>
      <Input
        id={`section-marks-${section.ref}`}
        type="number"
        min={0}
        step={MARKS_STEP}
        // Empty (not 0) when the run's questions disagree — 0 is a real mark
        // here, so it cannot double as "no shared value".
        value={marks ?? ""}
        placeholder={t("exercise.import.aiExtract.marksMixed", "Mixed")}
        className="w-20"
        onChange={(e) => {
          const next = Number(e.target.value);
          if (e.target.value === "" || !Number.isFinite(next) || next < 0) return;
          onChange(section.ref, marksFromInput(e.target.value));
        }}
      />
      <span className="text-xs text-muted-foreground">
        {t("exercise.import.aiExtract.marksApply", "applies to every question in this run")}
      </span>
    </div>
  );
}

/**
 * What this import is for, chosen on the source step.
 *
 * Two cards rather than a select: the choice is not a setting on the import, it
 * is which of two things the import IS, and each card has to say what it will
 * and won't do — that a test import can't stop at the library, and that an
 * exercise import will ask for tags. A select's one line of label has nowhere
 * to put that, and the consequence would only surface at the save dialog.
 */
function ImportModeChoice({
  mode,
  onChange,
}: {
  mode: ImportMode;
  onChange: (mode: ImportMode) => void;
}) {
  const { t } = useStableI18n();
  const options: Array<{
    value: ImportMode;
    icon: typeof BookOpen;
    title: string;
    detail: string;
  }> = [
    {
      value: "tests",
      icon: FileText,
      title: t("exercise.import.aiExtract.modeTestTitle", "A test"),
      detail: t(
        "exercise.import.aiExtract.modeTestDetail",
        "The paper becomes a test students can sit. Its questions join your library too.",
      ),
    },
    {
      value: "exercises",
      icon: BookOpen,
      title: t("exercise.import.aiExtract.modeLibraryTitle", "Questions for the library"),
      detail: t(
        "exercise.import.aiExtract.modeLibraryDetail",
        "The paper is read for reusable questions. No test is made, and you tag them on the way in.",
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-extrabold text-muted-foreground">
        {t("exercise.import.aiExtract.modeQuestion", "What are you importing?")}
      </p>
      {/* Two across on a phone too, without the detail lines, so the paper's
          own fields start on the first screen. */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {options.map((option) => {
          const active = mode === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex flex-col gap-1.5 rounded-2xl border-2 p-3 text-left transition-colors sm:p-4",
                active
                  ? "border-rose-400 bg-rose-50"
                  : "border-border bg-card hover:border-rose-200",
              )}
            >
              <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-rose-700" : "text-muted-foreground",
                  )}
                />
                {option.title}
              </span>
              <span className="text-xs font-semibold leading-5 text-muted-foreground max-sm:hidden">
                {option.detail}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// One fact about the run, as a chip. Chips let "12 ready · 3 need an answer ·
// 1 discarded" sit on one line and stay scannable, where prose would change
// shape depending on state.
function StatusChip({
  tone,
  children,
}: {
  tone: "ready" | "warn" | "muted" | "busy";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold",
        tone === "ready" && "bg-mint-bg text-mint-700",
        tone === "warn" && "bg-butter-bg text-butter-700",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "busy" && "bg-lav-bg text-lav-700",
      )}
    >
      {children}
    </span>
  );
}

// Detection takes ~a minute on a long paper. This is a screen in the content
// area rather than a `fixed inset-0` overlay, so the sidebar stays reachable
// and a teacher can navigate away while it waits.
function DetectingScreen({ onCancel }: { onCancel?: () => void }) {
  const { t } = useStableI18n();
  // Seconds since the read began: one model call has no progress to show, so
  // the clock is what tells a long read from a stall.
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <StatusScreen
      icon={Sparkles}
      tone="lav"
      pulseIcon
      busy
      title={t("exercise.import.aiExtract.detectingTitle", "Reading your worksheet")}
      description={t("exercise.import.aiExtract.detectingBody", "Mapping its parts, sections and questions…")}
    >
      <p className="text-center text-xs font-semibold tabular-nums text-muted-foreground">
        {t("exercise.import.aiExtract.detectingElapsed", "{n}s so far. A long paper takes up to a minute.", { n: seconds })}
      </p>
      {onCancel ? (
        <Button variant="ghost" size="sm" className="mx-auto" onClick={onCancel}>
          {t("exercise.import.aiExtract.detectingCancel", "Cancel")}
        </Button>
      ) : null}
    </StatusScreen>
  );
}
