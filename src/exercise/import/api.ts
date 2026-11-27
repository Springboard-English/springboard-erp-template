// Typed client for the api.springboard.vn testing platform (v2), following the
// lms.springboard.vn/src/api_calls conventions: each call goes through the
// template's shared `fetchWithRefresh` (Bearer token, no cookies), then unwraps
// the `{ objects: [...] }` envelope. DTO field names mirror the JSON the backend
// serialises (snake_case), i.e. app/models/responses.py.
//
// Reconciliation with the SPA model (src/lib/exercises.ts): `SkillTag` and
// `QuestionType` are identical to the backend `skill_tag` / `exercise_type`
// enums, so we reuse them. The backend `Exercise.content` JSONB *is* the SPA
// node's type-specific `content`; `answer_key` is server-only (never sent to
// students). `authoredExerciseToNode` below rebuilds an SPA-shaped node from a
// DTO for the authoring screens. Questions carry no draft/verified status: the
// AI review IS the verification step, so anything in the library has been
// checked.
import { importOptions } from "./config";
import type { Translate } from "./i18n";
import {
  type ExerciseNode,
  type QuestionType,
  type SkillTag,
  type AudioContentType,
  withImageUrls,
} from "../index";
import {
  getAssessmentEndpoint,
  getAssessmentSectionsEndpoint,
  getCollectionEndpoint,
  getEndpoint,
  getExerciseEndpoint,
  getClassSessionsEndpoint,
  getExtractDetectEndpoint,
  getExtractSectionEndpoint,
  getTestEndpoint,
  getLiveSessionEndEndpoint,
  getLiveSessionRegradeEndpoint,
  getLiveSessionEndpoint,
  getLiveSessionJoinEndpoint,
  getLiveSessionResultsEndpoint,
  getStoredRunResultsEndpoint,
  getParticipantAnswerSubmitEndpoint,
  getParticipantHeartbeatEndpoint,
  getMyParticipantsEndpoint,
  getUserParticipantsEndpoint,
  getLiveSessionStartEndpoint,
  getParticipantFinishEndpoint,
  getParticipantAnswersEndpoint,
  getParticipantResultEndpoint,
  getTestCollectionEndpoint,
  getTestExerciseEndpoint,
  getMarkAnswerEndpoint,
  getParticipantAttemptEndpoint,
  getParticipantProctorEventsEndpoint,
  getTestExercisesEndpoint,
  getRecordingUploadUrlEndpoint,
  getRecordingEndpoint,
  getRecordingMediaUrlEndpoint,
  getTestRecordingsEndpoint,
  getLiveSessionRecordingsEndpoint,
  getRoomRecordingEndpoint,
  getParticipantRecordingUrlEndpoint,
  getParticipantRecordingUploadUrlEndpoint,
  getLiveSessionPartsEndpoint,
  getParticipantPartOpenEndpoint,
  getClassCourseworkEndpoint,
  getParticipantRecordingsEndpoint,
  getParticipantRecordingWindowsEndpoint,
  getLiveSessionCohortEndpoint,
  getLiveSessionCohortsEndpoint,
  getLiveSessionParticipantEndpoint,
  getLiveSessionSignUpEndpoint,
  getLiveSessionSignUpsEndpoint,
  getResultsGroupEndpoint,
  getResultsGroupResultsEndpoint,
  getResultsGroupsEndpoint,
  getTestCohortEndpoint,
  getTestCohortsEndpoint,
} from "./endpoints";
import { readApiError } from "../live/api";
import {
  ApiError,
  fetchWithRefresh,
  getArrayPayload,
  getSingleObjectPayload,
  parseCursorPage,
  type CursorPaginatedResult,
  type FetchCursorPage,
} from "../../exports";

// --- Enums that don't have a matching SPA schema ----------------------------
export type AnswerVisibility = "after-submit" | "after-close" | "never";
/** Which of a student's attempts the class statistics count. */
export type RetakeScoring = "best" | "latest";
export type LiveSessionStatus = "lobby" | "live" | "ended";
/**
 * How a live session is timed — orthogonal to its status and to who may get in
 * (`LiveSessionAdmission`).
 *
 * `class` is a live run: lobby, Start, one shared clock, End. `public` is
 * self-paced: created already live, never ended, a per-attempt clock, Start and
 * End refused.
 */
export type LiveSessionDelivery = "class" | "public";
// Integrity signals the runner reports. Each carries a server-side risk weight
// (app/base/services/live_session.py `_RISK_WEIGHTS`) that feeds the
// participant's risk score — teacher-facing only, never shown to the student.
export type ProctorEventType =
  | "blur"
  | "focus"
  | "paste"
  | "copy"
  | "fullscreen-exit"
  | "fullscreen-unsupported"
  | "rejoin"
  // A seek on a controlled recording, snapped back by the player. Payload
  // `{recording_key, from_s, to_s}`.
  | "media-seek";

// --- DTOs (mirror app/models/responses.py) ----------------------------------
/**
 * Who a test is scoped to — the designation that decides its OpenFGA parent,
 * and so who can reach it.
 *
 * `group` is the manager path (creating one needs `editor` on the group, which
 * only supervisor access-groups hold); `class` is the teacher path (teachers
 * hold `editor` on their own classes directly). `centre` and `individual` are
 * defined by the API but rejected at create — neither has an object type to
 * parent to yet.
 */
export type TestArea = "centre" | "group" | "class" | "individual";

export interface Test {
  appsheet_key: string;
  edited_at: string | null;
  // Null on legacy tests with no area; otherwise exactly one of group_key /
  // class_key is set.
  area: TestArea | null;
  group_name: string | null;
  group_key: string | null;
  class_key: string | null;
  // Optional, unlike `group_name`: it arrives only from an API carrying the
  // scope filters, and this SPA has to render against one that does not yet.
  class_name?: string | null;
  // Who created the test; null on tests from before owners were recorded.
  // Optional for the same reason as `class_name`. Its owner may run it in any
  // class they see.
  owner_key?: string | null;
  name: string;
  // The marking sections the paper sets, in skill order. Only the one-test
  // read (and create / PATCH) sends them; list rows leave them out.
  sections?: TestSection[];
  timestamp: string | null;
  // Teacher-set intended duration; `question_count` is the number of linked
  // exercises (COUNT over test_exercise). Skill/status are intentionally not on
  // Test — skill/status live per-exercise.
  minutes: number | null;
  question_count: number | null;
  // Delivery configuration ("Assignment Settings"). Whether a run is a
  // teacher-gated challenge or a self-paced sitting is NOT among them — it is a
  // property of the session, decided by which endpoint opened it.
  // How many MORE attempts after the first a share link allows; null is no
  // limit, and it is the default. A class challenge is one sitting whatever
  // this says.
  retries: number | null;
  // Which attempt the class statistics count. Absent on an API without re-takes.
  retake_scoring?: RetakeScoring;
  answer_visibility: AnswerVisibility | null;
  shuffle_questions: boolean | null;
  // Free-form labels, stored server-side in `info["tags"]` and always returned
  // normalized (trimmed, lowercased, sorted). Never null on a response, but
  // optional here so a stub built client-side doesn't have to carry it.
  tags?: string[];
}

/** One marking section of a test: a skill on its paper and the points its
 * questions carry there. `max_score` is a decimal string. */
export interface TestSection {
  name: string;
  skill: string;
  max_score: string;
}

// PATCH body for a test. `edited_at` is required for optimistic-concurrency.
export interface UpdateTestBody {
  edited_at: string | null;
  name?: string;
  minutes?: number | null;
  // `null` is sent, not omitted, for "no limit" — omitting leaves it alone.
  retries?: number | null;
  retake_scoring?: RetakeScoring;
  answer_visibility?: AnswerVisibility | null;
  shuffle_questions?: boolean | null;
  // Replaces the whole set; `[]` clears them. Omit the key to leave the stored
  // tags alone — the API only touches them when it sees this field.
  tags?: string[];
  // Move a GROUP test to another group (the API re-points its group tuple).
  // Refused with a 400 on a class test — area is immutable — and never sent as
  // null: a group test with no group fails the area CHECK as a bare 500. See
  // lib/test-group-move.ts.
  group_key?: string;
}

// A question's part/section context, embedded per exercise on the
// test-exercises and session-exercises responses. Student-safe by
// construction: a collection only ever holds display context (headers +
// passage), never answers.
export type CollectionKind = "part" | "section";

// Generic per-collection display extras (mirrors the API's Collection.info).
// `layout` names the composite task a section presents — the section is a run
// of per-item questions, and this is what tells the runner to draw the
// pool/bank/match UI (and, for gapped-text, to deplete). `word_bank` is
// the ONE pool of words a run draws on, when the paper supplies one for the
// whole run rather than one word per blank. Answer-safe by construction.
// Mirrors `_SECTION_LAYOUTS` in the API's extraction.py.
//
// The first four are the tasks over one text with blanks in it, told apart by
// what the student does: `cloze` supplies nothing, `guided-cloze` supplies each
// blank's own options, `banked-cloze` supplies ready-made words to place
// unchanged, `word-formation` supplies a word to RE-FORM — whether one word per
// item or a shared box of words, which is a delivery detail.
export type CollectionLayout =
  | "banked-cloze"
  | "cloze"
  | "guided-cloze"
  | "word-formation"
  | "gapped-text"
  | "jumbled-paragraph"
  | "multi-select"
  | "multiple-matching"
  // A speaking task of alternative prompts (`Collection.prompts`); each attempt
  // is given one.
  | "topic-pool";

export interface CollectionInfo {
  layout?: CollectionLayout;
  word_bank?: string[];
}

export interface CollectionStub {
  appsheet_key: string;
  kind: CollectionKind;
  title: string | null;
  instruction: string | null;
  passage_title: string | null;
  passage: string[] | null;
  info: CollectionInfo | null;
  // One level up: a section's part.
  parent: CollectionStub | null;
}

export interface Collection extends CollectionStub {
  edited_at: string | null;
  // A speaking topic pool's prompts. Authoring only: a student is served the
  // one they drew, on the question.
  prompts?: string[] | null;
  parent_key: string | null;
  position: number | null;
  author_key: string | null;
  source: string | null;
  // Who can reach this part before it is on any paper. Null on both means
  // author-only — legacy unscoped parts, and what an unscoped AI library import
  // produces.
  group_key: string | null;
  class_key: string | null;
}

/**
 * What `GET /v2/collections/{id}` actually answers: the collection plus its
 * child sections and member questions, in their authored shape (the API's
 * `CollectionDetailResponse`).
 */
export interface CollectionDetail extends Collection {
  sections: CollectionDetail[];
  questions: AuthoredExercise[];
}

export interface AuthoredExercise {
  appsheet_key: string;
  edited_at: string | null;
  type: QuestionType;
  skill: SkillTag;
  title: string | null;
  instruction: string | null;
  // A two-place decimal. The API sends a string ("0.50") and takes a number
  // too, so read it with `Number()`.
  points: string | number | null;
  content: Record<string, unknown>;
  author_key: string | null;
  source: string | null;
  // The question's section/part, where the response joins it (test-exercises,
  // session-exercises). Null for standalone questions.
  collection?: CollectionStub | null;
  collection_order?: number | null;
  // Present only on teacher-guarded shapes; never for students.
  answer_key?: Record<string, unknown> | null;
  // Teacher review note (AI-extraction Review screen); teacher-facing only.
  review_notes?: string | null;
  // Library labels, stored server-side in `info["tags"]` and returned
  // normalized. Teacher-only: the student shape never carries them.
  tags?: string[];
  // The rest of the question's `info` — every key but `tags`, which the API
  // promotes above. Teacher-only, like `tags`. Accepted on create as well (a
  // `tags` key inside it is dropped server-side; send tags through `tags`).
  info?: Record<string, unknown> | null;
  // A signed URL per option `image_key` (images live in a private bucket).
  // Folded onto the options by `authoredExerciseToNode`; expires in hours.
  image_urls?: Record<string, string>;
}

/** One question on a test's paper (api `PaperQuestionResponse`). */
export interface TestExerciseLink {
  test_key: string;
  /** The question; its key names it on this test. */
  exercise_key: string;
  /** The part link that puts it on the paper. */
  part_key: string;
  /** The part link's, sent back with a mark edit. */
  edited_at: string | null;
  /** 0-based screen position. */
  order: number;
  /**
   * The mark THIS test sets, or null when it takes the library's. Distinct
   * from `exercise.points`, the library value, so an editor can offer "back to
   * default". A decimal, like `exercise.points`.
   */
  points: string | number | null;
  exercise: AuthoredExercise;
}

export interface LiveSession {
  appsheet_key: string;
  edited_at: string | null;
  test_key: string;
  /**
   * Resolved by the API, alongside `class_name` and `owner_name`, so a screen
   * can title a run without reading every test it can see.
   */
  test_name: string | null;
  join_code: string;
  status: LiveSessionStatus;
  owner_key: string;
  started_at: string | null;
  ended_at: string | null;
  // THIS RUN's time limit, seeded from the test's when the session is created
  // and editable per run (see `patchLiveSession`). Null means it inherits the
  // test's at start; 0 means the teacher removed the limit for this run — the
  // two are different answers, which is why null isn't doing both jobs.
  //
  // READ TWO WAYS, SELECTED BY `delivery` (mirrors `LiveSession.minutes` in the
  // API's orm.py): a shared window on a class run, and a PER-ATTEMPT allowance
  // on a share link, where each taker's clock starts when they join.
  minutes: number | null;
  // Absolute forced-timer deadline (ISO), snapshotted at start from the run's
  // own limit — and moved if the teacher changes it mid-run. Null for an untimed
  // run. The server is authoritative; clients only render the countdown from
  // this (see lib/use-session-timer.ts), and a student's copy arrives over
  // the live stream, so an added minute reaches the room without a refresh.
  //
  // Always null on a public link: that room has no shared deadline, only the
  // per-attempt one on `LiveSessionJoin.deadline_at`.
  deadline_at: string | null;
  // How this room reaches its students. Three things depend on it that can't be
  // worked out here: `minutes` above is per-attempt on anything but a class run,
  // the API refuses `start` on one (so the button must be gone rather than merely
  // fail), and `homework` means the join screen must not offer the guest form.
  delivery: LiveSessionDelivery;
  // The room's due date (ISO), null when it has none. The moment the room stops
  // accepting joins, serving the paper and taking answers — enforced server-side
  // at all three, so this is for display and for editing, never a gate.
  //
  // It is independent of `minutes` above: the due date is when the ROOM closes,
  // `minutes` is how long ONE SITTING may last, and whichever comes first is
  // what a student is held to. A homework usually has both.
  closes_at: string | null;
  // The class session this run is set in and when that is; null on a public
  // room set in none.
  session_key?: string | null;
  session_timestamp?: string | null;
  // The class that session belongs to: whose register the run was sat from,
  // which for a group test is not `class_*` below. Absent on an older API.
  session_class_key?: string | null;
  session_class_name?: string | null;
  // A share room's own attempts, copied from the test when it opened. Null
  // `retries` is no limit; a class run is one sitting whatever these say.
  // Absent on an older API.
  retries?: number | null;
  retake_scoring?: RetakeScoring;
  // This run's own result release (api `scripts/060`), so one class's results
  // can go out without every other run of the paper. `answer_visibility` null
  // follows the test's; `reveal_answer_key` shows students the correct answers
  // once their result is visible AND the run has ended. Absent on an older API.
  answer_visibility?: AnswerVisibility | null;
  reveal_answer_key?: boolean;
  created_at: string | null;
  // What the run is CALLED by, since a challenge has no name of its own: the
  // class its test is filed under and the teacher who opened it
  // (`list_live_session_labels` in the API). `class_*` is null on a group-scoped
  // test, and all three are absent from an API older than the fields —
  // `challengeName` (lib/challenge-name.ts) reads both as nothing to say.
  class_key?: string | null;
  class_name?: string | null;
  owner_name?: string | null;
  // Every room recording window, one per recording played so far; [] on a
  // share room (each student has their own). Absent on an API that predates
  // listening media.
  recordings?: RecordingWindow[];
  // Who may get in, fixed when the run opens (see `LiveSessionAdmission`).
  admission: LiveSessionAdmission;
  // The results group this run is read in, or null.
  results_group_key?: string | null;
  // The coursework a run answered in files hands in to; set on the create
  // response only.
  coursework_key?: string | null;
  // Questions whose answer key or marks changed after this run's answers to
  // them were marked, with no regrade since; [] when nothing is out of date.
  // Absent on an older API.
  regrade_due?: RegradeDue[];
  last_regrade?: LastRegrade | null;
}

/** One question a run's marks are out of date on (api `RegradeDueResponse`). */
export interface RegradeDue {
  exercise_key: string;
  /** 0-based screen position; shown 1-based. */
  order: number;
  changed_at: string;
}

/** A run's latest finished regrade (api `LastRegradeResponse`). */
export interface LastRegrade {
  requested_by_key: string | null;
  requested_by_name: string | null;
  completed_at: string;
  answers_changed: number;
}

/** One run an answer key or marks edit would leave out of date. */
export interface RegradeConflictSession {
  live_session_key: string;
  test_key: string;
  test_name: string | null;
  started_at: string | null;
  /** Auto-marked answers a regrade would re-mark. */
  answers: number;
  /** Hand-marked answers a regrade leaves alone. */
  answers_manual: number;
}

/**
 * The 409 `detail` of an exercise or test-link PATCH that changes an answer key
 * or marks already used to mark answers. Resend with `force` and the
 * `live_session_keys` to regrade (none: save only).
 */
export interface RegradeConflict {
  message: string;
  sessions: RegradeConflictSession[];
}

/** How a PATCH answers a `RegradeConflict`. */
export interface RegradeChoice {
  force: true;
  live_session_keys: string[];
}

/**
 * Who may get into a run, on either timing: accounts only, anyone with the
 * code as a guest (on a live run they wait for Start), or guests whose email
 * is on the run's sign-up list.
 */
export type LiveSessionAdmission = "signed_in" | "guests" | "sign_up_list";

/** Whether guests with no account may sign in to sit this run. */
export function hasGuestDoor(admission: LiveSessionAdmission) {
  return admission !== "signed_in";
}

/**
 * One recording's play window: open from `started_at` until `stopped_at`, or
 * `ends_at` if it was never stopped. The server's clock decides; the client
 * reads these against its server offset.
 */
export interface RecordingWindow {
  recording_key: string;
  started_at: string;
  ends_at: string;
  stopped_at: string | null;
}

// PATCH body for a live session. `edited_at` is required for
// optimistic-concurrency, as it is on every other PATCH.
//
// Both fields are optional and both are nullable, and the difference matters:
// an ABSENT field leaves the value alone, an explicit `null` clears it. So a
// patch that only moves the due date must not carry `minutes` at all, or it
// would make the room untimed on the way past.
export interface UpdateLiveSessionBody {
  edited_at: string | null;
  minutes?: number | null;
  closes_at?: string | null;
  // null puts the run back to following the test. These two are the only
  // fields an ENDED run accepts — releasing results is what happens after End.
  answer_visibility?: AnswerVisibility | null;
  reveal_answer_key?: boolean;
  // Moves the run to another class session, ended or not.
  session_key?: string;
  // A share room's own attempts; null `retries` is no limit. A class run
  // refuses both.
  retries?: number | null;
  retake_scoring?: RetakeScoring;
  // A results group of the same test; null takes the run out of its group.
  results_group_key?: string | null;
}

export interface LiveSessionJoin {
  live_session_key: string;
  participant_key: string;
  join_code: string;
  status: LiveSessionStatus;
  // How the room is delivered. Decides who controls a recording: the teacher
  // for the room on `class`, the student's own Play on a share room. Absent on
  // an older API, which reads as `class`.
  delivery?: LiveSessionDelivery;
  // What the paper is called. The only way a non-teacher learns this —
  // GET /v2/live-sessions/{id} requires `tests_get`, which they never hold.
  test_name?: string | null;
  // The class the test is filed under, for the paper's signature
  // (lib/exam-signature.ts). The API does not send it yet; until it does the
  // signature leaves the class out.
  class_name?: string | null;
  // THIS attempt's own deadline (ISO) on a public self-paced link; null on a
  // class run, whose clock is the session's.
  //
  // It rides the join response for the same reason `test_name` does: a student
  // holds no `tests_get`, so there is no session read they can make, and there
  // is no per-taker push: the `live_session` stream carries the room's state.
  // It needs no live channel anyway — unlike a session deadline this one never
  // moves, and re-joining returns the same value, so a refresh mid-paper resumes
  // the same countdown rather than restarting it.
  deadline_at?: string | null;
  // The ROOM's due date, if it has one. It rides the join response for the same
  // reason `deadline_at` does — this is the only read of the room a student can
  // make — and the runner needs it to tell the two clocks apart: on an untimed
  // homework the server hands them the bell AS their deadline, and a bare
  // countdown would then draw a 71-hour exam timer. See lib/due-date.ts.
  closes_at?: string | null;
  // Which attempt at the room this is (1-based), and what may follow it. Absent
  // on an API that predates re-takes, which reads as a first and only attempt.
  attempt_no?: number;
  // When this attempt was handed in, null while it is open. A plain join returns
  // the LATEST attempt, finished or not, so a student reopening homework they
  // already submitted gets that attempt back — and the runner must open on
  // "submitted" rather than on a paper whose every answer the server refuses.
  finished_at?: string | null;
  // Attempts still available AFTER this one; null means no limit.
  attempts_left?: number | null;
  // Whether another attempt may follow this one: a share room, attempts left,
  // the room open as of this join. NOT "may start now" — the join that returns
  // an attempt is usually the one that began it — so the runner offers "Take it
  // again" once the attempt is handed in, and the server re-checks everything
  // when it is asked (`joinLiveSession(code, { retake: true })`).
  can_retake?: boolean;
  // This attempt's highlights as the heartbeat last saved them, keyed by the
  // runner's highlight scope. Rides the join because re-joining is how the
  // runner resumes after a refresh. Absent on an API that predates them.
  highlights?: Record<string, SavedHighlight[]> | null;
  // This attempt's cohort. With none yet, the join screen offers the run's
  // public cohorts (`searchPublicCohorts`) and joins again with `cohortKey`.
  cohort_key?: string | null;
}

/**
 * One saved highlight: character offsets into its scope's text, and the first
 * characters of what it covers, to re-find it if the offsets drift. See
 * `components/exercise/highlighter.tsx`.
 */
export interface SavedHighlight {
  colour: "yellow" | "green" | "blue" | "pink";
  start: number;
  end: number;
  quote: string;
}

export interface AnswerAck {
  appsheet_key: string;
  exercise_key: string;
  /** When this question was first answered. */
  created_at: string | null;
  /** When the student last changed the answer; an identical re-send leaves it. */
  last_answered_at: string | null;
  /** When anything last wrote the row — a teacher's mark included. */
  edited_at: string | null;
}

// A session's exercise for the student runner: the link key (used to submit),
// screen order, and the student-safe exercise content (no answer_key).
export interface SessionExercise {
  exercise_key: string;
  order: number;
  exercise: AuthoredExercise; // answer_key absent for students
  /** An essay answered in a coursework file: this attempt's own Doc. */
  document?: SubmissionFile | null;
  /** The part (test collection link) the question sits in; null outside one. */
  part_key?: string | null;
}

/** Where one question sits on the paper, before its part is opened. */
export interface RunPartQuestion {
  exercise_key: string;
  order: number;
  type: string;
}

/**
 * One part of a run's paper for one attempt, as the map lists it: no question
 * content until it is opened. Opening stamps `opened_at`; a timed part's clock
 * runs from there to `prep_ends_at` (preparation) and `deadline_at` (takes).
 */
export interface RunPart {
  part_key: string;
  order: number;
  title: string | null;
  time_limit_seconds: number | null;
  preparation_seconds: number | null;
  questions: RunPartQuestion[];
  opened_at: string | null;
  prep_ends_at: string | null;
  deadline_at: string | null;
}

/** An opened part: the map's fields plus its questions in full. */
export interface OpenedRunPart extends RunPart {
  exercises: SessionExercise[];
}

/** Whether a part runs on its own clock. */
export function isTimedPart(part: Pick<RunPart, "time_limit_seconds" | "preparation_seconds">): boolean {
  return Boolean(part.time_limit_seconds || part.preparation_seconds);
}

/** The paper's map for this attempt: every part in screen order, opened or not. */
export function listRunParts(sessionKey: string, participantKey: string): Promise<RunPart[]> {
  return listAll<RunPart>(getLiveSessionPartsEndpoint(sessionKey, participantKey), "List parts");
}

/**
 * Open a part and get its questions. The first open stamps the attempt's start
 * and the part's clock; a repeat returns the same stamps, and a finished
 * attempt reads its parts back with nothing stamped.
 */
export function openRunPart(sessionKey: string, participantKey: string, partKey: string): Promise<OpenedRunPart> {
  return sendOne(getParticipantPartOpenEndpoint(sessionKey, participantKey, partKey), "POST", {}, "Open part");
}

/**
 * A student's file in their coursework submission: an essay's Doc, made ahead
 * in the class drive, or a speaking recording copied there.
 */
export interface SubmissionFile {
  appsheet_key: string;
  kind: "copy" | "upload";
  name: string | null;
  content_type: string | null;
  /** `pending` until Drive has made the file and shared it. */
  status: "pending" | "ready" | "failed";
  role: string;
  drive_file_id: string | null;
  last_error: string | null;
  /** The question this file answers. */
  exercise_key?: string | null;
  /** When Leap handed it in; the file is locked from then on. */
  handed_in_at?: string | null;
}

/**
 * One question of the paper in a student's revealed result.
 *
 * The API lists EVERY linked question, in screen order, the
 * way the teacher's attempt view does — so a question the student never
 * reached is a row with `answered: false`, not an absence. `answered`, `answer`
 * and `max_points` are absent from an older API, where an item existed only
 * for an answered question; a reader must treat a missing item and
 * `answered === false` alike.
 */
export interface AnswerResultItem {
  exercise_key: string;
  /** False for a question never reached. Absent on an older API. */
  answered?: boolean;
  /**
   * The student's OWN submission, released on the same gate as the score. The
   * same value `/answers` already serves them mid-sitting; here so the review
   * screen needs no third request. Absent on an older API.
   */
  answer?: ExerciseAnswer | null;
  /** What this row was marked out of. Absent on an older API. */
  max_points?: number | null;
  correct: boolean | null;
  /**
   * Why the answer is what it is. Released HERE and not with the question:
   * `content.explanation` is stripped from the live payload, because it gives
   * the answer away. This response is already behind the answer_visibility
   * gate, so it arrives at the same moment the score does.
   */
  explanation?: string | null; // null for human-graded (pending)
  points: number | null;
  /** The teacher's comment, released on the same gate as `explanation`. */
  feedback?: string | null;
  /**
   * Answered, and nobody has graded it yet — computed server-side.
   *
   * **Do not re-derive this from `correct`.** A marked essay keeps
   * `correct: null` for good, because there is no such thing as correct for a
   * written answer, so `correct === null` reports an essay scored 7/10 as still
   * outstanding for ever.
   */
  pending?: boolean;
  /**
   * The correct answer, as the stored key — the same shape `answer_key` has on
   * an authored exercise. Null unless the run released it, which it does only
   * once it has ENDED, so nobody still sitting the paper can be handed it.
   * Print it with `formatAnswerKey`; never pass it to a renderer.
   */
  answer_key?: Record<string, unknown> | null;
}

// A student's own result. Only returned once the answer_visibility gate — the
// run's, else the test's — is open; the endpoint responds 403 otherwise
// (getParticipantResult throws).
export interface ParticipantResult {
  answer_visibility: AnswerVisibility | null;
  /** Whether `items[].answer_key` was released. Absent on an older API. */
  answer_key_released?: boolean;
  answered: number;
  correct: number;
  points?: number | null;
  max_points?: number | null;
  /**
   * How many answers still need marking, and how much of the paper has been
   * marked. `max_points` is the paper's full total; a percentage while
   * `pending > 0` should divide by `marked_points` and say it is provisional,
   * or an unmarked essay reads as a zero the student cannot account for.
   */
  pending?: number;
  marked_points?: number;
  /** The same totals split by skill; rows sum to the fields above. Absent on a
   * older API — draw nothing rather than group the items yourself. */
  by_skill?: SkillScore[];
  /** Where this attempt sits in the room, overall and per skill. Null and
   * empty on an attempt that is not the one counted for its student, and
   * absent on an older API. */
  standing?: ScoreStanding | null;
  standing_by_skill?: ScoreStanding[];
  items: AnswerResultItem[];
}

/**
 * Where one student's score sits in the room, overall (`skill` null) or on
 * one skill, from the API. The room is one counted attempt per student, a
 * student with nothing on a skill being a 0 there. `rank` is 1 at the top
 * and ties share it. Buckets are against `max_points`, so the student's bar
 * is the one holding `points`. Decimals arrive as strings.
 */
export interface ScoreStanding {
  skill: SkillTag | null;
  points: number;
  max_points: number;
  rank: number;
  cohort_size: number;
  percentile: number | null;
  average_points: number | null;
  median_points: number | null;
  buckets: ScoreDistributionBucket[];
}

/**
 * One participant's score on one skill, from the API.
 *
 * The rows of `by_skill` sum EXACTLY to the parent's `points` / `max_points` /
 * `marked_points` / `answered` / `correct` / `pending` — the server folds
 * them with the same pricing helpers as the headline figures. That is what
 * makes them safe to draw beside the total: nothing on the client re-derives a
 * score. `marked_points` and `pending` are per skill, so a bar whose essay is
 * unmarked can say so instead of drawing 0%.
 */
export interface SkillScore {
  skill: SkillTag;
  question_count: number;
  answered: number;
  correct: number;
  points: number;
  max_points: number;
  marked_points: number;
  pending: number;
}

/**
 * How the room did on one skill: `LiveSessionResults.exercises` rolled up.
 * Accuracy (`correct / answered`), not mean score — the per-question tab's
 * figure, summed. `max_points` rows sum to the paper's total.
 */
export interface SessionSkillAccuracy {
  skill: SkillTag;
  question_count: number;
  max_points: number;
  answered: number;
  correct: number;
  points: number;
  pending: number;
  /** The room's SCORE on this skill: each counted student's points on its
   * questions (0 when they reached none), with the histogram against this
   * skill's `max_points`. Absent on an older API. */
  average_points?: number | null;
  median_points?: number | null;
  buckets?: ScoreDistributionBucket[];
}

// The student `ExerciseAnswer` shape (see src/lib/exercises.ts).
// Mirrors the domain type in lib/exercises.ts.
export type ExerciseAnswer =
  | string
  | string[]
  | Record<string, string>
  | null;

// --- Shared request helpers -------------------------------------------------
const JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

async function requestJson(
  url: string,
  init: RequestInit,
  action: string,
): Promise<unknown> {
  // No `credentials` here on purpose: the template's fetchWithRefresh sends the
  // access token as a Bearer header and no cookies at all, because an
  // access-token cookie does not fit alongside the refresh one in WebKit's
  // per-domain budget and iOS drops it. Setting `credentials: "include"` here
  // would put cookies on the wire for these calls alone.
  const response = await fetchWithRefresh(url, init);
  if (!response.ok) {
    // Read the error body so the server's own explanation (the registry's
    // validation messages) reaches the caller instead of a bare status line.
    throw await readApiError(response, action);
  }
  // 204 / empty bodies (e.g. DELETE) have nothing to parse.
  if (response.status === 204) {
    return null;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function getOne<T>(url: string, action: string): Promise<T> {
  const data = await requestJson(url, { method: "GET", headers: JSON_HEADERS }, action);
  const object = getSingleObjectPayload<T>(data);
  if (!object) {
    throw new Error(`${action}: empty response`);
  }
  return object;
}

async function listAll<T>(url: string, action: string): Promise<T[]> {
  const data = await requestJson(url, { method: "GET", headers: JSON_HEADERS }, action);
  return getArrayPayload<T>(data);
}

// An array value becomes a REPEATED key (`?tags=a&tags=b`), which is how the
// API takes multi-valued filters. Joining them into one string would send a
// single tag literally named "a,b".
type ListParams = Record<string, string | string[] | undefined>;

/** Which page of a cursor-paginated list to read, and how long a page is. */
export interface PageRequest {
  pageSize: number;
  /** The previous page's `nextCursor`; null for the first page. */
  cursor: string | null;
}

/**
 * One page of a v2 cursor-paginated list.
 *
 * The v2 list endpoints paginate with an opaque cursor and a `page_size` that
 * **defaults to 50** — so a caller that just GETs the URL silently receives the
 * first 50 rows and no indication there are more. Every caller here says how
 * long a page is: the tables ask for their own page size and walk the cursor a
 * page at a time (`useCursorTable`), and `listAllPages` asks for the maximum.
 */
async function listPage<T>(
  url: string,
  action: string,
  params: ListParams,
  page: PageRequest,
): Promise<CursorPaginatedResult<T>> {
  const target = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) target.searchParams.append(key, item);
    } else {
      target.searchParams.set(key, value);
    }
  }
  target.searchParams.set("page_size", String(page.pageSize));
  if (page.cursor) target.searchParams.set("cursor", page.cursor);
  const data = await requestJson(
    target.toString(),
    { method: "GET", headers: JSON_HEADERS },
    action,
  );
  return parseCursorPage<T>(data);
}

/**
 * Every page of a v2 cursor-paginated list — for the PICKERS (groups, classes,
 * the tests a question can be added to), where a list that silently stops at
 * the first page looks complete and is not. Tables page on the server instead.
 *
 * `page_size` is asked at the API's maximum to keep the round trips down, and
 * `MAX_PAGES` is a runaway guard (a cursor that never advances would otherwise
 * loop forever), not a limit anyone should hit.
 */
const CURSOR_PAGE_SIZE = 200;
const MAX_PAGES = 50;

async function listAllPages<T>(
  url: string,
  action: string,
  params: ListParams = {},
): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result: CursorPaginatedResult<T> = await listPage<T>(url, action, params, {
      pageSize: CURSOR_PAGE_SIZE,
      cursor,
    });
    items.push(...result.items);
    if (!result.nextCursor || result.items.length === 0) return items;
    cursor = result.nextCursor;
  }
  return items;
}

async function sendOne<T>(
  url: string,
  method: "POST" | "PATCH",
  body: unknown,
  action: string,
  signal?: AbortSignal,
): Promise<T> {
  const data = await requestJson(
    url,
    { method, headers: JSON_HEADERS, body: JSON.stringify(body ?? {}), signal },
    action,
  );
  const object = getSingleObjectPayload<T>(data);
  if (!object) {
    throw new Error(`${action}: empty response`);
  }
  return object;
}

// --- Tests ------------------------------------------------------------------
export interface ListTestsParams {
  /** Repeated on the query string. The API matches ALL of them. */
  tags?: string[];
  /**
   * Keep only the tests filed under a group, or only those filed under a class.
   *
   * All three of these describe a test's **authorization parent**, set once at
   * create — not where it has been used. `classKey` here is narrower than
   * `GET /v2/classes/{key}/tests`, which also returns tests merely scheduled
   * into one of that class's sessions.
   */
  scope?: "group" | "class";
  groupKey?: string;
  classKey?: string;
  /** The test's name or its group's name. */
  q?: string;
  /** Only the tests with this question on their paper, in a part or a section. */
  exerciseKey?: string;
}

function testListParams(params: ListTestsParams): ListParams {
  return {
    // Trimmed to undefined rather than sent empty, like the collections search.
    q: params.q?.trim() || undefined,
    tags: params.tags?.length ? params.tags : undefined,
    scope: params.scope,
    group_key: params.groupKey,
    class_key: params.classKey,
    exercise_key: params.exerciseKey,
    // The app the import saves for: a practice import lists practice tests.
    app: importOptions().testApp,
  };
}

/** Every test, for the pickers. The test library pages with `listTestsPage`. */
export function listTests(params: ListTestsParams = {}): Promise<Test[]> {
  return listAllPages<Test>(getEndpoint("tests"), "List tests", testListParams(params));
}

export function listTestsPage(
  params: ListTestsParams,
  page: PageRequest,
): Promise<CursorPaginatedResult<Test>> {
  return listPage<Test>(getEndpoint("tests"), "List tests", testListParams(params), page);
}

/** One tag in use, and how many rows the caller can see carry it. */
export interface TagCount {
  tag: string;
  count: number;
}

export function listTestTags(): Promise<TagCount[]> {
  return listAll<TagCount>(`${getEndpoint("tests")}/tags`, "List test tags");
}

export function getTest(testKey: string): Promise<Test> {
  return getOne(getTestEndpoint(testKey), "Get test");
}

export function patchTest(testKey: string, body: UpdateTestBody): Promise<Test> {
  return sendOne(getTestEndpoint(testKey), "PATCH", body, "Patch test");
}

// POST /v2/tests takes {area, name} plus the one key that area implies
// (app/models/requests.py TestPostRequest) — everything else about a test is
// set afterwards on the Details tab.
//
// The key is load-bearing rather than filing metadata: it is the test's ACL
// parent, and a test with no parent is unreachable by its own creator (the API
// reports that as a 404). Which key also decides which relation the API
// enforces — `editor` on the group, or `editor` on the class.
export type TestScopeBody =
  | { area: "group"; group_key: string }
  | { area: "class"; class_key: string };

// `tags` is optional on the create too (TestPostRequest folds it into
// `info["tags"]`), so a test can be filed for the library's tag filter the
// moment it exists rather than by a second PATCH from its Details tab.
export type CreateTestBody = TestScopeBody & { name: string; tags?: string[]; app?: "leap" | "practice" };

/** A new test, made for the app `configureImport` names (`academics.test.app`). */
export function createTest(body: CreateTestBody): Promise<Test> {
  return sendOne(getEndpoint("tests"), "POST", { app: importOptions().testApp, ...body }, "Create test");
}

// --- Groups and classes -----------------------------------------------------
// Only what the create-test form needs: enough of ClassGroupResponseStub /
// ClassResponseStub (app/models/responses.py) to label and key a select.
export interface GroupStub {
  appsheet_key: string;
  name: string | null;
}

export interface ClassStub {
  appsheet_key: string;
  class_name: string;
  group_name: string | null;
  status: string;
  /** Coursework on: a run answered in files is then made through it. Absent on an older API. */
  coursework_drive?: boolean;
}

/**
 * Groups the caller may file a test under.
 *
 * Expect this to 403 for a classroom teacher: it needs the `groups_get` scope,
 * which the default employee role string does not include, and group `viewer`,
 * which is granted to supervisor access-groups rather than to teachers. That is
 * not an error to surface — it means "you file tests under a class", which is
 * what the create form falls back to.
 */
export function listGroups(): Promise<GroupStub[]> {
  // Every page, not `listAll`. These feed pickers, and a picker that silently
  // stops at the API's default page size of 50 offers a list that looks
  // complete and is not.
  return listAllPages<GroupStub>(getEndpoint("groups"), "List groups");
}

/**
 * Classes the caller teaches. Needs `classes_get`, which every employee holds,
 * and is authorized per row by OpenFGA — so this returns exactly the caller's
 * own classes without any filtering here.
 */
export function listClasses(): Promise<ClassStub[]> {
  return listAllPages<ClassStub>(getEndpoint("classes"), "List classes");
}

// --- Exercise library -------------------------------------------------------
export interface ListExercisesParams {
  skill?: SkillTag;
  author_key?: string;
  search?: string;
  /** Repeated on the query string. The API matches ALL of them. */
  tags?: string[];
  page_size?: number;
  cursor?: string | null;
}

export async function listExercises(
  params: ListExercisesParams = {},
): Promise<CursorPaginatedResult<AuthoredExercise>> {
  const url = new URL(getEndpoint("exercises"));
  if (params.skill) url.searchParams.set("skill", params.skill);
  if (params.author_key) url.searchParams.set("author_key", params.author_key);
  if (params.search) url.searchParams.set("search", params.search);
  for (const tag of params.tags ?? []) url.searchParams.append("tags", tag);
  if (params.page_size) url.searchParams.set("page_size", String(params.page_size));
  if (params.cursor) url.searchParams.set("cursor", params.cursor);
  const data = await requestJson(
    url.toString(),
    { method: "GET", headers: JSON_HEADERS },
    "List exercises",
  );
  return parseCursorPage<AuthoredExercise>(data);
}

// `test_key` optionally links the new exercise to a test in the same call
// (creates the TestExercise join server-side).
// `collection`/`collection_order` on AuthoredExercise are the read-side shape
// (an embedded stub); the write side takes the key instead, so they're dropped
// from the base here rather than inherited with the wrong types.
export type CreateExerciseBody = Omit<
  Partial<AuthoredExercise>,
  "collection" | "collection_order"
> & {
  collection_key?: string;
  collection_order?: number;
};

export function listExerciseTags(): Promise<TagCount[]> {
  return listAll<TagCount>(`${getEndpoint("exercises")}/tags`, "List exercise tags");
}

export function createExercise(
  body: CreateExerciseBody,
): Promise<AuthoredExercise> {
  return sendOne(getEndpoint("exercises"), "POST", body, "Create exercise");
}

export interface QuestionImage {
  // The image's SHA-256 and extension — what an option's `image_key` holds.
  image_key: string;
  // A signed URL to show it while editing; it expires in hours.
  url: string;
}

// POST /v2/exercises/images — store one image (base64; PNG/JPEG/WebP/GIF,
// at most 5 MB) in the private media bucket, named by its content hash.
export function uploadQuestionImage(data: string): Promise<QuestionImage> {
  return sendOne(`${getEndpoint("exercises")}/images`, "POST", { data }, "Upload image");
}

// GET /v2/exercises/{id} — one library exercise, teacher-guarded so it carries
// `answer_key` (the library detail page renders and edits the key). Distinct
// from the test-scoped exercise view, which reads a test_exercise LINK.
export function getExercise(exerciseKey: string): Promise<AuthoredExercise> {
  return getOne(getExerciseEndpoint(exerciseKey), "Get exercise");
}

/**
 * PATCH /v2/exercises/{id}. A changed answer key or marks over answers already
 * auto-marked is a 409 `RegradeConflict`; resend with a `RegradeChoice`.
 */
/** A question's PATCH: its fields, and the part or section it sits in (null takes it out). */
export type ExercisePatchBody = Partial<AuthoredExercise> & {
  collection_key?: string | null;
};

export function patchExercise(
  exerciseKey: string,
  body: ExercisePatchBody & Partial<RegradeChoice>,
): Promise<AuthoredExercise> {
  return sendOne(getExerciseEndpoint(exerciseKey), "PATCH", body, "Patch exercise");
}

/**
 * DELETE /v2/exercises/{id} — remove a question from the library for good.
 *
 * Refuses nothing about the question's use. The row's `test_exercise` links
 * cascade in the database (015), and through migration 033 every student answer
 * recorded against those links cascades with them — so this takes the question
 * off every test that uses it, tests the caller cannot see included, and deletes
 * those answers permanently. A collection member simply leaves its collection.
 * The one refusal is the author check: `editor` on the exercise, which anyone
 * but its author is answered with a **404**, not a 403.
 */
export async function deleteExercise(exerciseKey: string): Promise<void> {
  await requestJson(
    getExerciseEndpoint(exerciseKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Delete exercise",
  );
}

// --- Test ↔ exercise links --------------------------------------------------
/**
 * Every question on a test, in screen order.
 *
 * `GET /v2/tests/{id}/exercises` is cursor-paginated (page_size defaults to
 * 50), so this walks every page rather than reading one: the Questions
 * workspace numbers the whole paper, and a list cut at page one would number a
 * 60-question paper as its first 50.
 */
export function listTestExercises(testKey: string): Promise<TestExerciseLink[]> {
  return listAllPages<TestExerciseLink>(
    getTestExercisesEndpoint(testKey),
    "List test exercises",
  );
}



/**
 * Set what a question is worth ON THIS TEST.
 *
 * The mark lives on the link, not the library exercise: the same question can be
 * worth 4 marks in one paper and 1 in another, and patching `Exercise.points`
 * would reprice every test that uses it — including papers already sat. That is
 * the whole reason this endpoint exists, so do not "simplify" it into
 * `updateExercise`.
 *
 * `points: null` puts the link back to inheriting the library default. Omitting
 * the field leaves the mark alone, which is why the caller must send `null`
 * explicitly rather than dropping the key. A changed mark over answers already
 * auto-marked is a 409 `RegradeConflict`, as on `patchExercise`.
 */
export function patchTestExercise(
  testKey: string,
  testExerciseKey: string,
  body: { edited_at: string | null; points: number | null } & Partial<RegradeChoice>,
): Promise<TestExerciseLink> {
  return sendOne(
    getTestExerciseEndpoint(testKey, testExerciseKey),
    "PATCH",
    body,
    "Set question marks",
  );
}


// --- Class sessions ---------------------------------------------------------
/** One timetabled session of a class (`academics.session`). */
export interface ClassSession {
  appsheet_key: string;
  session_no: number | null;
  timestamp: string;
}

/**
 * Every session of a class, oldest first. Not windowed: a class's timetable is
 * tens of rows, and a window around today hid every session of a class run
 * outside its term.
 */
export async function listClassSessions(classKey: string): Promise<ClassSession[]> {
  const sessions = await listAllPages<ClassSession>(
    getClassSessionsEndpoint(classKey),
    "List class sessions",
  );
  return [...sessions].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// --- Live sessions ----------------------------------------------------------
/**
 * Open a run. `delivery` and `admission` are fixed for its life. `sessionKey`
 * is the class session it is set in: one of the class's own for a class test,
 * any class session the caller can see for a group test, and null only on a run
 * guests can sit.
 */
export function createLiveSession(
  testKey: string,
  sessionKey: string | null,
  delivery: LiveSessionDelivery,
  admission: LiveSessionAdmission,
): Promise<LiveSession> {
  return sendOne(
    getEndpoint("liveSessions"),
    "POST",
    // Both settings are chosen here or never: no PATCH changes them.
    { test_key: testKey, session_key: sessionKey, delivery, admission },
    "Create challenge",
  );
}

/** Question types a student answers in a coursework file rather than inline. */
export const FILE_ANSWER_TYPES: ReadonlySet<string> = new Set(["essay", "speaking"]);

/** One piece of a class's coursework, as the run picker lists it. */
export interface Coursework {
  appsheet_key: string;
  edited_at: string | null;
  class_key: string;
  session_key: string;
  type: "assignment" | "material";
  title: string;
  due_at: string | null;
  status: "draft" | "posted";
}

/**
 * A new assignment in one of the class's sessions, as a draft: nothing reaches
 * students until it is posted, so a run that then fails to attach leaves no
 * half-made assignment in their list.
 */
export function createDraftAssignment(
  classKey: string,
  body: { session_key: string; title: string; due_at?: string },
): Promise<Coursework> {
  return sendOne(
    getClassCourseworkEndpoint(classKey),
    "POST",
    { ...body, type: "assignment", status: "draft" },
    "Create assignment",
  );
}

/** One piece of coursework, for the `edited_at` a PATCH needs. */
export function getCoursework(classKey: string, courseworkKey: string): Promise<Coursework> {
  return getOne(`${getClassCourseworkEndpoint(classKey)}/${encodeURIComponent(courseworkKey)}`, "Get coursework");
}

/** A Leap run attached to coursework; `config.live_session_key` names the run it opened. */
export interface LeapRunMaterial {
  appsheet_key: string;
  kind: string;
  config: { live_session_key?: string };
}

/**
 * Open a new run of a test under coursework (`leap_new`): signed in, owned by
 * the caller and set in the coursework's session. The run and the material are
 * saved together or not at all.
 */
export function attachNewRun(
  classKey: string,
  courseworkKey: string,
  testKey: string,
  delivery: LiveSessionDelivery,
): Promise<LeapRunMaterial> {
  return sendOne(
    `${getClassCourseworkEndpoint(classKey)}/${encodeURIComponent(courseworkKey)}/materials`,
    "POST",
    { kind: "leap_new", config: { test_key: testKey, delivery } },
    "Attach challenge",
  );
}

/** Post a draft to the class, which hands each student their Docs. Cannot be undone. */
export function postCoursework(
  classKey: string,
  courseworkKey: string,
  editedAt: string | null,
): Promise<Coursework> {
  return sendOne(
    `${getClassCourseworkEndpoint(classKey)}/${encodeURIComponent(courseworkKey)}`,
    "PATCH",
    { edited_at: editedAt, status: "posted" },
    "Post assignment",
  );
}

/** A class's coursework, newest first, every page. */
export function listClassCoursework(classKey: string): Promise<Coursework[]> {
  return listAllPages<Coursework>(getClassCourseworkEndpoint(classKey), "List coursework");
}

/**
 * Change one run's settings: its time limit, due date, attempts, results release
 * or class session.
 *
 * In the lobby this sets what the run will start with. On a LIVE run the server
 * recomputes the deadline from `started_at` (so "45 minutes" is always 45
 * minutes of exam, not 45 from when it was typed), pushes it to the students'
 * countdowns and re-arms its auto-end. `minutes: 0` removes the limit.
 *
 * A limit the run has already used up is refused by the server rather than
 * ending it — `ApiError.detail` says so in the teacher's own terms, so surface
 * it with `errorMessage()` rather than a generic failure toast.
 */
export function patchLiveSession(
  sessionKey: string,
  body: UpdateLiveSessionBody,
): Promise<LiveSession> {
  return sendOne(
    getLiveSessionEndpoint(sessionKey),
    "PATCH",
    body,
    "Patch challenge",
  );
}

/**
 * Live sessions the caller may see, newest first.
 *
 * Visibility is the OpenFGA `viewer` relation, so this returns a teacher's own
 * sessions *and* any session the caller joined as a student. The params are
 * filters, not grants — `owner_key` narrows, it never widens. The caller's OWN
 * runs are `owner_key=<their sub>`.
 */
export interface ListLiveSessionsParams {
  owner_key?: string;
  test_key?: string;
  status?: LiveSessionStatus;
  page_size?: number;
  cursor?: string | null;
}

export async function listLiveSessions(
  params: ListLiveSessionsParams = {},
): Promise<CursorPaginatedResult<LiveSession>> {
  const url = new URL(getEndpoint("liveSessions"));
  if (params.owner_key) url.searchParams.set("owner_key", params.owner_key);
  if (params.test_key) url.searchParams.set("test_key", params.test_key);
  if (params.status) url.searchParams.set("status", params.status);
  if (params.page_size) url.searchParams.set("page_size", String(params.page_size));
  if (params.cursor) url.searchParams.set("cursor", params.cursor);
  const data = await requestJson(
    url.toString(),
    { method: "GET", headers: JSON_HEADERS },
    "List challenges",
  );
  return parseCursorPage<LiveSession>(data);
}

export function getLiveSession(sessionKey: string): Promise<LiveSession> {
  return getOne(getLiveSessionEndpoint(sessionKey), "Get live session");
}

/**
 * The student-safe paper for ONE attempt. `participantKey` is required by the
 * API: serving the paper stamps that attempt's start, so a review of attempt 1
 * must not stamp an untouched attempt 2.
 */
/**
 * Every question of the paper, part by part in screen order: the map, then
 * each part opened. For a finished attempt only, where opening stamps nothing.
 */
export async function readWholePaper(sessionKey: string, participantKey: string): Promise<SessionExercise[]> {
  const parts = await listRunParts(sessionKey, participantKey);
  const opened = await Promise.all(parts.map((part) => openRunPart(sessionKey, participantKey, part.part_key)));
  return opened.flatMap((part) => [...part.exercises].sort((a, b) => a.order - b.order));
}

export function startLiveSession(sessionKey: string): Promise<LiveSession> {
  return sendOne(getLiveSessionStartEndpoint(sessionKey), "POST", {}, "Start live session");
}

export function endLiveSession(sessionKey: string): Promise<LiveSession> {
  return sendOne(getLiveSessionEndEndpoint(sessionKey), "POST", {}, "End live session");
}

/**
 * POST /v2/live-sessions/{id}/regrade — re-mark a run's auto-marked answers
 * against today's answer keys and marks, in a background task. Answers how many
 * answers it queued; the results move once the task has run.
 */
export function regradeLiveSession(sessionKey: string): Promise<{ answers: number }> {
  return sendOne(getLiveSessionRegradeEndpoint(sessionKey), "POST", {}, "Regrade answers");
}

// Join requires authentication. The participant's identity is the caller's
// account — the backend sets `Participant.user_key` from the token and takes the
// display name from it — so there is nothing to send and nothing to spoof.
// Re-joining is idempotent on (session, user), so a refresh returns the same
// participant rather than a duplicate.
/**
 * Join a room by code — idempotently, returning the caller's LATEST attempt.
 *
 * `retake: true` asks for a new attempt instead, once the latest is handed in.
 * It is never implied: a join that opened a new attempt whenever the last one
 * was finished would start attempt 2 on every reload of a score screen. The
 * server refuses it on a class run, once retries are used up and after the due
 * date, and returns the in-progress attempt if the latest is not finished — so
 * a double-tap lands on one new attempt, not two.
 */
export function joinLiveSession(
  joinCode: string,
  options: { retake?: boolean; cohortKey?: string } = {},
): Promise<LiveSessionJoin> {
  return sendOne(
    getLiveSessionJoinEndpoint(joinCode),
    "POST",
    {
      ...(options.retake ? { retake: true } : {}),
      // Lands only on an attempt with no cohort yet; see `LiveSessionJoin`.
      ...(options.cohortKey ? { cohort_key: options.cohortKey } : {}),
    },
    options.retake ? "Start another attempt" : "Join challenge",
  );
}

// The three participant-scoped writes below name the participant in the PATH,
// where the route checks it. Body-keyed paths still answer as deprecated
// aliases; don't call them.
export function submitLiveAnswer(
  sessionKey: string,
  participantKey: string,
  body: {
    exercise_key: string;
    answer: ExerciseAnswer;
  },
  signal?: AbortSignal,
): Promise<AnswerAck> {
  return sendOne(
    getParticipantAnswerSubmitEndpoint(sessionKey, participantKey),
    "POST",
    body,
    "Submit answer",
    signal,
  );
}

export function sendLiveHeartbeat(
  sessionKey: string,
  participantKey: string,
  // `highlights` replaces what is saved; leave it out to keep it.
  body: { current_index?: number; highlights?: Record<string, SavedHighlight[]> },
): Promise<unknown> {
  return sendOne(
    getParticipantHeartbeatEndpoint(sessionKey, participantKey),
    "POST",
    body,
    "Heartbeat",
  );
}

/**
 * Why a sitting is being handed in. `timeout` is the runner's countdown, which
 * the server checks against its own clock and refuses with 409 while time is
 * left (`finish_participant`); `submit` is the student's choice and never is.
 */
export type FinishReason = "submit" | "timeout";

export function finishParticipant(
  sessionKey: string,
  participantKey: string,
  reason: FinishReason = "submit",
): Promise<unknown> {
  return sendOne(
    getParticipantFinishEndpoint(sessionKey, participantKey),
    "POST",
    { reason },
    "Finish participant",
  );
}

/**
 * One answer the student already submitted, exactly as they submitted it.
 * Ungraded by construction — see `listParticipantAnswers`.
 */
export interface ParticipantAnswer {
  exercise_key: string;
  answer: ExerciseAnswer;
}

/**
 * The student's own submitted answers, for restoring the runner after a refresh.
 *
 * Answers live in React state and are POSTed as the student leaves each page;
 * Postgres is the durable store, so without this read a refresh mid-exam would
 * redraw a blank paper over answers already stored.
 *
 * Safe to call DURING a sitting precisely because it carries no correctness:
 * `/result` is the graded view and stays behind the answer_visibility gate.
 */
export function listParticipantAnswers(
  sessionKey: string,
  participantKey: string,
): Promise<ParticipantAnswer[]> {
  return listAll(
    getParticipantAnswersEndpoint(sessionKey, participantKey),
    "List submitted answers",
  );
}

export function getParticipantResult(
  sessionKey: string,
  participantKey: string,
): Promise<ParticipantResult> {
  return getOne(
    getParticipantResultEndpoint(sessionKey, participantKey),
    "Get participant result",
  );
}

// The teacher's results view for a session. One read, straight from Postgres,
// and deliberately NOT subject to the answer_visibility gate that gates the
// student's own result — so it still works for a test set to `never`.
export interface SessionParticipantResult {
  participant_key: string;
  display_name: string | null;
  /**
   * The address a guest typed on a public link — the only reason it is
   * collected, and the only place a teacher can read it. Null for a class
   * student, whose identity is their account.
   */
  guest_email: string | null;
  answered: number;
  correct: number;
  points: number;
  /**
   * Answers nobody has marked, and the part of the paper that HAS been marked.
   * A table ranked on `points` alone puts a student with two unmarked essays
   * below one who wrote nothing.
   */
  pending?: number;
  marked_points?: number;
  risk_score: number;
  current_index: number | null;
  online: boolean;
  finished_at: string | null;
  joined_at: string | null;
  /**
   * When the paper was served to this student — the start of their attempt.
   * NOT `joined_at`, which on a class run is when they entered the lobby. Null
   * until they open the paper, and on every attempt sat before the API stamped
   * it; `attemptDuration` returns null rather than guessing from `joined_at`.
   */
  started_at: string | null;
  /**
   * Standing in this room, 0..1 with 1.0 at the top. Ties share a value and a
   * lone participant is 1.0 — the same definition an assessment's percentile
   * carries, so the word means one thing across the platform.
   */
  percentile: number | null;
  /**
   * Which attempt this row is, and whether it is the one the class statistics
   * count for its student (the test's `retake_scoring`). Every attempt is
   * listed; only counted ones feed the distribution, the average and each
   * question's accuracy, and `percentile` is null on the rest. Absent on an API
   * that predates re-takes, where every row is a first attempt and counts.
   */
  attempt_no?: number;
  counted?: boolean;
  /**
   * The run this attempt was made in — on a results group's rows, which run
   * it links back to — and the cohort it is in. Absent on an older API.
   */
  live_session_key?: string;
  cohort_key?: string | null;
  /** This attempt's totals split by skill, summing to the fields above.
   * Absent on an older API. */
  by_skill?: SkillScore[];
  /** The same totals by part and by section, in paper order; the part rows
   * sum to the fields above. Labelled from the paper read. Absent on an
   * older API. */
  by_collection?: CollectionScore[];
}

/** One attempt's score on one part or section, the `SkillScore` fields keyed
 * by collection. Decimals arrive as strings. */
export interface CollectionScore {
  collection_key: string;
  question_count: number;
  answered: number;
  correct: number;
  points: number;
  max_points: number;
  marked_points: number;
  pending: number;
}

/** The room's average on one part or section, over the counted attempts.
 * Decimals arrive as strings. */
export interface CollectionAverage {
  collection_key: string;
  average_points: number | null;
}

export interface SessionExerciseAccuracy {
  exercise_key: string;
  order: number;
  title: string | null;
  skill: SkillTag | null;
  max_points: number | null;
  answered: number;
  correct: number;
  points: number;
  /**
   * How many answers to this question are still unmarked. Without it a
   * human-graded question reads 0% accuracy however well the class wrote —
   * indistinguishable from one everybody got wrong.
   */
  pending?: number;
}

export interface LiveSessionResults {
  live_session_key: string;
  test_key: string;
  status: LiveSessionStatus;
  question_count: number;
  max_points: number;
  participants: SessionParticipantResult[];
  exercises: SessionExerciseAccuracy[];
  /** `exercises` rolled up by skill, server-side. Absent on an older API. */
  by_skill?: SessionSkillAccuracy[];
  /** The room's average on each part and section, in paper order. Absent on
   * an older API. */
  by_collection?: CollectionAverage[];
  average_points: number | null;
  median_points: number | null;
  highest_points: number | null;
  lowest_points: number | null;
  /** Score-range buckets for the distribution chart, computed by the API. */
  buckets: ScoreDistributionBucket[];
  /**
   * Each cohort's counted attempts summed up by the API (`cohort_key` null for
   * attempts in none), over the whole room whatever the roster filter.
   */
  cohorts: CohortScores[];
  /** As on `LiveSession`. Absent on an older API. */
  regrade_due?: RegradeDue[];
  last_regrade?: LastRegrade | null;
}

/** One cohort's figures in a results read. Points arrive as Decimal strings. */
export interface CohortScores {
  cohort_key: string | null;
  people: number;
  highest_points: number;
  lowest_points: number;
  median_points: number;
  average_points: number;
}

/** One bar of the score distribution, as the API returns it. */
export interface ScoreDistributionBucket {
  label: string;
  lower: number;
  upper: number;
  count: number;
  percentile: number | null;
}

/**
 * A participant, with the session and test context needed to read it.
 *
 * Note this is *not* the `Participant` shape the teacher screens use: it omits
 * `risk_score`, which is teacher-facing by design.
 *
 * `scores_visible` is the test's `answer_visibility` gate, evaluated
 * server-side: false means the teacher hasn't released the score, so `correct`
 * / `points` / `max_points` are null. Render that as "not released", never as
 * a zero — the attempt was recorded either way.
 */
export interface ParticipantSummary {
  participant_key: string;
  live_session_key: string;
  test_key: string;
  test_name: string | null;
  session_status: LiveSessionStatus;
  /**
   * The code that reopens this run. The play flow is keyed by code
   * (`/play/:code`), not by session key, so without this a student who steps out
   * of a waiting room has to have kept the code to get back in.
   */
  join_code: string;
  /** Which attempt at the room this is, 1-based. Absent on an API without re-takes. */
  attempt_no?: number;
  joined_at: string | null;
  /** The attempt's real start; see SessionParticipantResult.started_at. */
  started_at: string | null;
  finished_at: string | null;
  answered: number;
  question_count: number;
  scores_visible: boolean;
  correct: number | null;
  points: number | null;
  max_points: number | null;
}

/**
 * A user's participants, newest first.
 *
 * Two routes rather than one with a defaulting param: `/users/me/participants`
 * is unambiguous, and `/users/{key}/participants` makes the target explicit and
 * OpenFGA-checked (`editor` on that user). Nothing is inferred from an absent
 * parameter.
 */
export function listMyParticipants(): Promise<ParticipantSummary[]> {
  return listAll(getMyParticipantsEndpoint(), "List my participants");
}

export function listUserParticipants(
  userKey: string,
): Promise<ParticipantSummary[]> {
  return listAll(getUserParticipantsEndpoint(userKey), "List user participants");
}

/**
 * The caller's own record. `GET /v2/users/me` resolves the user from the access
 * token and needs no scope at all, so a student, a teacher and a guest each
 * reach their own.
 *
 * Only the fields Leap uses are typed. `info` is the per-user JSON blob the
 * other apps keep their client state in (HRM's Workspace flags and department,
 * the bank fields), and `edited_at` is the optimistic-concurrency token every
 * patch has to quote.
 */
export interface CurrentUser {
  sub: string;
  name: string | null;
  username: string | null;
  account_type: string;
  edited_at: string | null;
  info: Record<string, unknown> | null;
}

export function getCurrentUser(): Promise<CurrentUser> {
  return getOne(getEndpoint("currentUser"), "Get current user");
}

/**
 * Write keys into the caller's own `info`.
 *
 * The API **shallow-merges** what is sent into the stored blob
 * (`app/base/repositories/user.py:patch_user`), so passing only the keys being
 * changed is correct and leaves everyone else's — HR's, the LMS's — alone. That
 * merge is one level deep only: a nested object is replaced wholesale, which is
 * why Leap's keys are flat.
 *
 * `edited_at` must be the value read back from the server; a stale one is
 * rejected as a conflict and a missing one as a bad request. Patching `info` on
 * your own record needs no scope (the `/me` route exempts it).
 */
export function patchCurrentUserInfo(
  editedAt: string,
  info: Record<string, unknown>,
): Promise<CurrentUser> {
  return sendOne(
    getEndpoint("currentUser"),
    "PATCH",
    { edited_at: editedAt, info },
    "Save your profile",
  );
}

/**
 * One integrity signal, with the risk it actually contributed.
 *
 * `weight` is the value stamped when the event was recorded, not a client-side
 * re-derivation — the weights are a server tuning table, and mirroring it here
 * would put the drifting copy on screen. A zero means the event happened before
 * the run went live: waiting in the lobby is not misconduct, and the row is kept
 * so the timeline can say so.
 *
 * `payload` is the signal's detail and never the student's work — a paste
 * carries its length, never its text.
 */
export interface ProctorEventItem {
  appsheet_key: string;
  type: ProctorEventType;
  occurred_at: string | null;
  payload: Record<string, unknown> | null;
  weight: number;
}

export interface RiskTypeTally {
  type: ProctorEventType;
  count: number;
  /** Zero when the events of this type were charged at different weights. */
  weight_each: number;
  subtotal: number;
}

/**
 * A risk score with its evidence.
 *
 * `score` is what the participant row stores; `computed_score` is the sum of the
 * events' own weights. They should agree — both are carried so a divergence is
 * visible instead of silently wrong.
 */
export interface RiskBreakdown {
  score: number;
  computed_score: number;
  by_type: RiskTypeTally[];
  recent_events: ProctorEventItem[];
  /** True when there are more events than `recent_events` carries. */
  truncated: boolean;
}

/** One question of a test as one participant met it. */
export interface AttemptItem {
  exercise_key: string;
  order: number;
  /** The authored shape — the key rides along, because comparison is the point. */
  exercise: AuthoredExercise;
  /** Null when they never reached this question. */
  answer: ExerciseAnswer | null;
  /** The student's Doc or recording, for a question answered in a file. */
  document?: SubmissionFile | null;
  /** Null when unanswered, or when the type is human-graded (essays). */
  correct: boolean | null;
  points: number | null;
  /**
   * What this row was marked out of — the snapshot taken when it was graded, or
   * the link's current value for a question never reached. Read this rather
   * than `exercise.points`: that is the library default, which a per-test
   * override and a later edit both diverge from.
   */
  max_points: number | null;
  /** When they FIRST answered. */
  created_at: string | null;
  /**
   * When they last CHANGED the answer. Equal to `created_at` on an answer given
   * once: neither an identical re-send nor a mark moves it.
   */
  last_answered_at: string | null;
  /** The row's own: any write moves it, a teacher's mark included. */
  edited_at: string | null;
  /**
   * Answered, and nobody has graded it yet — computed server-side as
   * `points === null`.
   *
   * **Never re-derive it from `correct`.** Marking leaves `correct` null on a
   * written answer for good (full marks do not make an essay "correct"), so
   * `correct === null` would keep reporting a marked essay as outstanding.
   */
  pending: boolean;
  feedback: string | null;
  graded_by: string | null;
  graded_at: string | null;
  /** `manual` protects the mark from being undone by a regrade. */
  grade_source: "auto" | "manual" | null;
}

/**
 * One participant's whole run, for the teacher who owns it.
 *
 * Every linked question is an item, including the ones never reached — "ran out
 * of time from Q41" is invisible in a list built from answers.
 *
 * Not subject to `answer_visibility`, unlike the student's own `/result`: that
 * gate keeps students blind and refuses the teacher too, permanently for a test
 * set to `never`. Two audiences, two endpoints.
 */
export interface ParticipantAttempt {
  participant_key: string;
  user_key: string | null;
  display_name: string | null;
  live_session_key: string;
  test_key: string;
  joined_at: string | null;
  /** The attempt's real start; see SessionParticipantResult.started_at. */
  started_at: string | null;
  finished_at: string | null;
  last_seen: string | null;
  online: boolean;
  current_index: number | null;
  question_count: number;
  answered: number;
  correct: number;
  points: number;
  max_points: number;
  /** See ParticipantResult — the provisional pair. */
  pending: number;
  marked_points: number;
  /** The same totals split by skill. Absent on an older API. */
  by_skill?: SkillScore[];
  /** See `ParticipantResult.standing`. */
  standing?: ScoreStanding | null;
  standing_by_skill?: ScoreStanding[];
  risk: RiskBreakdown;
  items: AttemptItem[];
}

/**
 * Mark one written answer.
 *
 * `points` may be 0 — awarding nothing is a mark, and is not the same as
 * leaving it unmarked. The API refuses more than the row's own `max_points`.
 * There is no `edited_at`: on an answer that field means "the student revised",
 * so it is not this request's concurrency token.
 */
export function markParticipantAnswer(
  sessionKey: string,
  participantKey: string,
  testExerciseKey: string,
  body: { points: number; feedback?: string | null },
): Promise<AttemptItem> {
  return sendOne(
    getMarkAnswerEndpoint(sessionKey, participantKey, testExerciseKey),
    "PATCH",
    body,
    "Mark answer",
  );
}

export function getParticipantAttempt(
  sessionKey: string,
  participantKey: string,
): Promise<ParticipantAttempt> {
  return getOne(
    getParticipantAttemptEndpoint(sessionKey, participantKey),
    "Get participant attempt",
  );
}

export function listParticipantProctorEvents(
  sessionKey: string,
  participantKey: string,
): Promise<ProctorEventItem[]> {
  return listAll(
    getParticipantProctorEventsEndpoint(sessionKey, participantKey),
    "List participant proctor events",
  );
}

export interface ProctorEventAck {
  appsheet_key: string;
  participant_key: string;
  type: ProctorEventType;
  occurred_at: string | null;
}

/**
 * Report one integrity signal. Unauthenticated like answers and heartbeat —
 * the participant_key returned by join is the identity.
 *
 * Callers should treat this as fire-and-forget: a failed proctor post must
 * never interrupt a student mid-exam.
 */
export function recordProctorEvent(
  sessionKey: string,
  participantKey: string,
  body: {
    type: ProctorEventType;
    payload?: Record<string, unknown>;
  },
): Promise<ProctorEventAck> {
  return sendOne(
    getParticipantProctorEventsEndpoint(sessionKey, participantKey),
    "POST",
    body,
    "Record proctor event",
  );
}

/**
 * How a session's attempts are ordered.
 *
 * `score_desc` is the default — a leaderboard, which is where marking a room
 * starts. The timestamp options sort on when the attempt was SUBMITTED, and one
 * never submitted sorts last in both directions: null means still working or walked away, not "earliest".
 */
export type AttemptOrder =
  | "score_desc"
  | "score_asc"
  | "timestamp_asc"
  | "timestamp_desc";

export function getLiveSessionResults(
  sessionKey: string,
  order?: AttemptOrder,
  cohortKey?: string | null,
): Promise<LiveSessionResults> {
  const url = new URL(getLiveSessionResultsEndpoint(sessionKey));
  if (order) url.searchParams.set("order", order);
  // Narrows the roster only; the room's statistics stay whole.
  if (cohortKey) url.searchParams.set("cohort_key", cohortKey);
  return getOne(url.toString(), "Get session results");
}

/** A finished run's results as last stored, with whether a recompute is owed
 * (`updating`, about 30 s after a mark). */
export type StoredRunResults = LiveSessionResults & { updating?: boolean };

/**
 * One run's stored results, the read that carries its split by skill and by
 * part (the live `/results` sends none). `null` while nothing is stored: a run
 * still going, or one nobody has finished.
 */
export async function getStoredRunResults(sessionKey: string): Promise<StoredRunResults | null> {
  const url = new URL(getStoredRunResultsEndpoint());
  url.searchParams.set("live_session_key", sessionKey);
  const [stored] = await listAll<StoredRunResults>(url.toString(), "Get stored session results");
  return stored ?? null;
}

// --- Cohorts, sign-up lists, results groups ---------------------------------
/**
 * The cohorts a person joining the run may pick (its public ones), searched
 * by `name` on the server one cursor page at a time; a run can hold hundreds.
 * The run's `/inline` list, which needs no scope.
 */
export function searchPublicCohorts(sessionKey: string, name: string): FetchCursorPage<InlineOption> {
  return (size, cursor) =>
    listPage<InlineOption>(
      `${getLiveSessionCohortsEndpoint(sessionKey)}/inline`,
      "Search groups",
      { q: name.trim() || undefined },
      { pageSize: size, cursor },
    );
}

/** Whether a run has any cohort a person joining it may pick. */
export async function hasPublicCohorts(sessionKey: string): Promise<boolean> {
  const first = await listPage<InlineOption>(
    `${getLiveSessionCohortsEndpoint(sessionKey)}/inline`,
    "Look for groups",
    {},
    { pageSize: 1, cursor: null },
  );
  return first.items.length > 0;
}

/** An `/inline` picker's entry. */
export interface InlineOption {
  value: string;
  name: string;
}

/** A named group of people sitting one test, reused across its runs. */
export interface Cohort {
  appsheet_key: string;
  test_key: string;
  name: string;
  info: Record<string, unknown> | null;
  created_at: string | null;
  edited_at: string | null;
}

/** One cohort linked to one run, with how many of its attempts are in it. */
export interface SessionCohort {
  appsheet_key: string;
  live_session_key: string;
  cohort_key: string;
  cohort_name: string;
  /** Whether a guest may pick it at join. */
  public: boolean;
  attempt_count: number;
  /** The link's, for the PATCH that flips `public`. */
  edited_at: string | null;
}

/** One attempt on a run's roster (`GET /v2/live-sessions/{key}/participants`). */
export interface SessionAttempt {
  appsheet_key: string;
  /** The account that sat it; null only on legacy rows. */
  user_key: string | null;
  /** Which attempt at the run this is, 1-based. */
  attempt_no: number;
  joined_at: string | null;
  started_at: string | null;
}

/** Every attempt at a run, every page of the roster. */
export function listSessionAttempts(sessionKey: string): Promise<SessionAttempt[]> {
  return listAllPages(`${getLiveSessionEndpoint(sessionKey)}/participants`, "List attempts");
}

/** One person expected at a run. */
export interface SignUp {
  appsheet_key: string;
  live_session_key: string;
  name: string;
  email: string;
  phone: string | null;
  user_key: string | null;
  /** Their first sign-in; a second person on one address does not move it. */
  first_signed_in_at: string | null;
  created_at: string | null;
  edited_at: string | null;
}

export interface SignUpEntry {
  name: string;
  email: string;
  phone?: string | null;
}

/** Several runs of one test read as one set of results. */
export interface ResultsGroup {
  appsheet_key: string;
  test_key: string;
  name: string;
  retake_scoring: RetakeScoring;
  info: Record<string, unknown> | null;
  session_count: number;
  created_at: string | null;
  edited_at: string | null;
}

export interface ResultsGroupDetail extends ResultsGroup {
  sessions: LiveSession[];
}

/** A results group's combined results: a run's body over all its sessions. */
export type ResultsGroupResults = Omit<LiveSessionResults, "live_session_key" | "status"> & {
  results_group_key: string;
  live_session_keys: string[];
};

export function listCohorts(testKey: string): Promise<Cohort[]> {
  return listAllPages(getTestCohortsEndpoint(testKey), "List cohorts");
}

export function createCohort(testKey: string, name: string): Promise<Cohort> {
  return sendOne(getTestCohortsEndpoint(testKey), "POST", { name }, "Create cohort");
}

export function patchCohort(
  testKey: string,
  cohortKey: string,
  body: { edited_at: string | null; name?: string },
): Promise<Cohort> {
  return sendOne(getTestCohortEndpoint(testKey, cohortKey), "PATCH", body, "Rename cohort");
}

export async function deleteCohort(testKey: string, cohortKey: string): Promise<void> {
  await requestJson(
    getTestCohortEndpoint(testKey, cohortKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Delete cohort",
  );
}

export function listSessionCohorts(sessionKey: string): Promise<SessionCohort[]> {
  return listAllPages(getLiveSessionCohortsEndpoint(sessionKey), "List the run's cohorts");
}

/** Link one cohort to a run; 409 when it is already linked. */
export function linkSessionCohort(
  sessionKey: string,
  cohortKey: string,
  isPublic: boolean,
): Promise<SessionCohort> {
  return sendOne(
    getLiveSessionCohortsEndpoint(sessionKey),
    "POST",
    { cohort_key: cohortKey, public: isPublic },
    "Link cohort",
  );
}

/** Change whether guests may pick a linked cohort at join. */
export function patchSessionCohort(
  sessionKey: string,
  cohortKey: string,
  body: { edited_at: string | null; public: boolean },
): Promise<SessionCohort> {
  return sendOne(
    getLiveSessionCohortEndpoint(sessionKey, cohortKey),
    "PATCH",
    body,
    "Change cohort",
  );
}

export async function unlinkSessionCohort(sessionKey: string, cohortKey: string): Promise<void> {
  await requestJson(
    getLiveSessionCohortEndpoint(sessionKey, cohortKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Unlink cohort",
  );
}

/**
 * Put one attempt in another of the run's cohorts, or in none (`null`). The
 * results rows carry no `edited_at`, so the roster is read first for the one
 * the PATCH needs.
 */
export async function moveParticipant(
  sessionKey: string,
  participantKey: string,
  cohortKey: string | null,
): Promise<unknown> {
  const roster = await listAll<{ appsheet_key: string; edited_at: string | null }>(
    `${getLiveSessionEndpoint(sessionKey)}/participants`,
    "Read the roster",
  );
  const row = roster.find((p) => p.appsheet_key === participantKey);
  return sendOne(
    getLiveSessionParticipantEndpoint(sessionKey, participantKey),
    "PATCH",
    { edited_at: row?.edited_at ?? null, cohort_key: cohortKey },
    "Move attempt",
  );
}

export function listSignUps(sessionKey: string): Promise<SignUp[]> {
  return listAllPages(getLiveSessionSignUpsEndpoint(sessionKey), "List sign-ups");
}

/** Add one person to a run's list; 409 when their email is already on it. */
export function addSignUp(sessionKey: string, entry: SignUpEntry): Promise<SignUp> {
  return sendOne(getLiveSessionSignUpsEndpoint(sessionKey), "POST", entry, "Add sign-up");
}

/** Fix one person on a run's sign-up list; `phone: null` removes it. */
export function patchSignUp(
  sessionKey: string,
  signUpKey: string,
  body: { edited_at: string | null; name?: string; email?: string; phone?: string | null },
): Promise<SignUp> {
  return sendOne(getLiveSessionSignUpEndpoint(sessionKey, signUpKey), "PATCH", body, "Edit sign-up");
}

export async function deleteSignUp(sessionKey: string, signUpKey: string): Promise<void> {
  await requestJson(
    getLiveSessionSignUpEndpoint(sessionKey, signUpKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Remove sign-up",
  );
}

export function listResultsGroups(testKey: string): Promise<ResultsGroup[]> {
  return listAllPages(getResultsGroupsEndpoint(testKey), "List results groups");
}

export function createResultsGroup(
  testKey: string,
  body: { name: string; retake_scoring: RetakeScoring },
): Promise<ResultsGroup> {
  return sendOne(getResultsGroupsEndpoint(testKey), "POST", body, "Create results group");
}

export function getResultsGroup(testKey: string, groupKey: string): Promise<ResultsGroupDetail> {
  return getOne(getResultsGroupEndpoint(testKey, groupKey), "Get results group");
}

export function patchResultsGroup(
  testKey: string,
  groupKey: string,
  body: { edited_at: string | null; name?: string; retake_scoring?: RetakeScoring },
): Promise<ResultsGroup> {
  return sendOne(getResultsGroupEndpoint(testKey, groupKey), "PATCH", body, "Edit results group");
}

export async function deleteResultsGroup(testKey: string, groupKey: string): Promise<void> {
  await requestJson(
    getResultsGroupEndpoint(testKey, groupKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Delete results group",
  );
}

export function getResultsGroupResults(
  testKey: string,
  groupKey: string,
  order?: AttemptOrder,
  cohortKey?: string | null,
): Promise<ResultsGroupResults> {
  const url = new URL(getResultsGroupResultsEndpoint(testKey, groupKey));
  if (order) url.searchParams.set("order", order);
  if (cohortKey) url.searchParams.set("cohort_key", cohortKey);
  return getOne(url.toString(), "Get results group results");
}

// --- Listening recordings ---------------------------------------------------
/** What a recording plays over; the owner IS the placement. */
export type RecordingOwnerKind = "test" | "collection" | "exercise";

/** Where a recording's file is (the API's `MediaRef`). */
export interface MediaRef {
  provider: "gcs";
  /** `tmp/recordings/…` until a recording claims it, then `recordings/…`. */
  key: string;
  content_type: AudioContentType;
  size_bytes?: number | null;
  /** The play window's length, 0 < d ≤ 3600. */
  duration_s: number;
}

/** A recording as its authors see it — file and transcript included. */
export interface ListeningRecording {
  appsheet_key: string;
  edited_at: string | null;
  created_at: string | null;
  owner_kind: RecordingOwnerKind;
  owner_key: string;
  title: string;
  media: MediaRef;
  transcript: string | null;
  order: number;
}

/** A recording on a test's paper, with the link keys it covers in paper order. */
export interface PaperRecording extends ListeningRecording {
  covers: string[];
}

/** The runner's student-safe view of a recording on its paper. */
export interface SessionRecording {
  recording_key: string;
  title: string;
  duration_s: number;
  owner_kind: RecordingOwnerKind;
  covers: string[];
}

export interface CreateRecordingBody {
  owner_kind: RecordingOwnerKind;
  owner_key: string;
  title: string;
  media: MediaRef;
  transcript?: string | null;
  order?: number;
}

/** Only the fields present are written; a null transcript clears it. */
export interface PatchRecordingBody {
  edited_at: string;
  title?: string;
  media?: MediaRef;
  transcript?: string | null;
  order?: number;
}

/** A signed PUT for one file under the bucket's `tmp/`, valid for 15 minutes. */
export interface MediaUploadTicket {
  key: string;
  upload_url: string;
  method: "PUT";
  /** Send exactly these; the signature covers them. */
  headers: Record<string, string>;
  expires_at: string;
}

/** A signed read of a recording. */
export interface SignedMediaUrl {
  url: string;
  expires_at: string;
}

/** A student's URL for one recording, with the window it is valid in. */
export interface RecordingUrl {
  recording_key: string;
  url: string;
  started_at: string;
  ends_at: string;
  /** The server's clock when it signed, so the player can seek without a skew. */
  server_now: string;
}

/** A window a participant can see: the room's (`room`) or their own. */
export interface ParticipantRecordingWindow extends RecordingWindow {
  room: boolean;
}

export function requestRecordingUploadUrl(body: {
  content_type: AudioContentType;
  size_bytes: number;
}): Promise<MediaUploadTicket> {
  return sendOne(getRecordingUploadUrlEndpoint(), "POST", body, "Prepare upload");
}

/**
 * Upload one recording file: ask for a ticket, then PUT the file to the bucket.
 *
 * The PUT is an XMLHttpRequest, not `fetchWithRefresh` — fetch reports no upload
 * progress, and the signed URL must not carry our Authorization header (the
 * bucket would reject a request signed two ways). Returns the `tmp/` key, which
 * `createRecording` or a `media` patch then claims.
 */
export async function uploadRecordingFile(
  file: File,
  contentType: AudioContentType,
  t: Translate,
  onProgress?: (fraction: number) => void,
): Promise<{ key: string }> {
  const ticket = await requestRecordingUploadUrl({
    content_type: contentType,
    size_bytes: file.size,
  });
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(ticket.method, ticket.upload_url);
    for (const [name, value] of Object.entries(ticket.headers)) {
      xhr.setRequestHeader(name, value);
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else {
        reject(
          new ApiError({
            context: "Upload file",
            status: xhr.status,
            statusText: xhr.statusText,
            url: ticket.upload_url,
            detail: t("exercise.import.media.uploadFailed", "Couldn’t upload the file (error {status}). Try again.", {
              status: xhr.status,
            }),
          }),
        );
      }
    };
    xhr.onerror = () =>
      reject(new Error(t("exercise.import.media.uploadDropped", "Couldn’t upload the file: the connection dropped. Try again.")));
    xhr.send(file);
  });
  return { key: ticket.key };
}

/** 201; `media.key` must be a fresh `tmp/` upload. */
export function createRecording(body: CreateRecordingBody): Promise<ListeningRecording> {
  return sendOne(getEndpoint("recordings"), "POST", body, "Add recording");
}

/** A stale `edited_at` is a 409. */
export function patchRecording(
  recordingKey: string,
  body: PatchRecordingBody,
): Promise<ListeningRecording> {
  return sendOne(getRecordingEndpoint(recordingKey), "PATCH", body, "Save recording");
}

export async function deleteRecording(recordingKey: string): Promise<void> {
  await requestJson(
    getRecordingEndpoint(recordingKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Delete recording",
  );
}

/** One owner's own recordings, by `order`. Not paginated. */
export function listOwnerRecordings(
  ownerKind: RecordingOwnerKind,
  ownerKey: string,
): Promise<ListeningRecording[]> {
  const url = new URL(getEndpoint("recordings"));
  url.searchParams.set("owner_kind", ownerKind);
  url.searchParams.set("owner_key", ownerKey);
  return listAll(url.toString(), "List recordings");
}

/** Everything that plays on a test's paper, in paper order. Not paginated. */
export function listTestRecordings(testKey: string): Promise<PaperRecording[]> {
  return listAll(getTestRecordingsEndpoint(testKey), "List the paper's recordings");
}

/** The teacher's unrestricted 15-minute read of a recording. */
export function getRecordingMediaUrl(recordingKey: string): Promise<SignedMediaUrl> {
  return getOne(getRecordingMediaUrlEndpoint(recordingKey), "Get recording");
}

/** A run's recordings, student-safe. 403 in the lobby, as the paper is. */
export function listSessionRecordings(sessionKey: string): Promise<SessionRecording[]> {
  return listAll(getLiveSessionRecordingsEndpoint(sessionKey), "List recordings");
}

export function startRoomRecording(
  sessionKey: string,
  recordingKey: string,
): Promise<RecordingWindow> {
  return sendOne(
    getRoomRecordingEndpoint(sessionKey, recordingKey, "start"),
    "POST",
    {},
    "Play recording",
  );
}

export function stopRoomRecording(
  sessionKey: string,
  recordingKey: string,
): Promise<RecordingWindow> {
  return sendOne(
    getRoomRecordingEndpoint(sessionKey, recordingKey, "stop"),
    "POST",
    {},
    "Stop recording",
  );
}

/**
 * A student's URL for one recording. 409 when there is none to give: on a class
 * run the teacher has not played it or it has finished; on a share room it has
 * already been played. On a share room the first call IS the play.
 */
export function requestRecordingUrl(
  sessionKey: string,
  participantKey: string,
  recordingKey: string,
): Promise<RecordingUrl> {
  return sendOne(
    getParticipantRecordingUrlEndpoint(sessionKey, participantKey),
    "POST",
    { recording_key: recordingKey },
    "Get recording",
  );
}

/** A signed PUT for a speaking recording; send `content_type` exactly. */
export interface RecordingUploadSlot {
  object: string;
  upload_url: string;
  expires_at: string;
}

/**
 * Ask for somewhere to put a speaking answer before recording it. Refused once
 * the attempt can't be written, which is what holds a take to the deadline.
 * `maxBytes` caps the upload, since the size isn't known yet.
 */
export function requestSpeakingUploadUrl(
  sessionKey: string,
  participantKey: string,
  testExerciseKey: string,
  contentType: string,
  maxBytes: number,
): Promise<RecordingUploadSlot> {
  return sendOne(
    getParticipantRecordingUploadUrlEndpoint(sessionKey, participantKey),
    "POST",
    { exercise_key: testExerciseKey, content_type: contentType, size: maxBytes },
    "Prepare recording",
  );
}

/**
 * Upload a finished take to its slot and hand it in as the answer. Resolves to
 * the submission file, whose key is the stored answer.
 */
export async function handInSpeakingRecording(
  sessionKey: string,
  participantKey: string,
  testExerciseKey: string,
  slot: RecordingUploadSlot,
  recording: Blob,
  contentType: string,
  maxBytes: number,
): Promise<SubmissionFile> {
  // Plain fetch: the signed URL must not carry our Authorization header.
  const put = await fetch(slot.upload_url, {
    method: "PUT",
    headers: { "Content-Type": contentType, "x-goog-content-length-range": `0,${maxBytes}` },
    body: recording,
  });
  if (!put.ok) {
    throw new ApiError({
      context: "Upload recording",
      status: put.status,
      statusText: put.statusText,
      url: slot.upload_url,
      detail: null,
    });
  }
  return sendOne(
    getParticipantRecordingsEndpoint(sessionKey, participantKey),
    "POST",
    { exercise_key: testExerciseKey, object: slot.object },
    "Hand in recording",
  );
}

export function listRecordingWindows(
  sessionKey: string,
  participantKey: string,
): Promise<ParticipantRecordingWindow[]> {
  return listAll(
    getParticipantRecordingWindowsEndpoint(sessionKey, participantKey),
    "List recording windows",
  );
}

// --- AI extraction ----------------------------------------------------------
// POST /v2/exercises/extract returns drafts, not saved rows: the shape is an
// ExercisePostRequest body minus the server-owned fields, so a kept draft goes
// back to POST /v2/exercises unchanged. The API validates each one against the
// exercise registry before returning it and drops whatever fails, so a short
// list (or an empty one) is a normal result rather than an error.
export interface ExtractedExercise {
  type: QuestionType;
  skill: SkillTag;
  title: string | null;
  instruction: string | null;
  // A decimal, like `AuthoredExercise.points`.
  points: string | number | null;
  content: Record<string, unknown>;
  answer_key?: Record<string, unknown> | null;
  // Local ref into the detected collections — nothing is persisted yet.
  collection_ref: string | null;
  collection_order: number | null;
}

export interface ExtractedCollection {
  ref: string;
  parent_ref: string | null;
  kind: CollectionKind;
  title: string | null;
  instruction: string | null;
  passage_title: string | null;
  passage: string[] | null;
  // Display extras (layout, word_bank) — filled from the section extract, since
  // the bank and passage only come back once a section is extracted.
  info: CollectionInfo | null;
  // A speaking topic pool's prompts, from the section extract.
  prompts?: string[] | null;
  // A part's timers on the test it is added to, as typed in the review.
  timers?: { limitMinutes: string; prepMinutes: string };
  position: number | null;
}

export interface ExtractSource {
  /** Base64 PDF or image. Requires `mime_type`. */
  data?: string;
  mime_type?: string;
  /** Pasted worksheet text. This or `data` is required; both may be sent (a scan and its key). */
  text?: string;
  /**
   * The teacher's own instruction for this import ("answers are on the last
   * page"). Unlike the paper, the model follows it. Sent on every call.
   */
  note?: string;
  max_exercises?: number;
}

// --- Two-step extraction ----------------------------------------------------
// Detect returns the skeleton (parts and their sections, with refs); a question
// printed on its own comes back as a one-question section. The client then
// extracts each section in its own short request, echoing the spec back. Each
// request is one model call — short enough to clear the edge timeout that a
// whole-paper extraction would exceed.

export interface DetectedSectionSpec {
  ref: string;
  parent_ref: string;
  instruction: string;
  question_type: QuestionType;
  skill: SkillTag;
  passage_title: string;
  passage_excerpt: string;
  // The one lettered pool the run draws from (removed paragraphs, jumbled
  // pieces, matching labels, a word box). Echoed back to /extract/section,
  // which reads the options / word bank from it — dropping it here would
  // silently strip it from the round trip.
  choices_excerpt: string;
  questions_excerpt: string;
  question_count: number;
  // Marks for ONE question in the run, not the run's total. Like
  // `choices_excerpt` this is echoed back to /extract/section verbatim, and
  // that call is what stamps the value onto every question it returns — so a
  // spec built here without it imports the whole run at 1 mark however the
  // paper was weighted. A decimal string from the API; a number once the
  // teacher edits it, which the API accepts as well.
  points: string | number;
  // Presentation family for a run whose per-item type doesn't tell the whole
  // story (gapped-text / multiple-matching → mcq; word-formation →
  // gap-filling). "" for a plain section. Carried into the collection's info.
  layout: string;
}

export interface DetectedPartSpec {
  ref: string;
  title: string;
  instruction: string;
  passage_title: string;
  passage_excerpt: string;
  sections: DetectedSectionSpec[];
}

export interface DetectStructure {
  parts: DetectedPartSpec[];
}

export interface SectionExtract {
  ref: string;
  parent_ref: string;
  passage: string[] | null;
  // { layout?, word_bank? } for the section's collection; null for a plain run.
  info: CollectionInfo | null;
  // A speaking topic pool's prompts, for the collection's `prompts`; its one
  // question is then the placeholder every attempt answers. Absent otherwise.
  prompts?: string[] | null;
  exercises: ExtractedExercise[];
}

export async function detectStructure(
  source: ExtractSource,
  signal?: AbortSignal,
): Promise<DetectStructure> {
  const data = await requestJson(
    getExtractDetectEndpoint(),
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(source), signal },
    "Detect exercise structure",
  );
  const result = getSingleObjectPayload<DetectStructure>(data);
  if (!result) throw new Error("Detect exercise structure: empty response");
  return result;
}

export async function extractSection(
  source: ExtractSource,
  section: DetectedSectionSpec,
  signal?: AbortSignal,
): Promise<SectionExtract> {
  const data = await requestJson(
    getExtractSectionEndpoint(),
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...source, section }),
      signal,
    },
    "Extract section",
  );
  const result = getSingleObjectPayload<SectionExtract>(data);
  if (!result) throw new Error("Extract section: empty response");
  return result;
}

// --- Collections ------------------------------------------------------------
// A part/section container over exercises. Collections group and display; they
// never grade. Linking one to a test moves the whole group in one call.
export interface CreateCollectionBody {
  kind: CollectionKind;
  parent_key?: string;
  title?: string;
  instruction?: string;
  passage_title?: string;
  passage?: string[];
  info?: CollectionInfo;
  // A speaking topic pool's prompts; each attempt is given one.
  prompts?: string[];
  position?: number;
  source?: string;
  // The library scope. Send at most one — a class inherits from its group, so
  // naming both is two tuples for one reach. Omitting both leaves the part
  // readable by its author alone.
  group_key?: string;
  class_key?: string;
}

export function createCollection(body: CreateCollectionBody): Promise<Collection> {
  return sendOne(getEndpoint("collections"), "POST", body, "Create collection");
}

/**
 * One page of the parts library (see the pagination note in CLAUDE.md).
 *
 * `kind: "part"` is the useful call: sections are reached through the part they
 * hang under, and listing them alongside puts a passage's sections next to the
 * passage as if they were siblings.
 */
export function listCollectionsPage(
  params: { kind?: CollectionKind; search?: string },
  page: PageRequest,
): Promise<CursorPaginatedResult<Collection>> {
  return listPage<Collection>(
    getEndpoint("collections"),
    "List collections",
    {
      kind: params.kind,
      // Trimmed to undefined rather than sent empty: `?search=` is a filter for
      // titles containing nothing, and it would also change the cursor
      // fingerprint against an unfiltered first page.
      search: params.search?.trim() || undefined,
    },
    page,
  );
}

/**
 * One collection in full. The stub the API embeds on an exercise carries the
 * text but NOT `edited_at`, and `PATCH /v2/collections/{id}` requires it for
 * optimistic concurrency — so a screen that renames a part/section has to read
 * it first, from here.
 */
export function getCollection(collectionKey: string): Promise<CollectionDetail> {
  return getOne(getCollectionEndpoint(collectionKey), "Get collection");
}

/**
 * Rename/retext a part or section. `edited_at` is required (the server refuses a
 * stale one rather than overwriting someone else's edit), which is why this
 * takes the value read back from `getCollection` rather than the embedded stub.
 *
 * `info` REPLACES the whole blob — a section's `layout` and `word_bank`
 * included. Send the complete object
 * (lib/collection-info.ts builds it), or `null` to clear it.
 */
export interface UpdateCollectionBody {
  edited_at: string | null;
  parent_key?: string | null;
  title?: string | null;
  instruction?: string | null;
  passage_title?: string | null;
  passage?: string[] | null;
  info?: CollectionInfo | null;
  // A speaking topic pool's prompts, replaced whole; null clears them.
  prompts?: string[] | null;
  position?: number | null;
  // Re-scoping. An explicit `null` clears the grant and puts the part back to
  // author-only; omitting the field leaves the current scope alone.
  group_key?: string | null;
  class_key?: string | null;
}

export function patchCollection(
  collectionKey: string,
  body: UpdateCollectionBody,
): Promise<Collection> {
  return sendOne(
    getCollectionEndpoint(collectionKey),
    "PATCH",
    body,
    "Patch collection",
  );
}

/**
 * Link a collection to a test as one unit: the API writes the structural row
 * plus a test_exercise row per descendant question atomically. 409 when a
 * member question is already linked standalone.
 */
/** A part's own timers on a test, in seconds; preparation only with a time limit. */
export interface PartTimers {
  time_limit_seconds?: number;
  preparation_seconds?: number;
}

export function linkCollectionToTest(
  testKey: string,
  collectionKey: string,
  timers: PartTimers = {},
  order?: number,
): Promise<TestCollectionLink> {
  return sendOne(
    getTestCollectionEndpoint(testKey, collectionKey),
    "POST",
    // `order` is the part's place on the paper; the others make room. Omitted
    // is the end.
    order === undefined ? timers : { ...timers, order },
    "Link collection to test",
  );
}

/** A part on one test (api `TestCollectionResponse`). */
export interface TestCollectionLink {
  appsheet_key: string;
  edited_at: string | null;
  test_key: string;
  collection_key: string;
  order: number;
  time_limit_seconds?: number | null;
  preparation_seconds?: number | null;
}

/**
 * Move a part on a test's paper (`order`, its 0-based place; the other parts
 * make room) or change its timers. `edited_at` is the part link's, as each
 * paper question carries it.
 */
export function patchTestCollection(
  testKey: string,
  collectionKey: string,
  body: {
    edited_at: string | null;
    order?: number;
    // null removes a timer.
    time_limit_seconds?: number | null;
    preparation_seconds?: number | null;
  },
): Promise<TestCollectionLink> {
  return sendOne(
    getTestCollectionEndpoint(testKey, collectionKey),
    "PATCH",
    body,
    "Move part",
  );
}

export async function unlinkCollectionFromTest(
  testKey: string,
  collectionKey: string,
): Promise<void> {
  await requestJson(
    getTestCollectionEndpoint(testKey, collectionKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Unlink collection from test",
  );
}

/**
 * Permanently delete a test (`DELETE /v2/tests/{id}`, 204).
 *
 * The database cascades its question and part links, its test sections and its
 * class-schedule links; the library questions and parts it used survive. Every
 * run of it goes too — class runs and public links, with each student's attempt
 * and answers — through the run key's cascade (api `scripts/050`).
 *
 * `deleteContent` also deletes the library questions and parts only this test
 * uses, whoever wrote them; anything another test uses stays.
 */
export async function deleteTest(
  testKey: string,
  deleteContent = false,
): Promise<void> {
  await requestJson(
    getTestEndpoint(testKey),
    {
      method: "DELETE",
      headers: JSON_HEADERS,
      body: JSON.stringify({ delete_content: deleteContent }),
    },
    "Delete test",
  );
}

/**
 * Delete a library part or section (`DELETE /v2/collections/{id}`, 204).
 *
 * Refused with a 409 naming the count while any test links it. Nothing inside
 * is destroyed: member questions stay in the library with no collection, and
 * child sections are left with no parent rather than deleted.
 */
export async function deleteCollection(collectionKey: string): Promise<void> {
  await requestJson(
    getCollectionEndpoint(collectionKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Delete collection",
  );
}

// --- Assessments ------------------------------------------------------------
// Compiling a run's results into the LMS's per-student report. The objects here
// all live in the `academics` schema, not `testing` — they predate the live
// platform and are what a parent actually reads.

/** One student's enrolment. `appsheet_key` is the registration key an
 *  assessment is written against; `student_key` is their user. */
export interface ClassRegistration {
  appsheet_key: string;
  student_key: string | null;
  student_name: string | null;
  student_id: string | null;
  class_name: string | null;
  status: string | null;
}

/** One student's assessment for one test. Scores/rank/percentile are derived by
 *  the API from its sections and are never posted. */
export interface Assessment {
  appsheet_key: string;
  edited_at: string | null;
  student_name: string | null;
  class_name: string | null;
  total_score: number | null;
  test_key: string | null;
  test_name: string | null;
}

export interface AssessmentSection {
  appsheet_key: string;
  assessment_key: string;
  section: string | null;
  score: number | null;
  feedback: string | null;
}

/**
 * Who is on the register for one class meeting.
 *
 * `session_key` filters through ATTENDANCE (the API joins registration →
 * attendance → session), so this is the students recorded as having sat that
 * lesson — not everyone enrolled in the class. That is the cohort an assessment
 * for the lesson should cover, and it is why a student who took the challenge
 * without an attendance row is reported as missing rather than silently given
 * an assessment against the wrong meeting.
 */
export function listSessionRegistrations(
  sessionKey: string,
): Promise<ClassRegistration[]> {
  return listAllPages<ClassRegistration>(
    getEndpoint("registrations"),
    "List session registrations",
    { session_key: sessionKey },
  );
}

/**
 * This student's existing assessments for this test — the "already compiled?"
 * check.
 *
 * Filtered by `student_key` server-side. That filter is the only way to do
 * this: the list response is a stub carrying `student_name` but neither
 * `registration_key` nor `student_key`, so a row cannot be matched back to a
 * student on the client, and matching on name would collide.
 */
export function listAssessmentsForStudent(
  testKey: string,
  studentKey: string,
): Promise<Assessment[]> {
  return listAllPages<Assessment>(
    getEndpoint("assessments"),
    "List assessments for student",
    { test_key: testKey, student_key: studentKey },
  );
}

/** Open an assessment shell. Its marks are added afterwards, one section per
 *  call — the API has no bulk path. */
export function createAssessment(body: {
  registration_key: string;
  test_key: string;
  class_key?: string | null;
}): Promise<Assessment> {
  return sendOne(getEndpoint("assessments"), "POST", body, "Create assessment");
}

export function createAssessmentSection(
  assessmentKey: string,
  body: { section: string; score: string },
): Promise<AssessmentSection> {
  return sendOne(
    getAssessmentSectionsEndpoint(assessmentKey),
    "POST",
    body,
    "Create assessment section",
  );
}

/** Withdraw an assessment. Used to roll a student back when a section write
 *  fails partway, so a retry starts from nothing rather than from half a
 *  report. */
export async function deleteAssessment(assessmentKey: string): Promise<void> {
  await requestJson(
    getAssessmentEndpoint(assessmentKey),
    { method: "DELETE", headers: JSON_HEADERS },
    "Delete assessment",
  );
}

// --- DTO → SPA node mapper ---------------------------------------------------
// The backend stores `skill` + a type-specific `content` JSONB; the SPA
// `ExerciseNode` uses `skillTag` and its own `id`. This rebuilds a node-shaped
// object; the caller validates it with `exerciseNodeSchema` where needed.
//
// The exact inverse of `nodeToExercisePost`: that splits the answer out of
// `content` into `answer_key`, so this folds it back in. The SPA node model
// keeps the answer inside `content` (see exercises.ts), which is what
// `isCorrectAnswer` and the teacher-facing renderers read.
//
// `answer_key` is present only on teacher-guarded responses; the student-safe
// endpoint omits it, and the node is then genuinely answer-less. Renderers must
// tolerate that rather than assume the answer is there.
type NodeSource = Pick<
  AuthoredExercise,
  "type" | "skill" | "title" | "instruction" | "points" | "content" | "answer_key" | "image_urls"
> & { appsheet_key: string };

/**
 * A draft as a renderable node. Extraction results have no key yet, so the
 * caller supplies a stable local id for React and the discard set.
 */
export function extractedExerciseToNode(
  dto: ExtractedExercise,
  id: string,
): Record<string, unknown> {
  return authoredExerciseToNode({ ...dto, appsheet_key: id });
}

export function authoredExerciseToNode(
  dto: NodeSource,
): Record<string, unknown> {
  return {
    id: dto.appsheet_key,
    type: dto.type,
    skillTag: dto.skill,
    title: dto.title ?? "",
    // `instruction` is a required string on the node (baseExerciseSchema), so a
    // null must become "", not undefined — a section's questions carry no
    // per-question instruction (the section's covers them), and left undefined
    // they'd fail the zod parse and be silently dropped from the review.
    instruction: dto.instruction ?? "",
    // The API sends a decimal string and the node model takes a number. Left
    // as a string, every question would fail the parse and drop silently. A
    // null is 0, as the API grades it; undefined would take the node schema's
    // default of 1 and show a mark the question is not worth.
    points: dto.points == null ? 0 : Number(dto.points),
    content: withImageUrls(mergeAnswerKey(dto.type, dto.content, dto.answer_key), dto.image_urls),
  };
}

/**
 * A session's exercises as the nodes the runner and the review render, in
 * screen order, each keyed by its LINK — `exercise_key` is what answers
 * are recorded against and what a result item names, so it is the node id.
 *
 * Shared by the runner and the review screen so both build nodes the same way;
 * two copies of "which key is the id" would be the kind of drift that shows a
 * verdict beside the wrong question.
 */
export function sessionExercisesToNodes(
  exercises: SessionExercise[],
): ExerciseNode[] {
  return exercises
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(
      (se) =>
        ({
          ...authoredExerciseToNode(se.exercise),
          id: se.exercise_key,
        }) as unknown as ExerciseNode,
    );
}

/** Fold `answer_key` back into `content`, undoing `nodeToExercisePost`. */
export function mergeAnswerKey(
  type: QuestionType,
  content: Record<string, unknown>,
  answerKey: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!answerKey) return content;
  switch (type) {
    // `select_count` and `case_sensitive` are folded in too, though no teacher
    // edits either: dropped here, they would be dropped again on save, so a
    // "choose N" import would lose its cap and an edit would wipe a
    // case-sensitive key.
    case "mcq":
    case "reading-full-test":
      return {
        ...content,
        correct_option_id: answerKey.correct_option_id,
        select_count: answerKey.select_count,
      };
    case "gap-filling":
    case "short-answer":
    case "rewriting":
      return {
        ...content,
        accepted_answers: answerKey.accepted_answers,
        case_sensitive: answerKey.case_sensitive,
        root: answerKey.root,
      };
    case "error-correction":
      return {
        ...content,
        error: answerKey.error,
        error_offset: answerKey.error_offset,
        accepted_answers: answerKey.accepted_answers,
        case_sensitive: answerKey.case_sensitive,
        partial_credit: answerKey.partial_credit,
      };
    case "true-false-not-given":
      return { ...content, answer: answerKey.answer };
    default:
      // An essay has no answer key.
      return content;
  }
}
