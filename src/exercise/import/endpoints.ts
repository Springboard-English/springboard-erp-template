/// <reference types="vite/client" />

// API configuration for the Springboard testing platform (Leap).
// The backend lives at api.springboard.vn — the same API the LMS talks to.
//
// Screens call the API through here + api_calls/fetchWithRefresh rather than
// adding ad-hoc URLs. The teacher/student flows are wired to real endpoints;
// AI extraction posts the worksheet to POST /v2/exercises/extract, which
// returns unsaved drafts for review.

import { PRODUCTION_API_BASE_URL, resolveApiBaseUrl } from "../../exports";

const API_BASE_URL = resolveApiBaseUrl(import.meta.env);

export const API_CONFIG = {
    baseURL: API_BASE_URL,
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

/**
 * Where in-app feedback surveys come from (src/lib/feedback.ts). `null` when
 * either value is unset, which keeps the feature off: no script, no requests.
 */
export const FORMBRICKS_CONFIG: { appUrl: string; workspaceId: string } | null =
    import.meta.env.VITE_FORMBRICKS_APP_URL && import.meta.env.VITE_FORMBRICKS_WORKSPACE_ID
        ? {
              appUrl: import.meta.env.VITE_FORMBRICKS_APP_URL,
              workspaceId: import.meta.env.VITE_FORMBRICKS_WORKSPACE_ID,
          }
        : null;

/** True when this build talks to the production API, so real surveys may fire. */
export const IS_PRODUCTION_API = API_BASE_URL === PRODUCTION_API_BASE_URL;

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

// Tests
export function getTestEndpoint(testKey: string): string {
    return `${getEndpoint("tests")}/${enc(testKey)}`;
}
// A test's ordered exercise links (GET list / POST link).
export function getTestExercisesEndpoint(testKey: string): string {
    return `${getTestEndpoint(testKey)}/exercises`;
}
export function getTestExerciseEndpoint(
    testKey: string,
    testExerciseKey: string,
): string {
    return `${getTestExercisesEndpoint(testKey)}/${enc(testExerciseKey)}`;
}
// Set the screen order of a test's exercises (PATCH; body lists every current
// link key in the desired order).
/** A class's timetabled sessions — what a run of the class's test is set in. */
export function getClassSessionsEndpoint(classKey: string): string {
    return `${getEndpoint("classes")}/${encodeURIComponent(classKey)}/sessions`;
}

// Assessments — one student's written result for one test (`test_feedback`).
export function getAssessmentEndpoint(assessmentKey: string): string {
    return `${getEndpoint("assessments")}/${enc(assessmentKey)}`;
}
/** Per-skill marks under an assessment. POSTed one at a time — the API has no
 *  bulk path, because each section needs its own OpenFGA parent tuple. */
export function getAssessmentSectionsEndpoint(assessmentKey: string): string {
    return `${getAssessmentEndpoint(assessmentKey)}/sections`;
}

// Exercise library
export function getExerciseEndpoint(exerciseKey: string): string {
    return `${getEndpoint("exercises")}/${enc(exerciseKey)}`;
}
// Collections (parts/sections grouping exercises)
export function getCollectionEndpoint(collectionKey: string): string {
    return `${getEndpoint("collections")}/${enc(collectionKey)}`;
}

/** Link/unlink a whole collection (part/section) to a test as one unit. */
export function getTestCollectionEndpoint(
    testKey: string,
    collectionKey: string,
): string {
    return `${getTestEndpoint(testKey)}/collections/${enc(collectionKey)}`;
}

// AI extraction is two steps so no single request outlives the edge proxy's
// ~100s timeout on a long paper: detect the structure once, then extract each
// section in its own short request (the client fans out).
export function getExtractDetectEndpoint(): string {
    return `${getEndpoint("exercises")}/extract/detect`;
}
export function getExtractSectionEndpoint(): string {
    return `${getEndpoint("exercises")}/extract/section`;
}

// Live sessions
export function getLiveSessionEndpoint(sessionKey: string): string {
    return `${getEndpoint("liveSessions")}/${enc(sessionKey)}`;
}
// A run's cohort links (GET / POST) and one link (DELETE, by cohort key).
export function getLiveSessionCohortsEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/cohorts`;
}
export function getLiveSessionCohortEndpoint(sessionKey: string, cohortKey: string): string {
    return `${getLiveSessionCohortsEndpoint(sessionKey)}/${enc(cohortKey)}`;
}
// A run's sign-up list (GET / bulk POST) and one person on it (PATCH / DELETE).
export function getLiveSessionSignUpsEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/sign-ups`;
}
export function getLiveSessionSignUpEndpoint(sessionKey: string, signUpKey: string): string {
    return `${getLiveSessionSignUpsEndpoint(sessionKey)}/${enc(signUpKey)}`;
}
// One attempt on a run's roster (PATCH moves it between cohorts).
export function getLiveSessionParticipantEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}`;
}

// A test's cohorts and results groups, nested under the test.
export function getTestCohortsEndpoint(testKey: string): string {
    return `${getTestEndpoint(testKey)}/cohorts`;
}
export function getTestCohortEndpoint(testKey: string, cohortKey: string): string {
    return `${getTestCohortsEndpoint(testKey)}/${enc(cohortKey)}`;
}
export function getResultsGroupsEndpoint(testKey: string): string {
    return `${getTestEndpoint(testKey)}/results-groups`;
}
export function getResultsGroupEndpoint(testKey: string, groupKey: string): string {
    return `${getResultsGroupsEndpoint(testKey)}/${enc(groupKey)}`;
}
export function getResultsGroupResultsEndpoint(testKey: string, groupKey: string): string {
    return `${getResultsGroupEndpoint(testKey, groupKey)}/results`;
}
export function getLiveSessionStartEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/start`;
}
export function getLiveSessionEndEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/end`;
}
export function getLiveSessionRegradeEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/regrade`;
}
// The owner's results view: participants + per-question accuracy in one read,
// and (unlike the student's own result) not gated by answer_visibility.
export function getLiveSessionResultsEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/results`;
}
// The stored results list (`?live_session_key=` for one run).
export function getStoredRunResultsEndpoint(): string {
    return getEndpoint("liveSessionResults");
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
export function getUserParticipantsEndpoint(userKey: string): string {
    return `${getEndpoint("users")}/${enc(userKey)}/participants`;
}
// The teacher's read of ONE participant's whole run: every question of the test,
// their answer, the key, and the risk breakdown. Requires `editor` on the
// session and is deliberately NOT subject to answer_visibility — unlike
// `/result` above, which is the student's own gated view and refuses the teacher
// too (permanently, for a test set to `never`).
export function getParticipantAttemptEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/attempt`;
}
// A teacher's mark on ONE answer. Under `/participants/{pid}/answers/{link}` to
// match the write path answers already use — the participant is in the PATH, not
// the body, so a session key plus a participant key is not enough to write into
// someone else's attempt.
export function getMarkAnswerEndpoint(
    sessionKey: string,
    participantKey: string,
    testExerciseKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/answers/${enc(testExerciseKey)}`;
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

// Listening recordings. The upload route is a literal sibling of
// `/{recording_key}`; the file itself is PUT straight to the signed URL it
// returns, never through the API.
export function getRecordingUploadUrlEndpoint(): string {
    return `${getEndpoint("recordings")}/upload-url`;
}
export function getRecordingEndpoint(recordingKey: string): string {
    return `${getEndpoint("recordings")}/${enc(recordingKey)}`;
}
// The teacher's unrestricted read of a recording (preview, marking).
export function getRecordingMediaUrlEndpoint(recordingKey: string): string {
    return `${getRecordingEndpoint(recordingKey)}/media-url`;
}
// Everything that plays on a test's paper, with the links each covers.
export function getTestRecordingsEndpoint(testKey: string): string {
    return `${getTestEndpoint(testKey)}/recordings`;
}
// The same list for a run, student-safe (no file, no transcript).
export function getLiveSessionRecordingsEndpoint(sessionKey: string): string {
    return `${getLiveSessionEndpoint(sessionKey)}/recordings`;
}
// The teacher opening (`start`) or closing (`stop`) a recording's window for
// the whole room of a class run.
export function getRoomRecordingEndpoint(
    sessionKey: string,
    recordingKey: string,
    action: "start" | "stop",
): string {
    return `${getLiveSessionRecordingsEndpoint(sessionKey)}/${enc(recordingKey)}/${action}`;
}
// A student's signed URL for one recording, valid only while its window is open.
export function getParticipantRecordingUrlEndpoint(
    sessionKey: string,
    participantKey: string,
): string {
    return `${getLiveSessionEndpoint(sessionKey)}/participants/${enc(participantKey)}/recording-url`;
}
// A class's coursework, which a run answered in files may hand in to.
export function getClassCourseworkEndpoint(classKey: string): string {
    return `${getEndpoint("classes")}/${enc(classKey)}/coursework`;
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
