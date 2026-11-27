// Leap's half of reading a failed response. The envelope readers, `ApiError`
// and `errorMessage` are the template's; what stays here is the error body's
// raw `detail` (a 409 `RegradeConflict` is an object the regrade dialog reads)
// and the one readable line Leap pulls out of it.

import { ApiError } from "../../exports";
/// <reference types="vite/client" />

// API configuration for the Springboard testing platform (Leap).
// The backend lives at api.springboard.vn — the same API the LMS talks to.
//
// Screens call the API through here + api_calls/fetchWithRefresh rather than
// adding ad-hoc URLs. The teacher/student flows are wired to real endpoints;
// AI extraction posts the worksheet to POST /v2/exercises/extract, which
// returns unsaved drafts for review.

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
import type { ExerciseNode,QuestionType,SkillTag } from "../lib/exercises";
import { withImageUrls } from "../lib/option-images";
import type { ExerciseAnswer } from "../lib/exercises";
import type { CollectionInfo, CollectionKind, CollectionLayout, CollectionStub, RecordingOwnerKind, SavedHighlight, SessionRecording } from "../types";

import { API_CONFIG as TEMPLATE_API_CONFIG } from "../../config/api";
import {
fetchWithRefresh,
getArrayPayload,
getSingleObjectPayload,
parseCursorPage,
type CursorPaginatedResult,
type FetchCursorPage
} from "../../exports";

/**
 * The template's `ApiError` plus the body's `detail` as sent, for an error
 * whose detail is an object rather than a sentence (`regradeConflictOf`).
 * It IS an `ApiError`, so `instanceof ApiError`, `status` and the template's
 * `errorMessage` treat it like any other.
 */
export class ApiErrorWithPayload extends ApiError {
  readonly payload: unknown;

  constructor(options: ConstructorParameters<typeof ApiError>[0] & { payload?: unknown }) {
    super(options);
    this.payload = options.payload;
  }
}

/** The raw `detail` of an error-response body, or undefined when it has none. */
export function parseErrorPayload(body: string): unknown {
  try {
    return (JSON.parse(body) as { detail?: unknown } | null)?.detail;
  } catch {
    return undefined;
  }
}

/**
 * The server's error explanation out of a raw error-response body. FastAPI
 * serialises `HTTPException` as `{"detail": ...}`: a string for the API's own
 * `BadRequestException` (the registry's validation messages), an object with a
 * `message` (a 409 `RegradeConflict`), or a list of `{loc, msg}` for 422
 * request-body validation. Returns a single readable line, or null when there
 * is nothing worth showing (an HTML proxy page), so the caller keeps its fallback.
 */
export function parseErrorDetail(body: string): string | null {
  const text = body.trim();
  if (!text) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    // A non-JSON error body (an HTML 502 from the proxy, say) is rarely worth
    // showing; only surface a short plain string.
    return text.length <= 200 && !text.startsWith("<") ? text : null;
  }
  const detail = (parsed as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail.trim() || null;
  // An object detail (a 409 `RegradeConflict`) says itself in `message`.
  const message = (detail as { message?: unknown } | null)?.message;
  if (typeof message === "string") return message.trim() || null;
  if (Array.isArray(detail)) {
    const lines = detail
      .map((entry) => {
        const e = entry as { loc?: unknown; msg?: unknown };
        if (typeof e?.msg !== "string") return null;
        const loc = Array.isArray(e.loc)
          ? e.loc.filter((part) => part !== "body").join(".")
          : "";
        return loc ? `${loc}: ${e.msg}` : e.msg;
      })
      .filter((line): line is string => Boolean(line));
    return lines.length ? lines.join("; ") : null;
  }
  return null;
}

/**
 * A failed response as an `ApiErrorWithPayload`: `action` is the call's own
 * wording ("Create exercise"), followed by the status and the server's reason.
 * Reads the body, so call it only once the response is known to be an error.
 */
export async function readApiError(response: Response, action: string): Promise<ApiErrorWithPayload> {
  let detail: string | null = null;
  let payload: unknown;
  try {
    const body = await response.text();
    detail = parseErrorDetail(body);
    payload = parseErrorPayload(body);
  } catch {
    // An unreadable body leaves the status line, which still says what failed.
  }
  return new ApiErrorWithPayload({
    context: action,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    detail,
    payload,
  });
}

// The run's endpoints, on the base URL the app gave `configureApi`.
export const API_CONFIG = {
    get baseURL() {
        return TEMPLATE_API_CONFIG.baseURL;
    },
    endpoints: {
        currentUser: "/v2/users/me",
        // Testing-platform collection endpoints (v2). Item/sub-resource URLs are
        // built with the helpers below rather than adding an entry per id.
        tests: "/v2/tests",
        exercises: "/v2/exercises",
        collections: "/v2/collections",
        liveSessions: "/v2/live-sessions",
        // Finished runs' results as the API's background recompute stored them,
        // the only read that carries a run's split by skill and by part.
        liveSessionResults: "/v2/live-session-results",
        // Listening recordings, owned by a test, collection or exercise.
        recordings: "/v2/recordings",
        // Creating a test requires the key its area implies (POST /v2/tests
        // takes {area, name} + group_key or class_key), so the create form
        // needs both lists. Groups 403 for a teacher — see `listGroups`.
        groups: "/v2/groups",
        classes: "/v2/classes",
        users: "/v2/users",
        // Compiling a run into LMS assessments (see lib/assessment-compile.ts).
        // The roster comes from the registrations on the class MEETING the
        // paper is linked to, not from the class as a whole.
        registrations: "/v2/registrations",
        assessments: "/v2/assessments",
    },
} as const;

export function getEndpoint(
    endpoint: keyof typeof API_CONFIG.endpoints,
): string {
    return `${API_CONFIG.baseURL}${API_CONFIG.endpoints[endpoint]}`;
}

// ---------------------------------------------------------------------------
// URL builders for item / sub-resource routes (mirrors the erp-template's
// getClassDetailsEndpoint / getClassTestsEndpoint helpers). Ids are
// path-encoded so callers can pass raw appsheet keys.
// ---------------------------------------------------------------------------
const enc = encodeURIComponent;

// Live sessions
export function getLiveSessionEndpoint(sessionKey: string): string {
    return `${getEndpoint("liveSessions")}/${enc(sessionKey)}`;
}
// A run's cohort links (GET / POST) and one link (DELETE, by cohort key).
export function getLiveSessionCohortsEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/cohorts`;
}
export function getLiveSessionJoinEndpoint(joinCode: string): string {
    return `${getEndpoint("liveSessions")}/join/${enc(joinCode)}`;
}
export function getParticipantFinishEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/finish`;
}
export function getParticipantResultEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/result`;
}
// A participant's OWN submitted answers, ungraded — the read that restores the
// runner after a refresh. Distinct from the `/result` route above, which carries
// correctness and is gated by answer_visibility.
export function getParticipantAnswersEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/answers`;
}
// The three participant-scoped writes, with the participant in the PATH; the
// API has no body-keyed form of them.
export function getParticipantAnswerSubmitEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/answers`;
}
export function getParticipantHeartbeatEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/heartbeat`;
}
// POST goes to the same path as the teacher's GET below, so
// `getParticipantProctorEventsEndpoint` serves both — one builder, one path.
// A user's participants — every session they joined. Lives under the user, not
// under live-sessions: the collection belongs to whoever sat the runs.
export function getMyParticipantsEndpoint(): string {
    return `${getEndpoint("users")}/me/participants`;
}
// The full integrity timeline behind a participant's risk score. The attempt
// response already carries a capped tail of it; this is for when it reports
// `truncated`.
export function getParticipantProctorEventsEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/proctor-events`;
}
// The same list for a run, student-safe (no file, no transcript).
export function getLiveSessionRecordingsEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/recordings`;
}
// A student's signed URL for one recording, valid only while its window is open.
export function getParticipantRecordingUrlEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/recording-url`;
}
// A signed upload for a speaking answer the caller is about to record.
export function getParticipantRecordingUploadUrlEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/recordings/upload-url`;
}
// Handing an uploaded speaking recording in as the answer.
export function getParticipantRecordingsEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/recordings`;
}
// A run's parts for one attempt, with each timed part's clock once opened.
export function getLiveSessionPartsEndpoint(sessionKey: string, participantKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/parts?participant_id=${enc(participantKey)}`;
}
// Opening a timed part, which starts its clock.
export function getParticipantPartOpenEndpoint(
    sessionKey: string,
    participantKey: string,
    partKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/parts/${enc(partKey)}/open`;
}
// Every window this participant can see (the room's and their own), to seed the
// player after a refresh.
export function getParticipantRecordingWindowsEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/recording-windows`;
}

// --- Enums that don't have a matching SPA schema ----------------------------
export type AnswerVisibility = "after-submit" | "after-close" | "never";
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

/** A student's URL for one recording, with the window it is valid in. */
export interface RecordingUrl {
  recording_key: string;
  url: string;
  started_at: string;
  ends_at: string;
  /** The server's clock when it signed, so the player can seek without a skew. */
  server_now: string;
  /** A released run's replay: no window, play and seek at will. Absent on an older API. */
  review?: boolean;
}

/** A window a participant can see: the room's (`room`) or their own. */
export interface RunRecordingWindow {
  recording_key: string;
  started_at: string;
  ends_at: string;
  stopped_at: string | null;
}

export interface ParticipantRecordingWindow extends RunRecordingWindow {
  room: boolean;
}

/** A run's recordings, student-safe. 403 in the lobby, as the paper is. */
export function listSessionRecordings(sessionKey: string): Promise<SessionRecording[]> {
  return listAll(getLiveSessionRecordingsEndpoint(sessionKey), "List recordings");
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

export type { CollectionInfo, CollectionKind, CollectionLayout, CollectionStub, ExerciseAnswer, RecordingOwnerKind, SavedHighlight, SessionRecording };
