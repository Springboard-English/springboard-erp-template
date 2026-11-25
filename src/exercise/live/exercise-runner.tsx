import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { ExercisePage } from "../components/exercise-page";
import { RecordingBar, RecordingDeck } from "../components/recording-deck";
import { deckRecordings, sessionRecordingSource } from "../lib/recording-deck";
import { HighlighterButton, HighlighterProvider, type SavedHighlights } from "../components/highlighter";
import { AnswerReceipt } from "../runner/answer-receipt";
import { SubmitConfirmDialog } from "../runner/submit-confirm-dialog";
import { PaginationBar } from "../runner/pagination-bar";
import { NotesButton } from "../runner/notes-button";
import { ExitConfirmDialog } from "../runner/exit-confirm-dialog";
import { buildPages, pageLayout, type RunPage } from "../lib/exercise-pages";
import { type ExerciseAnswer, type SpringboardTest, fileAnswerKey } from "../lib/exercises";
import { MediaPlaybackProvider, type MediaPlayback } from "../lib/media-playback";
import { clockSample, keepClockSample, mergeRoomWindows, type ClockSample, type WindowTimes } from "../lib/media-window";
import { ignoreSpaceActivation } from "../lib/keyboard";
import { AnswerFilesProvider } from "../lib/answer-files";
import { useStableI18n } from "./i18n";
import { StudentShell } from "./student-shell";
import { AttemptExpired } from "./attempt-expired";
import { ChallengeClosed } from "./challenge-closed";
import { ReviewSubmit } from "./review-submit";
import { StudentPageShell } from "./student-page-shell";
import { SubmissionConfirmation } from "./submission-confirmation";
import { WaitingRoom } from "./waiting-room";
import { FullscreenGate } from "./fullscreen-gate";
import { RetakeButton } from "./retake-button";
import { PendingPaper } from "./pending-paper";
import { TimedPartGates } from "./timed-part-gates";
import { RunnerHeading } from "./runner-heading";
import { AttemptResultView } from "./attempt-result-view";
import { RunFacts } from "./run-facts";
import { PrivacyScreen } from "./privacy-screen";
import { ExamWatermark } from "./exam-watermark-overlay";
import {
  Button,
  useAuth,
  useLiveEvent,
  type LiveEventMessage,
  ApiError,
} from "../../exports";
import {
  useParticipants,
  useLivePaper,
  useSessionRecordings,
} from "./queries";
import {
  type CollectionStub,
  type FinishReason,
  finishParticipant,
  joinLiveSession,
  listParticipantAnswers,
  listRecordingWindows,
  requestRecordingUrl,
  getParticipantResult,
  recordProctorEvent,
  sendLiveHeartbeat,
  sessionExercisesToNodes,
  submitLiveAnswer,
  type LiveSessionStatus,
  type ParticipantResult,
} from "./api";
import { AnswerOutbox, createAnswerSender, type DrainResult } from "./answer-outbox";
import { QuestionListDialog } from "./question-list-dialog";
import { unansweredNodeIds } from "./grading";
import {
  runnerPhase,
  shouldBlockCopying,
  shouldLoadPaper,
  shouldReportProctoring,
  shouldResendHighlights,
  shouldRetrySaves,
} from "./live-phase";
import { liveEventAction, type LiveSessionDoc } from "./live-channel";
import { markRequestStart, resourceTimesFor } from "./resource-timing";
import { getParticipantRecordingUrlEndpoint } from "./api";
import { timeLeftLabel } from "./due-date";
import {
  formatRemaining,
  isAttemptExpired,
  resolveRunnerDeadline,
  useServerClockOffset,
  useSessionTimer,
} from "./use-session-timer";
import { useCopyGuard } from "./use-copy-guard";
import { clockTone, dueTimeWarning } from "./exam-clock";
import { examSignature } from "./exam-signature";
import { useWindowAway } from "./use-window-away";
import { useFullscreen } from "./use-fullscreen";
import { useExamBlockReason } from "./device-support";
import { useFullscreenExempt } from "./use-fullscreen-exempt";
import { useLiveStudent } from "./live-student";
import { useProctoring } from "./use-proctoring";
import { useFeedbackSuppressed, useRunSubmittedFeedback } from "./feedback";
import { playJoinRoute } from "./config";
import { useHomeHref } from "./config";
import { useRunAnswerFiles, withEssayDocs } from "./use-answer-files";

type Step = "answer" | "review" | "submitted" | "score";
const HEARTBEAT_MS = 15_000;
// Quiet period before changed answers are sent. Long enough that typing a
// sentence is one write, short enough that a refresh costs a second of work.
const AUTOSAVE_MS = 1_500;
// How often a waiting student re-checks the run's status when the stream's
// push isn't reaching them. Slow on purpose: it is a backstop for the push,
// not the mechanism.
const WAITING_POLL_MS = 5_000;
// How often answers the server has not confirmed are sent again. Autosave
// fires only when an answer changes, so without this a student who answered,
// lost the network and then sat reading would never be saved. It is also what
// retries a Submit that could not save everything.
const UNSAVED_RETRY_MS = 10_000;
// A join refused by the server is an answer about the room (400 ended, 403, 404
// gone). Anything else — no network, a timeout, a 5xx — says nothing about it.
const ROOM_REFUSED_STATUSES = new Set([400, 403, 404]);

// The student runner: one exercise per screen. Content comes from the session
// (GET .../exercises, student-safe); answers are graded server-side (the client
// never sees correctness), so each answer is POSTed and the run ends at a
// submission confirmation. Node ids are the exercise_key, which is exactly
// what the answers endpoint expects.
export function ExerciseRunner({ code }: { code: string }) {
  const { t } = useStableI18n();
  const navigate = useNavigate();
  // Null for a guest on a public link: they hold a disposable account with no
  // role, so "/" would land them on access-denied. Falling back to the join
  // screen keeps them somewhere that exists.
  const homeHref = useHomeHref();
  const { join, setJoin } = useLiveStudent();
  // The forced-timer deadline and the run's status both reach a student over
  // the API's `live_session` stream alone (see `liveDeadline` / `liveStatus`
  // below). There is deliberately NO REST read of the session here:
  // GET /v2/live-sessions/{id} requires the `tests_get` scope, which a student
  // never holds, so it 403s on every run. Don't add a REST fallback; it cannot
  // work. The fallback that does work is re-joining, which is idempotent and
  // reports the status (see the poll below).

  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({});
  // A scratch pad shared across the whole test (surfaced in the bottom bar).
  const [notes, setNotes] = useState("");
  // Only one bottom-bar panel at a time: opening the notes closes the question
  // list and vice versa, since both float above the same corner of the footer.
  const [panel, setPanel] = useState<"notes" | "questions" | "highlighter" | null>(null);
  // The student's highlights, sent on the next heartbeat after they change and
  // handed back by the join on a refresh. Null once sent.
  const pendingHighlightsRef = useRef<SavedHighlights | null>(null);
  // Pagination is by page, not by question — a section is one page of many
  // questions (see buildPages / RunPage).
  const [pageIndex, setPageIndex] = useState(0);
  // An attempt the join says is already handed in opens on "submitted", never
  // on the paper: a student reopening homework they finished would otherwise be
  // given it back with every answer refused, and "Take it again" nowhere. Read
  // once, at mount — the route is keyed by attempt, so a new join is a new
  // mount — and upgraded to the score below when the result is released.
  const [step, setStep] = useState<Step>(() =>
    join?.finished_at ? "submitted" : "answer",
  );
  const [closed, setClosed] = useState(false);
  // This taker's own time has run out, on a public self-paced link. Separate
  // from `closed`, which means the ROOM shut: a public room never does, so
  // without its own flag an expired attempt is indistinguishable from a healthy
  // one and the student is handed the paper back on every reload.
  const [expired, setExpired] = useState(false);
  const [result, setResult] = useState<ParticipantResult | null>(null);
  // The student's own sittings, read once the score is on screen — for the
  // facts line's start and finish times, which nothing in the live flow
  // carries. Disabled until then so a sitting in progress makes no extra call.
  // Also read on "submitted", for the feedback report below (which test, and
  // whether this was the student's first sitting) — after the hand-in only.
  const runsQuery = useParticipants(step === "score" || step === "submitted");
  const myRuns = runsQuery.data;
  // The session's live deadline once the stream reports it (undefined
  // until then). A class run's countdown reads this; a public link's reads the
  // per-attempt deadline on the join response instead, which is why
  // `resolveRunnerDeadline` picks between them rather than this being the only
  // source. There is no REST fallback: GET /v2/live-sessions/{id} needs
  // `tests_get`, which a student never holds.
  const [liveDeadline, setLiveDeadline] = useState<string | null | undefined>(
    undefined,
  );
  // The run's status as the stream reports it — null until the first push,
  // and for good if the stream never connects, which is why the join response
  // seeds the phase rather than this.
  const [liveStatus, setLiveStatus] = useState<LiveSessionStatus | null>(null);
  // Every room recording window on a class run, by link key: seeded by
  // `listRecordingWindows`, and each stream push merged over it per key.
  const [roomWindows, setRoomWindows] = useState<Record<string, WindowTimes>>({});
  // This student's own windows on a share room, by link key.
  const [ownWindows, setOwnWindows] = useState<Record<string, WindowTimes>>({});

  // Which screen to be on. Pure and tested in `lib/live-phase.ts`: ignoring
  // `join.status` here would show a student handed the code the paper while
  // the teacher is still taking the register.
  const phase = runnerPhase({
    joinStatus: liveStatus ?? join?.status ?? "lobby",
    liveStatus,
    step,
    closed,
    expired,
  });

  // Don't ask for the paper before the run starts: the API answers 403 there, and
  // a student should see "waiting", not "couldn't load the session".
  // The paper comes part by part: the part on screen and the next are opened
  // (the first open stamps THIS attempt's start), a timed part at its gate.
  const [currentKey, setCurrentKey] = useState<string | undefined>(undefined);
  const paper = useLivePaper(
    shouldLoadPaper(phase) ? join?.live_session_key : undefined,
    join?.participant_key,
    currentKey,
  );
  const { exercises: sessionExercises, isLoading, isError } = paper;
  // Heartbeat reports the first question index on the current page.
  const indexRef = useRef(0);
  // Set in the active render to the current auto-submit closure, and fired once
  // by the expiry effect below (which sits above the early returns, where the
  // submit function isn't in scope).
  const onExpireRef = useRef<(() => void) | null>(null);
  // Same pattern for the autosave: the send closure is defined below the
  // early returns, and the effect that drives it has to sit above them.
  const autosaveRef = useRef<(() => void) | null>(null);
  // And for a Submit whose retry is cut short by the room shutting or the
  // taker's time running out.
  const onHandInCutOffRef = useRef<(() => void) | null>(null);
  const autoSubmittedRef = useRef(false);
  // A hand-in runs across several awaits, so a state value read inside it is
  // always the render it started in. These let it see the room shut or the
  // taker's time run out while it is still going.
  const closedRef = useRef(false);
  closedRef.current = closed;
  const expiredRef = useRef(false);
  expiredRef.current = expired;

  // The live session runs fullscreen. `enter` needs a user gesture, so the
  // FullscreenGate button drives it; `everFullscreen` distinguishes the first
  // entry from a re-entry after the student left (Esc), which proctoring logs.
  const { isFullscreen, supported: fullscreenSupported, enter: enterFullscreen, exit: exitFullscreen } =
    useFullscreen();
  const [everFullscreen, setEverFullscreen] = useState(false);
  // Set when a refresh re-join fails, so the runner stops retrying and hands
  // the student to the join screen rather than spinning forever.
  const [rejoinFailed, setRejoinFailed] = useState(false);
  // Submitting is both rendered (a disabled, labelled button) and guarded by a
  // ref — state alone can't stop a second call in the same tick.
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  // A Submit that could not save every answer: the dialog stays up, the retry
  // keeps sending, and the attempt finishes by itself once all are confirmed.
  const [handInPending, setHandInPending] = useState(false);
  const handInPendingRef = useRef(false);
  // "Submit answers" opens a confirmation rather than finishing the attempt —
  // see SubmitConfirmDialog for the double-tap it guards against.
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Every answer send goes through ONE queue (lib/answer-outbox.ts): what
  // changed since the server last confirmed it, one request at a time, never
  // two for the same question. It reads the answers and the identity through
  // refs, so the one sender built here stays correct for the whole sitting.
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const joinRef = useRef(join);
  joinRef.current = join;
  const outboxRef = useRef(new AnswerOutbox());
  // Per question, the server's reason for refusing its last send. Cleared by
  // that question's next save; a network failure leaves it as it was.
  const refusalsRef = useRef(new Map<string, string>());
  const senderRef = useRef<ReturnType<typeof createAnswerSender> | null>(null);
  if (!senderRef.current) {
    senderRef.current = createAnswerSender(
      outboxRef.current,
      async (nodeId, signal) => {
        const current = joinRef.current;
        if (!current) throw new Error("Not joined");
        if (!(nodeId in answersRef.current)) return;
        try {
          await submitLiveAnswer(
            current.live_session_key,
            current.participant_key,
            { exercise_key: nodeId, answer: answersRef.current[nodeId] },
            signal,
          );
          refusalsRef.current.delete(nodeId);
        } catch (err) {
          // Only an answer from the server is a refusal; no network, a timeout
          // or an abort is not.
          if (err instanceof ApiError) {
            refusalsRef.current.set(
              nodeId,
              // The server's reason, else a plain line: a student has no use for a status line.
              err.detail || t("exercise.live.runner.serverRefused", "The server refused it ({status}).", { status: err.status }),
            );
          }
          throw err;
        }
      },
      // A send on the slow lane came back after its run ended: run again, so
      // the marks refresh and a waiting Submit can finish.
      { onLateSettle: () => autosaveRef.current?.() },
    );
  }
  // Re-renders what reads the queue — the saved/unconfirmed marks on the answer
  // list — after each send run.
  const [, setSaveRuns] = useState(0);
  // The last save failed and nothing has succeeded since — the offline banner.
  const [saveFailing, setSaveFailing] = useState(false);
  // Which participant's answers have already been restored, so the seed runs
  // once and never overwrites live typing on a later re-render.
  const restoredForRef = useRef<string | null>(null);
  useEffect(() => {
    if (isFullscreen) setEverFullscreen(true);
  }, [isFullscreen]);

  // Re-join when the identity is missing (a refresh). Idempotent server-side, so
  // this cannot fork the attempt into a second participant.
  // A device that cannot hold fullscreen while typing (lib/device-support.ts)
  // sits the paper with the lock off, and proctoring reports it once. An account
  // exempt from the lock (lib/fullscreen-exempt.ts) is not reported.
  const fullscreenExempt = useFullscreenExempt();
  const deviceBlockReason = useExamBlockReason();
  const unsupportedFullscreen =
    fullscreenExempt.exempt || fullscreenExempt.pending ? null : deviceBlockReason;
  useEffect(() => {
    if (join || rejoinFailed) return;
    let cancelled = false;
    joinLiveSession(code)
      .then((next) => {
        if (cancelled) return;
        setJoin(next);
        setLiveStatus(next.status);
        // `rejoin` carries a risk weight on the server and is emitted only here:
        // the runner lost its identity and had to get it back, which is a
        // refresh (or a second tab) mid-exam. Only
        // while the run is live: re-joining a lobby is the waiting room doing its
        // job, and the server prices that at zero anyway.
        if (next.status === "live") {
          void recordProctorEvent(next.live_session_key, next.participant_key, {
            type: "rejoin",
          }).catch(() => undefined);
        }
      })
      .catch(() => {
        // Ended, wrong code, or signed out — the join screen explains it.
        if (!cancelled) setRejoinFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [join, rejoinFailed, code, setJoin]);

  // The other half of opening a handed-in attempt on "submitted": if its score
  // is already released, show it, exactly as the runner's own submit does. Keyed
  // on the join's `finished_at`, which only an attempt finished BEFORE this mount
  // carries — a submit made here leaves the join untouched, and `submitAll`
  // fetches that result itself.
  useEffect(() => {
    if (!join?.finished_at) return;
    let cancelled = false;
    getParticipantResult(join.live_session_key, join.participant_key)
      .then((res) => {
        if (cancelled) return;
        setResult(res);
        setStep("score");
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [join]);

  // Seed the answers the student already submitted, once per participant. Their
  // work is in Postgres the moment it is saved; without this read the runner
  // would redraw a blank paper over it after a refresh and they would answer
  // the same questions twice, against the clock. Ungraded, so it tells them nothing the
  // screen doesn't already show. Restored answers never pass through the queue,
  // so they count as saved.
  useEffect(() => {
    if (!join || restoredForRef.current === join.participant_key) return;
    restoredForRef.current = join.participant_key;
    let cancelled = false;
    listParticipantAnswers(join.live_session_key, join.participant_key)
      .then((saved) => {
        if (cancelled || saved.length === 0) return;
        setAnswers((current) => {
          const restored: Record<string, ExerciseAnswer> = {};
          for (const item of saved) restored[item.exercise_key] = item.answer;
          // Anything typed while this was in flight wins — it is newer than what
          // the server last heard.
          return { ...restored, ...current };
        });
      })
      .catch(() => undefined); // A failed restore must never block the exam.
    return () => {
      cancelled = true;
    };
  }, [join]);

  // The recording windows already open, so a refresh mid-clip resumes at the
  // room's (or their own) offset instead of waiting for the next push. Keyed on
  // the attempt, not the join object: a re-join hands back a new object for the
  // same attempt, and cancelling on that would drop the read.
  const windowsSession = join?.live_session_key;
  const windowsParticipant = join?.participant_key;
  useEffect(() => {
    if (!windowsSession || !windowsParticipant) return;
    let cancelled = false;
    listRecordingWindows(windowsSession, windowsParticipant)
      .then((windows) => {
        if (cancelled) return;
        const own: Record<string, WindowTimes> = {};
        const room: Record<string, WindowTimes> = {};
        for (const w of windows) {
          const times = {
            startedAt: w.started_at,
            endsAt: w.ends_at,
            stoppedAt: w.stopped_at,
          };
          (w.room ? room : own)[w.recording_key] = times;
        }
        setOwnWindows((current) => ({ ...own, ...current }));
        // Under anything the stream has already said, which is newer on a tie.
        setRoomWindows((current) => mergeRoomWindows(room, current));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [windowsSession, windowsParticipant]);

  // Each node's part/section context, keyed by the link key the node id uses.
  // Student-safe: the stub only ever holds headers and the shared passage.
  const collectionByNode = useMemo(() => {
    const map = new Map<string, CollectionStub | null>();
    for (const se of sessionExercises ?? []) {
      map.set(se.exercise_key, se.exercise.collection ?? null);
    }
    return map;
  }, [sessionExercises]);

  const test = useMemo<SpringboardTest | null>(() => {
    if (!sessionExercises || !join) return null;
    const nodes = sessionExercisesToNodes(sessionExercises);
    if (nodes.length === 0) return null;
    return {
      id: join.live_session_key,
      title: "Challenge",
      description: "",
      teacherName: "",
      status: "published",
      // Vestigial on the live synthetic test — the exam clock is the
      // server-driven forced timer (see useSessionTimer), not this field.
      durationMinutes: 0,
      updatedAt: "",
      nodes,
    };
  }, [sessionExercises, join]);

  // What the recording bar can play, keyed by recording; each covers link keys,
  // which are the runner's node ids. Asked for with the paper, never before it.
  const { data: sessionRecordings } = useSessionRecordings(
    join?.live_session_key,
    shouldLoadPaper(phase) && !!sessionExercises,
  );
  const recordings = useMemo(
    () =>
      deckRecordings(
        (sessionRecordings ?? []).map(sessionRecordingSource),
        test?.nodes.map((node) => node.id) ?? [],
        (nodeId) => collectionByNode.get(nodeId),
        t,
      ),
    [sessionRecordings, test, collectionByNode, t],
  );

  // The one-question-per-page vs section-page grouping the runner paginates by.
  const pages = useMemo<RunPage[]>(
    () => (test ? buildPages(test.nodes, collectionByNode) : []),
    [test, collectionByNode],
  );
  // The question on screen tells the paper which part to have open and which to preload.
  useEffect(() => {
    const onScreen = pages[Math.min(pageIndex, pages.length - 1)]?.nodeIndices[0];
    setCurrentKey(onScreen === undefined ? undefined : test?.nodes[onScreen]?.id);
  }, [pages, pageIndex, test]);

  // Presence heartbeat (also advances current_index). Uses a ref so the
  // interval always reports the latest position without resetting each move.
  useEffect(() => {
    if (!join) return;
    const id = window.setInterval(() => {
      // Taken before the send and put back if it fails, unless a newer set
      // arrived meanwhile — so a dropped ping retries on the next one.
      const highlights = pendingHighlightsRef.current;
      pendingHighlightsRef.current = null;
      sendLiveHeartbeat(join.live_session_key, join.participant_key, {
        current_index: indexRef.current,
        ...(highlights ? { highlights } : {}),
      }).catch((err) => {
        const status = err instanceof ApiError ? err.status : undefined;
        if (highlights && shouldResendHighlights(status)) {
          pendingHighlightsRef.current ??= highlights;
        }
      });
    }, HEARTBEAT_MS);
    return () => window.clearInterval(id);
  }, [join]);

  // Integrity signals (tab switches, pastes, leaving fullscreen), reported only
  // while the student is actually working: once they have submitted, or the
  // teacher has ended the session, leaving the tab is no longer meaningful.
  // Risk is teacher-facing, so nothing about this surfaces to the student.
  // An account exempt from the fullscreen lock is proctored exactly the same —
  // intended: the exemption lifts the lock, not the record, so its tab switches,
  // pastes and re-joins still reach the teacher.
  const reportProctorEvent = useProctoring(
    join
      ? { sessionKey: join.live_session_key, participantKey: join.participant_key }
      : null,
    shouldReportProctoring(phase),
    unsupportedFullscreen,
  );

  // The paper cannot be copied out of the runner while it is on screen — see
  // `lib/use-copy-guard.ts` for what that does and does not cover. Selection
  // stays live (the passage highlighter is built on it) and so does copying
  // within the student's own answer and notes fields.
  // Pasting into an answer is refused too, unless it is the student's own text
  // coming back. The refusal is reported here, as a blocked paste.
  useCopyGuard(shouldBlockCopying(phase), (length, via) => {
    reportProctorEvent("paste", { length, via, blocked: true });
    toast.error(t("exercise.live.runner.pasteOff", "Pasting from outside the test is turned off."));
  });

  // The paper is covered while the window does not have focus (PrivacyScreen).
  const away = useWindowAway(shouldReportProctoring(phase));
  const [exitOpen, setExitOpen] = useState(false);
  const { user } = useAuth();
  const candidateName =
    (typeof user?.name === "string" && user.name) || user?.username || "Student";
  // Says to an AI assistant shown this page, or a screenshot of it, that it is
  // a live test: a candidate strip, the page text and the title.
  const signature = useMemo(
    () =>
      examSignature({
        testName: join?.test_name,
        className: join?.class_name,
        candidate: candidateName,
        attemptNo: join?.attempt_no,
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        joinCode: code,
      }),
    [join?.test_name, join?.class_name, join?.attempt_no, candidateName, code],
  );
  const paperOpen = shouldReportProctoring(phase);
  // No feedback survey may show while the paper or the waiting room is up, from
  // any trigger: a popup there would steal focus and read as leaving the paper.
  useFeedbackSuppressed(paperOpen || phase === "waiting");
  useRunSubmittedFeedback({
    step,
    join,
    result,
    runs: myRuns,
    runsSettled: runsQuery.isFetched,
    accountType: user?.account_type as string | undefined,
  });
  useEffect(() => {
    if (!paperOpen) return;
    const previous = document.title;
    document.title = signature.title;
    return () => {
      document.title = previous;
    };
  }, [paperOpen, signature.title]);

  // One push of the session's state: only the fields it carries change.
  const applySessionDoc = useCallback((docData: LiveSessionDoc | null) => {
    if (docData?.status === "ended") setClosed(true);
    // Also the "start" push: `start_live_session` writes status live, so a
    // waiting student is moved into the paper by the teacher's own action,
    // with no polling and no endpoint a student can't call.
    if (docData?.status) setLiveStatus(docData.status);
    if (docData && "deadlineAt" in docData) setLiveDeadline(docData.deadlineAt ?? null);
    // The teacher's Play / Stop, one window per recording.
    if (docData?.recordings) {
      const pushed = docData.recordings;
      setRoomWindows((current) => mergeRoomWindows(current, pushed));
    }
  }, []);

  // The session's state over the API's stream: Start, End (the teacher's, or
  // the forced timer's auto-end), added time and the teacher's Play/Stop. A
  // `status` carries the fields that changed. A reconnect after the first
  // (`ready`), a `resync`, or a status without fields may have missed
  // something, so the student re-joins once to catch up, as the waiting poll
  // does; submit-time detection still backs up a missed End.
  const liveTopic = join ? `live_session:${join.live_session_key}` : null;
  const streamConnects = useRef(0);
  useEffect(() => {
    streamConnects.current = 0;
  }, [liveTopic]);
  const catchUp = useCallback(() => {
    joinLiveSession(code)
      .then((next) => setLiveStatus(next.status))
      .catch((err) => {
        if (err instanceof ApiError && ROOM_REFUSED_STATUSES.has(err.status)) setClosed(true);
      });
  }, [code]);
  useLiveEvent(liveTopic, (event: LiveEventMessage) => {
    const first = event.type === "ready" && streamConnects.current++ === 0;
    const action = liveEventAction(event, first);
    if (action === "apply" && event.type === "status") {
      applySessionDoc(event.fields as LiveSessionDoc);
    } else if (action === "catch-up") {
      catchUp();
    }
  });

  // Fallback for a room where the stream never connects — a proxy that buffers
  // it, say. Re-joining is the one
  // read a student is allowed to make that reports the status, and it is
  // idempotent on (session, user), so it can't fork the attempt. Only while
  // waiting: once the paper is on screen this is dead weight.
  useEffect(() => {
    if (!join || phase !== "waiting") return;
    const id = window.setInterval(() => {
      joinLiveSession(code)
        .then((next) => setLiveStatus(next.status))
        .catch(() => undefined);
    }, WAITING_POLL_MS);
    return () => window.clearInterval(id);
  }, [join, phase, code]);

  // Forced timer. Two possible deadlines and the taker's own wins: a public
  // self-paced link gives each person their own, handed back by join, while a
  // class run shares one that arrives (and moves) over the stream. Anchored to
  // server time so a skewed device clock can't move either.
  const clock = useServerClockOffset();
  const deadlineIso = resolveRunnerDeadline(join?.deadline_at, liveDeadline);
  // Only while they are actually working. A waiting student has no deadline to
  // count down to either — it is set at Start.
  const timerArmed = clock.ready && shouldReportProctoring(phase);
  const timer = useSessionTimer(deadlineIso, clock.offsetMs, timerArmed);

  // Who plays the recordings: the teacher for the room on a class run, the
  // student's own Play on a share room. Everything here is by recording key.
  const sessionKey = join?.live_session_key;
  const participantKey = join?.participant_key;
  const selfPaced = (join?.delivery ?? "class") !== "class";
  const clockRef = useRef<ClockSample | null>(null);
  const urlQueueRef = useRef<Promise<unknown>>(Promise.resolve());
  const mediaPlayback = useMemo<MediaPlayback>(
    () => ({
      controlled: true,
      selfPaced,
      roomWindows: selfPaced ? {} : roomWindows,
      serverOffsetMs: clock.offsetMs,
      ownWindows,
      resolve: async (recordingKey) => {
        if (!sessionKey || !participantKey) throw new Error("Not joined");
        // Timed around the request alone, so the offset can allow for the trip:
        // by its own Resource Timing marks, else by this bracket. One call at a
        // time, since every call shares one URL: two in flight would each read
        // the other's entry.
        const timed = urlQueueRef.current.then(async () => {
          const sentPerfMs = markRequestStart();
          const sentAtMs = Date.now();
          const res = await requestRecordingUrl(sessionKey, participantKey, recordingKey);
          const receivedAtMs = Date.now();
          const resource = resourceTimesFor(
            getParticipantRecordingUrlEndpoint(sessionKey, participantKey),
            sentPerfMs,
          );
          return { res, timing: { sentAtMs, receivedAtMs, resource } };
        });
        urlQueueRef.current = timed.catch(() => undefined);
        const { res, timing } = await timed;
        if (selfPaced) {
          setOwnWindows((current) => ({
            ...current,
            [recordingKey]: { startedAt: res.started_at, endsAt: res.ends_at, stoppedAt: null },
          }));
        }
        // Every recording-url reads the server's clock; the quickest one so far is the truest.
        const sample = clockSample(res.server_now, timing);
        if (sample) clockRef.current = keepClockSample(clockRef.current, sample);
        return {
          url: res.url,
          startedAt: res.started_at,
          endsAt: res.ends_at,
          serverNow: res.server_now,
          timing,
          offsetMs: clockRef.current?.offsetMs,
        };
      },
      reportSeek: (recordingKey, fromS, toS) =>
        reportProctorEvent("media-seek", { recording_key: recordingKey, from_s: fromS, to_s: toS }),
    }),
    [selfPaced, roomWindows, clock.offsetMs, ownWindows, sessionKey, participantKey, reportProctorEvent],
  );

  // Essays written in the student's Doc and speaking answers recorded here,
  // when the run is answered in files. No new take once time is up or the room
  // shuts; one under way still hands in.
  const offsetMs = clock.offsetMs;
  const serverNow = useCallback(() => Date.now() + offsetMs, [offsetMs]);
  const answerFiles = useRunAnswerFiles(
    sessionKey,
    participantKey,
    sessionExercises,
    (phase === "answering" || phase === "review") && !expired && !closed,
    paper.parts,
    answers,
    serverNow,
  );
  // The timed part the paper stops at, waiting for the student to open it.
  const closedParts = paper.gate ? [paper.gate] : [];
  // After a part opens and the paper comes back with its questions, go to the first.
  const [jumpToPart, setJumpToPart] = useState<string | null>(null);
  /** Opens a timed part, starting its clock, then lands on its first question. */
  const openTimedPart = (partKey: string) => {
    paper.openPart(partKey);
    setJumpToPart(partKey);
  };
  useEffect(() => {
    if (!jumpToPart || !test) return;
    const first = (sessionExercises ?? [])
      .filter((item) => item.part_key === jumpToPart)
      .sort((a, b) => a.order - b.order)[0];
    if (!first) return;
    const nodeIndex = test.nodes.findIndex((node) => node.id === first.exercise_key);
    const target = pages.findIndex((p) => p.nodeIndices.includes(nodeIndex));
    if (target >= 0) {
      setPageIndex(target);
      setStep("answer");
    }
    setJumpToPart(null);
  }, [jumpToPart, sessionExercises, test, pages]);

  // A per-attempt deadline that is ALREADY past when the runner mounts. The
  // countdown can't catch this: a reload after expiry starts a fresh timer with
  // `autoSubmittedRef` back to false, so the paper renders for a tick and the
  // auto-submit that follows is refused by the server, answer by answer. The
  // session timer is spared this because an expired class run is
  // `ended`, and `ended` closes the screen; a public room stays live forever.
  useEffect(() => {
    if (isAttemptExpired(join?.deadline_at, clock.offsetMs, clock.ready)) {
      setExpired(true);
    }
  }, [join?.deadline_at, clock.offsetMs, clock.ready]);

  // On expiry, auto-submit once: the final send + finish before the server's
  // grace window closes. Fired through a ref because the submit closure is
  // defined below the early returns.
  useEffect(() => {
    if (timer.expired && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      onExpireRef.current?.();
    }
  }, [timer.expired]);

  // The invigilator's "ten minutes left": a notice at each threshold, once.
  const announcedRef = useRef(new Set<number>());
  const remainingMs = timerArmed ? timer.remainingMs : null;
  useEffect(() => {
    const due = dueTimeWarning(remainingMs, announcedRef.current);
    if (!due) return;
    for (const min of due.settles) announcedRef.current.add(min);
    toast.warning(
      due.minutes === 1
        ? t("exercise.live.runner.lessThanOne", "Less than 1 minute left")
        : t("exercise.live.runner.lessThanOther", "Less than {n} minutes left", { n: due.minutes }),
    );
  }, [remainingMs, t]);

  // A Submit still retrying when the room shuts or the student's time runs out
  // has handed in all it ever will: stop retrying and finish, rather than leave
  // "closed" or "time's up" over a paper they already chose to hand in. It
  // FINISHES rather than just showing the receipt — see `completeHandIn`.
  useEffect(() => {
    if (handInPending && (closed || expired)) {
      handInPendingRef.current = false;
      setHandInPending(false);
      onHandInCutOffRef.current?.();
    }
  }, [handInPending, closed, expired]);

  // Autosave. Without it answers would be pushed only when the student LEAVES
  // a page, so a refresh (or a crash, or a flat battery) mid-page would throw
  // away everything typed on it. Debounced rather than per-keystroke: the write is graded
  // server-side, and one POST per character would be a request per keypress.
  useEffect(() => {
    const id = window.setTimeout(() => autosaveRef.current?.(), AUTOSAVE_MS);
    return () => window.clearTimeout(id);
  }, [answers]);

  // Retry whatever is still unsaved, on a slow interval and the moment the
  // browser reports the connection back. Stops with the paper: the runner stays
  // mounted behind the closed and result screens.
  const retrySaves = shouldRetrySaves(phase);
  useEffect(() => {
    if (!join || !retrySaves) return;
    const retry = () => autosaveRef.current?.();
    const id = window.setInterval(retry, UNSAVED_RETRY_MS);
    window.addEventListener("online", retry);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("online", retry);
    };
  }, [join, retrySaves]);

  // Leave fullscreen once the exam is over — the score/submitted/closed screens
  // are normal chrome, not the locked exam. The waiting room is the same: the
  // lock belongs to the exam, and a student who may step away must not be held
  // in it.
  useEffect(() => {
    if (phase !== "answering" && phase !== "review") void exitFullscreen();
  }, [phase, exitFullscreen]);
  useEffect(() => () => void exitFullscreen(), [exitFullscreen]);

  // A refresh drops the in-memory identity but NOT the exam. `POST /join/{code}`
  // is idempotent on (session, user), so re-joining returns the same participant
  // — the student lands back where they were instead
  // of being bounced to the join screen mid-paper to retype a code they may not
  // still have on screen. Only when that re-join fails do we send them there.
  if (!join) {
    return rejoinFailed ? (
      <Navigate to={playJoinRoute(code)} replace />
    ) : (
      <StudentPageShell>
        <p className="text-center text-sm font-bold text-muted-foreground">
          {t("exercise.live.runner.reconnecting", "Reconnecting you to the challenge…")}
        </p>
      </StudentPageShell>
    );
  }

  // Joined, but the teacher hasn't started. The paper is not fetched here (the
  // API refuses it), nothing is proctored, and the student may leave and come
  // back — see WaitingRoom.
  if (phase === "waiting") return <WaitingRoom code={code} />;

  // A student who already submitted keeps their confirmation/score even when the
  // session ends afterwards (the timer's auto-end fires a few seconds later); the
  // closed screen is only for a run that ends while they're still working.
  if (phase === "closed") return <ChallengeClosed />;

  // Their own time ran out on a public link. A separate screen from the one
  // above because the room is still open — "the teacher has closed access"
  // would be false, and the student would be looking for someone to blame for
  // something that was just the clock.
  if (phase === "expired") return <AttemptExpired />;

  if (isLoading || (!sessionExercises && !isError)) {
    return <PendingPaper onExit={() => navigate(homeHref ?? playJoinRoute(code))} />;
  }

  // Loaded, but nothing a student can answer — say so rather than spin.
  if (!isError && !test) {
    return (
      <StudentPageShell>
        {closedParts.length ? (
          // Every question so far sits in a timed part not yet opened.
          <TimedPartGates parts={closedParts} opening={paper.openingPart} onOpen={openTimedPart} />
        ) : (
          <p className="text-center text-sm font-bold text-muted-foreground">
            {t("exercise.live.runner.noQuestions", "This challenge has no questions yet. Ask your teacher.")}
          </p>
        )}
      </StudentPageShell>
    );
  }

  if (isError || !test) {
    return (
      <StudentPageShell>
        <p className="text-center text-sm font-bold text-error">
          {t("exercise.live.runner.loadFailed", "Couldn’t load the session. Please rejoin.")}
        </p>
      </StudentPageShell>
    );
  }

  // Non-null locals so the closures below don't lose the guards' narrowing.
  const activeJoin = join;
  const activeTest = test;
  const activePages = pages.length ? pages : [{ stub: null, nodeIndices: [0] }];
  const clampedPage = Math.min(pageIndex, activePages.length - 1);
  const page = activePages[clampedPage];
  const isLastPage = clampedPage === activePages.length - 1;
  // Report where the student is by first question on the page.
  indexRef.current = page.nodeIndices[0];

  const pageOfNode = (nodeIndex: number) =>
    Math.max(
      0,
      activePages.findIndex((p) => p.nodeIndices.includes(nodeIndex)),
    );

  // A failed send is not proof the run is over — usually it is a blip, and one
  // dropped packet must not throw a student out of a LIVE exam onto "this
  // challenge has ended". Ask the one endpoint a student is allowed to ask:
  // join is idempotent on (session, user) and reports the status. Only an ended
  // run closes the screen; anything else is a retry the queue will make.
  async function checkRoom() {
    try {
      const current = await joinLiveSession(code);
      setLiveStatus(current.status);
      if (current.status === "ended") setClosed(true);
      // A public self-paced room is `live` forever, so "ended" can never be
      // the reason a write fails there. The reason is the taker's OWN
      // deadline, which the server enforces per attempt — and the re-join we
      // just made hands it back. Without this branch every answer past the
      // deadline fails in silence: no message, no close, and the student keeps
      // writing into a paper the server has already shut.
      else if (isAttemptExpired(current.deadline_at, clock.offsetMs, clock.ready)) {
        setJoin(current);
        setExpired(true);
      }
    } catch (joinError) {
      // The re-join failing too does not close the screen, or one spell
      // without signal would end a live exam on "the teacher has closed
      // access" and leave it there after the network came back. Only the
      // server REFUSING the join says the room is gone; a request that never arrived says
      // nothing, and the retry picks the answers up when it can.
      if (joinError instanceof ApiError && ROOM_REFUSED_STATUSES.has(joinError.status)) {
        setClosed(true);
      }
    }
  }

  // Send what changed, through the one queue. After a run with failures, check
  // the room once — not once per failed answer. A Submit waiting on unsaved
  // answers finishes the attempt the moment a run leaves nothing unsaved.
  async function saveAnswers(options: { keepGoing?: boolean } = {}): Promise<DrainResult> {
    const outcome = await senderRef.current!.drain({
      keepGoing: options.keepGoing ?? handInPendingRef.current,
    });
    setSaveRuns((runs) => runs + 1);
    // A send stuck on the slow lane is the same news to the student as one
    // that failed: not saved yet, and the connection is why.
    setSaveFailing(!outcome.saved && (outcome.failures > 0 || outcome.stalled > 0));
    if (outcome.failures > 0) await checkRoom();
    if (outcome.saved && handInPendingRef.current && !submittingRef.current) {
      handInPendingRef.current = false;
      setHandInPending(false);
      void completeHandIn("submit");
    }
    return outcome;
  }

  const goToPage = (next: number) => {
    void saveAnswers();
    setPageIndex(next);
  };
  const jumpToNode = (nodeIndex: number) => {
    void saveAnswers();
    setPageIndex(pageOfNode(nodeIndex));
    setStep("answer");
  };
  const setAnswerFor = (nodeId: string, value: ExerciseAnswer) => {
    // A recording is recorded as the answer by its own hand-in; sending the
    // file key again would be refused once time is up.
    if (!fileAnswerKey(value)) outboxRef.current.change(nodeId);
    // Ahead of the render, so a send that leaves before it carries this value.
    answersRef.current = { ...answersRef.current, [nodeId]: value };
    setAnswers((current) => ({ ...current, [nodeId]: value }));
  };

  // Submit and time-up. Guarded and flagged: the final send walks the whole
  // paper, so on a slow connection it can run for seconds with no sign anything
  // happened, and a second click (or the timer's auto-submit landing on a
  // manual one) must not start a second pass racing two `finish` calls.
  async function submitAll(reason: FinishReason = "submit") {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    // A time-up overrides a Submit that was still retrying.
    handInPendingRef.current = false;
    setHandInPending(false);
    try {
      // THE FINAL SEND. Every answer the student gave goes again, whatever the
      // queue believes the server holds, and each is tried even past a failure
      // — a precaution: this is the last write the attempt gets, and an answer
      // wrongly thought saved is an answer missing from the marked paper. The
      // server makes an unchanged answer a read, so this costs little.
      // Not a Doc or a recording: the API stored those itself, and one handed
      // in after the deadline would be refused as an answer write.
      outboxRef.current.resend(
        Object.keys(answersRef.current).filter((nodeId) => fileAnswerKey(answersRef.current[nodeId]) === null),
      );
      const { saved } = await saveAnswers({ keepGoing: true });
      // Not handed in over an answer the server does not have. A Submit stays
      // in its dialog and keeps retrying (`saveAnswers` finishes it once all are
      // confirmed); a time-up finishes regardless, since the server's auto-end
      // is about to. Retrying is only worth it while the room is still open —
      // once it shuts, fall through and finish.
      if (!saved && reason === "submit" && !closedRef.current && !expiredRef.current) {
        handInPendingRef.current = true;
        setHandInPending(true);
        return;
      }
      await completeHandIn(reason);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  // Finish the attempt. **Called even when the room has already shut or the
  // taker's time has run out**, which is deliberate: the server refuses a finish
  // only in the LOBBY, so this still lands on an ended room — and on a class run
  // `finished_at` has no other writer. The forced timer's auto-end ends the
  // SESSION and touches nobody's attempt, and the per-attempt auto-finish task
  // exists only on a public link. Skipping this call for a closed or expired
  // room would leave a timed-out class attempt with `finished_at` NULL: no
  // score released under `after-submit`, and missing from the teacher's
  // submitted count, over a paper the student had in fact handed in.
  async function completeHandIn(reason: FinishReason) {
    const ownsGuard = !submittingRef.current;
    if (ownsGuard) {
      submittingRef.current = true;
      setSubmitting(true);
    }
    try {
      try {
        await finishParticipant(activeJoin.live_session_key, activeJoin.participant_key, reason);
      } catch (err) {
        // The server's clock says time is not up: this device's clock ran ahead
        // of it. Re-anchor and carry on — the countdown resumes from the server's
        // figure and hands the paper in again when time really is up.
        if (reason === "timeout" && err instanceof ApiError && err.status === 409) {
          autoSubmittedRef.current = false;
          clock.resync();
          return;
        }
        // Whatever else went wrong, the student has done all they can: the list
        // of what they handed in is their record of it.
        setStep("submitted");
        return;
      }
      toast.success(t("exercise.live.runner.submitted", "Answers submitted"));
      try {
        // 403 (gate closed) throws -> caught below -> plain confirmation.
        const res = await getParticipantResult(
          activeJoin.live_session_key,
          activeJoin.participant_key,
        );
        setResult(res);
        setStep("score");
      } catch {
        setStep("submitted");
      }
    } finally {
      if (ownsGuard) {
        submittingRef.current = false;
        setSubmitting(false);
      }
    }
  }

  // What the autosave and retry effects fire. Re-assigned each render so the
  // room check reads this render's clock.
  autosaveRef.current = () => {
    void saveAnswers();
  };

  // What the cut-off effect fires: their Submit was still retrying when the room
  // shut or their time ran out, so there is nothing left to retry. Hand in what
  // reached the server — the reason stays "submit" because it was their choice,
  // and the server never refuses that one for time.
  onHandInCutOffRef.current = () => {
    void completeHandIn("submit");
  };

  // What the expiry effect fires: announce it, then run the normal submit path
  // (final send → finish → gated result). Reassigned each render so it closes
  // over the latest state.
  onExpireRef.current = () => {
    toast.info(t("exercise.live.runner.timeUp", "Time’s up — submitting your answers."));
    // Time up is not a choice, so an open confirmation has nothing left to ask.
    setConfirmOpen(false);
    void submitAll("timeout");
  };

  const receipt = (
    <AnswerReceipt
      test={activeTest}
      answers={answers}
      isSaved={(nodeId) => outboxRef.current.isSaved(nodeId)}
      refusal={(nodeId) => refusalsRef.current.get(nodeId)}
      collectionByNode={collectionByNode}
    />
  );

  if (step === "submitted") {
    return (
      <SubmissionConfirmation
        canSeeResults={false}
        onSeeResults={() => navigate(homeHref ?? playJoinRoute(code))}
        retake={<RetakeButton code={code} join={join} onJoined={setJoin} />}
      >
        {receipt}
      </SubmissionConfirmation>
    );
  }

  if (step === "score" && result) {
    // The same view the review screen draws for a past run — see
    // AttemptResultView. Kept inline here (rather than navigating to
    // /student/attempts) because a guest on a public link has no student home,
    // and this is the only place they will ever see their result.
    //
    // The facts line above it — when, how much answered, how long it took —
    // comes from the student's own summary row: neither the join response nor
    // the gated result carries `started_at`/`finished_at`, and that list does,
    // ungated, for guests too. Fetched only now (see `useParticipants` above),
    // after `finish` has stamped the end.
    const thisRun = (myRuns ?? []).find(
      (run) => run.participant_key === activeJoin.participant_key,
    );
    return (
      <StudentPageShell>
        {thisRun ? (
          <div className="mb-6">
            <RunFacts run={thisRun} />
          </div>
        ) : null}
        <AttemptResultView
          nodes={activeTest.nodes}
          result={result}
          collectionByNode={collectionByNode}
          footer={
            // A guest has no home to finish to, but may still take it again —
            // this screen is the only place they will ever be offered it.
            <div className="flex flex-wrap justify-center gap-3">
              {homeHref ? (
                <Button asChild size="lg" variant="outline">
                  <Link to={homeHref}>{t("exercise.live.runner.finish", "Finish")}</Link>
                </Button>
              ) : null}
              <RetakeButton code={code} join={join} onJoined={setJoin} />
            </div>
          }
        />
      </StudentPageShell>
    );
  }

  // Progress reads as questions, not pages: the bar reflects the furthest
  // question on the current page.
  const lastNodeOnPage = page.nodeIndices[page.nodeIndices.length - 1];
  const shellCurrent =
    step === "review" ? test.nodes.length : lastNodeOnPage + 1;
  const stub = page.stub;
  // How this page draws, and whether it needs the wide two-column shell. Shared
  // with the teacher preview so both screens page and lay out identically —
  // see components/exercise/exercise-page.tsx.
  const hasPassage = step === "answer" && pageLayout(page, test.nodes).hasPassage;

  // The part/section title moves into the top bar (the in-content header is
  // suppressed). It's a compact two-liner that expands to the full instruction
  // on click (RunnerHeading), so nothing is lost to truncation.
  const heading = step === "answer" ? <RunnerHeading stub={stub} /> : undefined;

  // The exam is locked to fullscreen. This return path is only ever the
  // answer/review steps (submitted/score/closed return earlier), so the gate is
  // shown whenever the browser supports fullscreen but isn't in it — covering
  // both the initial start and a mid-exam Esc. An exempt account never sees it;
  // while its record is still loading the gate stays up. Nor does a device that
  // cannot type in fullscreen — on an iPad the gate would lock out typing.
  const showFullscreenGate =
    fullscreenSupported && !isFullscreen && !fullscreenExempt.exempt && !deviceBlockReason;
  // An essay written in its Doc counts as answered; the API records it at hand-in.
  const paperAnswers = withEssayDocs(answers, sessionExercises);
  const unansweredCount = unansweredNodeIds(test, paperAnswers).length;
  const unansweredIds = new Set(unansweredNodeIds(test, paperAnswers));
  const unconfirmedIds = test.nodes
    .filter((node) => !unansweredIds.has(node.id) && !outboxRef.current.isSaved(node.id))
    .map((node) => node.id);
  const unconfirmedCount = unconfirmedIds.length;
  // What the server said about the unsaved ones, each reason once — a refusal
  // about the attempt ("handed in") is the same sentence for every question.
  const refusedIds = unconfirmedIds.filter((id) => refusalsRef.current.has(id));
  const refusalReasons = [...new Set(refusedIds.map((id) => refusalsRef.current.get(id)!))];

  return (
    <HighlighterProvider
      initial={join?.highlights}
      onChange={(all) => {
        pendingHighlightsRef.current = all;
      }}
      onLimitReached={(message) => toast.info(message)}
    >
      {showFullscreenGate ? (
        <FullscreenGate started={everFullscreen} onEnter={() => void enterFullscreen()} />
      ) : away ? (
        <PrivacyScreen />
      ) : null}
      {/* Wherever the paper can be read, so a screenshot of it carries the mark. */}
      {join && shouldBlockCopying(phase) ? (
        <ExamWatermark participantKey={join.participant_key} />
      ) : null}
      <ExitConfirmDialog
        open={exitOpen}
        onOpenChange={setExitOpen}
        timed={timer.remainingMs !== null}
        onExit={() => navigate(homeHref ?? playJoinRoute(code))}
      />
      <SubmitConfirmDialog
        open={confirmOpen && step === "review"}
        onOpenChange={setConfirmOpen}
        unansweredCount={unansweredCount}
        submitting={submitting}
        retrying={handInPending}
        unconfirmedCount={unconfirmedCount}
        onConfirm={() => void submitAll()}
        onRetryNow={() => void saveAnswers()}
      >
        {receipt}
      </SubmitConfirmDialog>
      {/* Above the shell, so a recording plays on across pages and the review. */}
      <MediaPlaybackProvider value={mediaPlayback}>
      <RecordingDeck
        recordings={recordings}
        currentNodeIds={step === "answer" ? page.nodeIndices.map((i) => activeTest.nodes[i]?.id ?? "") : undefined}
      >
      <StudentShell
      strip={<RecordingBar className="mb-2" />}
      current={shellCurrent}
      total={test.nodes.length}
      // A countdown, or a due date. On an untimed homework the server hands the
      // student the ROOM's close as their deadline — there is no allowance to
      // cap — and rendering that as a countdown puts a ticking 71-hour exam
      // clock on a piece of homework due on Friday. `timeLeftLabel` shows the
      // date until the last hour, when "how long have I got" becomes the real
      // question. A per-attempt allowance counts down.
      timeLeft={timeLeftLabel(
        timer.remainingMs,
        deadlineIso,
        join?.closes_at,
        formatRemaining,
        t,
      )}
      timeTone={clockTone(timer.remainingMs)}
      exam
      signature={signature}
      onExit={() => setExitOpen(true)}
      wide={step === "answer" && hasPassage}
      heading={heading}
      // Every page (and the review step) opens at the top of its panes, rather
      // than inheriting the previous page's scroll position. The shell owns this:
      // the page itself never scrolls, so `window.scrollTo` would move nothing.
      scrollKey={`${pageIndex}:${step}`}
      footer={
        step === "answer" ? (
          <PaginationBar
            index={clampedPage}
            total={activePages.length}
            onPrev={() => goToPage(clampedPage - 1)}
            onNext={() => {
              if (isLastPage) {
                void saveAnswers();
                setStep("review");
              } else {
                goToPage(clampedPage + 1);
              }
            }}
            // The question list & selector, the highlighter and the notes pad
            // live in the bottom bar; each opens upward to clear the footer.
            center={
              <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                <QuestionListDialog
                  test={test}
                  answers={paperAnswers}
                  currentIndex={page.nodeIndices[0]}
                  onJump={jumpToNode}
                  open={panel === "questions"}
                  onOpenChange={(next) => setPanel(next ? "questions" : null)}
                  collectionByNode={collectionByNode}
                />
                <HighlighterButton
                  open={panel === "highlighter"}
                  onOpenChange={(next) => setPanel(next ? "highlighter" : null)}
                />
                <NotesButton
                  value={notes}
                  onChange={setNotes}
                  open={panel === "notes"}
                  onOpenChange={(next) => setPanel(next ? "notes" : null)}
                />
              </div>
            }
          />
        ) : step === "review" ? (
          // The review step keeps a bottom bar so Back / Submit are always
          // reachable without scrolling past a long checklist.
          // Same narrow-screen treatment as PaginationBar: no fixed slots and
          // shorter labels below `sm`, or Submit leaves an iPhone's screen.
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex shrink-0 justify-start sm:w-44">
              <Button variant="ghost" aria-label={t("exercise.live.runner.back", "Back")} onClick={() => setStep("answer")}>
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">{t("exercise.live.runner.back", "Back")}</span>
              </Button>
            </div>
            <NotesButton
                  value={notes}
                  onChange={setNotes}
                  open={panel === "notes"}
                  onOpenChange={(next) => setPanel(next ? "notes" : null)}
                />
            <div className="flex shrink-0 justify-end sm:w-44">
              {/* Opens the confirmation; Space ignored all the same. See
                  lib/keyboard.ts and SubmitConfirmDialog. */}
              <Button
                onClick={() => setConfirmOpen(true)}
                onKeyDown={ignoreSpaceActivation}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {submitting ? (
                  t("exercise.live.runner.submitting", "Submitting…")
                ) : (
                  <>
                    <span className="sm:hidden">{t("exercise.live.runner.submit", "Submit")}</span>
                    <span className="hidden sm:inline">{t("exercise.live.runner.submitAnswers", "Submit Answers")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {refusalReasons.length > 0 ? (
        // The server answered and said no, so this is not "connection lost" —
        // and retrying will not change it. Say what it said.
        <div
          role="alert"
          className="mb-4 space-y-1 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700"
        >
          <p>
            {refusedIds.length === 1
              ? t("exercise.live.receipt.refusedOne", "1 answer wasn’t accepted by the server. Show this to your teacher.")
              : t("exercise.live.receipt.refusedOther", "{n} answers weren’t accepted by the server. Show this to your teacher.", { n: refusedIds.length })}
          </p>
          <ul className="list-disc pl-5 font-semibold">
            {refusalReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      ) : saveFailing ? (
        <div
          role="status"
          className="mb-4 rounded-2xl border bg-butter-bg px-4 py-2.5 text-sm font-bold text-butter-700"
        >
          {t("exercise.live.runner.connectionLost", "Connection lost — your latest answers aren’t saved yet. Keep this page open; they’ll be sent as soon as you’re back online.")}
        </div>
      ) : null}
      {step === "answer" ? (
        <AnswerFilesProvider value={answerFiles}>
          <ExercisePage
            page={page}
            nodes={test.nodes}
            answers={answers}
            onChange={setAnswerFor}
            enableAnnotations
          />
          {/* Timed parts not opened yet follow the last page of the paper. */}
          {isLastPage ? (
            <TimedPartGates parts={closedParts} opening={paper.openingPart} onOpen={openTimedPart} />
          ) : null}
        </AnswerFilesProvider>
      ) : (
        <ReviewSubmit
          test={test}
          answers={paperAnswers}
          unansweredCount={unansweredCount}
          onEdit={(i) => jumpToNode(i)}
        />
      )}
      </StudentShell>
      </RecordingDeck>
      </MediaPlaybackProvider>
    </HighlighterProvider>
  );
}
