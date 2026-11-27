// TanStack Query hooks over the testing-platform client (testing-platform.ts).
// Screens should consume these rather than calling fetch directly, matching how
// lms.springboard.vn drives its views. Query keys are centralised here so
// mutations can invalidate precisely.
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useState } from "react";
import { partIndexOf, partsToOpen, paperState } from "../index";
import { addQuestionToTest } from "./questions-part";

import { useCallback, useEffect, useRef } from "react";

import {
  pageSize as toBrandedPageSize,
  useAuth,
  useServerList,
  type ServerList,
  ApiError,
} from "../../exports";

import {
  liveQueryOptions,
  sessionPollMs,
} from "./live-refresh";
import { trackFeedback } from "../index";
import { FEEDBACK_ACTIONS } from "../index";
import { RegradeCancelled, regradeConflictOf } from "./regrade";
import { useRegradePrompt } from "./regrade-prompt";
import { useStableI18n } from "./i18n";
import { toast } from "sonner";

import {
  createCollection,
  createExercise,
  createLiveSession,
  createTest,
  endLiveSession,
  listClassSessions,
  listClassCoursework,
  listRunParts,
  openRunPart,
  type OpenedRunPart,
  type ExercisePatchBody,
  type RunPart,
  type SessionExercise,
  getCurrentUser,
  patchCurrentUserInfo,
  patchLiveSession,
  getCollection,
  listCollectionsPage,
  linkCollectionToTest,
  getExercise,
  deleteExercise,
  getLiveSession,
  getLiveSessionResults,
  getStoredRunResults,
  getParticipantAttempt,
  getParticipantResult,
  getTest,
  listClasses,
  listExercises,
  listExerciseTags,
  listGroups,
  listLiveSessions,
  listMyParticipants,
  listParticipantProctorEvents,
  listUserParticipants,
  readWholePaper,
  listSessionRegistrations,
  listTestExercises,
  listTests,
  listTestsPage,
  listTestTags,
  patchCollection,
  patchExercise,
  patchTest,
  markParticipantAnswer,
  patchTestExercise,
  regradeLiveSession,
  startLiveSession,
  startRoomRecording,
  stopRoomRecording,
  createRecording,
  patchRecording,
  deleteRecording,
  listOwnerRecordings,
  listTestRecordings,
  listSessionRecordings,
  getRecordingMediaUrl,
  type CreateRecordingBody,
  type ListeningRecording,
  type PatchRecordingBody,
  type RecordingOwnerKind,
  type RecordingWindow,
  type PartTimers,
  type TestCollectionLink,
  deleteCollection,
  deleteTest,
  addSignUp,
  createCohort,
  createResultsGroup,
  deleteCohort,
  deleteResultsGroup,
  deleteSignUp,
  patchSignUp,
  getResultsGroup,
  getResultsGroupResults,
  linkSessionCohort,
  patchSessionCohort,
  type SessionCohort,
  listCohorts,
  listResultsGroups,
  listSessionCohorts,
  listSessionAttempts,
  listSignUps,
  moveParticipant,
  patchCohort,
  patchResultsGroup,
  unlinkSessionCohort,
  type Cohort,
  type ResultsGroup,
  type RetakeScoring,
  type SignUp,
  type SignUpEntry,
  type AuthoredExercise,
  type AttemptOrder,
  type Collection,
  type CollectionKind,
  type CurrentUser,
  type CreateCollectionBody,
  type CreateExerciseBody,
  type CreateTestBody,
  type ListExercisesParams,
  type ListLiveSessionsParams,
  type ListTestsParams,
  type LiveSession,
  type LiveSessionAdmission,
  type LiveSessionDelivery,
  type LiveSessionStatus,
  type ParticipantResult,
  type RegradeChoice,
  type Test,
  type AttemptItem,
  type TestExerciseLink,
  type UpdateCollectionBody,
  type UpdateLiveSessionBody,
  type UpdateTestBody,
} from "./api";

// --- Query keys -------------------------------------------------------------
export const testingKeys = {
  tests: (params?: ListTestsParams) => ["tests", params ?? {}] as const,
  // The server-paged tables' keys sit under their list's prefix on purpose, so
  // every mutation that invalidates the list refetches the page on screen. The
  // trailing "pages" keeps them apart from the whole-list entries, and
  // `useCursorTable` appends the page size and cursor.
  testPages: (params: ListTestsParams) => ["tests", params, "pages"] as const,
  testTags: () => ["test-tags"] as const,
  exerciseTags: () => ["exercise-tags"] as const,
  test: (testKey: string) => ["test", testKey] as const,
  exercises: (params?: ListExercisesParams) =>
    ["exercises", params ?? {}] as const,
  exercisePages: (params: ExercisePageParams) =>
    ["exercises", params, "pages"] as const,
  exercise: (exerciseKey: string) => ["exercise", exerciseKey] as const,
  testsLinkingExercise: (exerciseKey: string) =>
    ["tests-linking-exercise", exerciseKey] as const,
  testExercises: (testKey: string) => ["test-exercises", testKey] as const,
  sessionRegistrations: (sessionKey: string) =>
    ["session-registrations", sessionKey] as const,
  collection: (collectionKey: string) => ["collection", collectionKey] as const,
  collectionPages: (params: ListCollectionsParams) =>
    ["collections", params, "pages"] as const,
  liveSessions: (params?: ListLiveSessionsParams) =>
    ["live-sessions", params ?? {}] as const,
  // `owner` is part of the key as well as `owner_key` in `params`: the cursor
  // trail is stored per key, so switching the filter restarts at page 1 rather
  // than replaying a cursor minted on the other list.
  liveSessionPages: (params: LiveSessionPageParams, owner: "mine" | "everyone") =>
    ["live-sessions", params, owner, "pages"] as const,
  liveSession: (sessionKey: string) => ["live-session", sessionKey] as const,
  // The attempt is part of the key: two attempts are two reads, and each stamps
  // its own attempt's start.
  sessionExercises: (sessionKey: string, participantKey?: string) =>
    ["session-exercises", sessionKey, participantKey ?? ""] as const,
  runParts: (sessionKey: string, participantKey: string) => ["run-parts", sessionKey, participantKey] as const,
  sessionResults: (sessionKey: string, order?: AttemptOrder, cohortKey?: string | null) =>
    ["session-results", sessionKey, order ?? "score_desc", cohortKey ?? ""] as const,
  storedRunResults: (sessionKey: string) => ["stored-run-results", sessionKey] as const,
  testCohorts: (testKey: string) => ["test-cohorts", testKey] as const,
  sessionCohorts: (sessionKey: string) => ["session-cohorts", sessionKey] as const,
  signUps: (sessionKey: string) => ["sign-ups", sessionKey] as const,
  sessionAttempts: (sessionKey: string) => ["session-attempts", sessionKey] as const,
  resultsGroups: (testKey: string) => ["results-groups", testKey] as const,
  resultsGroup: (testKey: string, groupKey: string) =>
    ["results-groups", testKey, groupKey] as const,
  resultsGroupResults: (
    groupKey: string,
    order?: AttemptOrder,
    cohortKey?: string | null,
  ) => ["results-group-results", groupKey, order ?? "score_desc", cohortKey ?? ""] as const,
  participantAttempt: (sessionKey: string, participantKey: string) =>
    ["participant-attempt", sessionKey, participantKey] as const,
  participantProctorEvents: (sessionKey: string, participantKey: string) =>
    ["participant-proctor-events", sessionKey, participantKey] as const,
  participantResult: (sessionKey: string, participantKey: string) =>
    ["participant-result", sessionKey, participantKey] as const,
  groups: () => ["groups"] as const,
  classes: () => ["classes"] as const,
  classSessions: (classKey: string) => ["class-sessions", classKey] as const,
  classCoursework: (classKey: string) => ["class-coursework", classKey] as const,
  participants: (userKey?: string) =>
    ["participants", userKey ?? "me"] as const,
  currentUser: () => ["current-user"] as const,
  // A paper's recordings sit under its exercises' key: what each covers moves
  // with every link, unlink and reorder, which already invalidate that key.
  testRecordings: (testKey: string) => ["test-exercises", testKey, "recordings"] as const,
  // Every other recording read sits under one prefix: a part's recording plays
  // on every test that links it, so an edit invalidates them all.
  recordings: () => ["recordings"] as const,
  ownerRecordings: (ownerKind: RecordingOwnerKind, ownerKey: string) =>
    ["recordings", "owner", ownerKind, ownerKey] as const,
  sessionRecordings: (sessionKey: string) =>
    ["recordings", "session", sessionKey] as const,
  recordingMediaUrl: (recordingKey: string) =>
    ["recording-media-url", recordingKey] as const,
};

// --- Reads ------------------------------------------------------------------
/**
 * The caller's own record, for the `info` state the app keeps there.
 *
 * `useAuth().user` is minted at sign-in and never refreshed, so it cannot answer
 * questions about `info` or carry a usable `edited_at`. This is the live read.
 *
 * `enabled` is the caller's, because the request 401s when nobody is signed in.
 */
export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: testingKeys.currentUser(),
    queryFn: () => getCurrentUser(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Merge keys into the caller's own `info`.
 *
 * `editedAt` is passed per-call rather than read from the cache: it is the
 * concurrency token, and a value the mutation dug up itself could already be a
 * refetch behind.
 */
export function usePatchCurrentUserInfo(
  options?: MutationExtras<
    CurrentUser,
    { editedAt: string; info: Record<string, unknown> }
  >,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ editedAt, info }) => patchCurrentUserInfo(editedAt, info),
    ...options,
    onSuccess: (user, ...rest) => {
      // The response is the patched record, so seed it rather than refetching.
      qc.setQueryData(testingKeys.currentUser(), user);
      options?.onSuccess?.(user, ...rest);
    },
  });
}

/** Every test, for the pickers. The library table pages with `useTestPages`. */
export function useTests(
  params: ListTestsParams = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: testingKeys.tests(params),
    queryFn: () => listTests(params),
    enabled,
  });
}

/**
 * These lists are paged on the SERVER by the template's `useServerList` (the
 * cursor trail, fingerprint and row count shared with the four ERP apps).
 *
 * Two of its defaults are not this app's, so every list below states them:
 * `keepPreviousPage` (the last page stays under the skeleton, so the footer
 * does not collapse to "No results" between two pages) and `mobile` (these are
 * teacher screens with no phone card list — leaving it on would mount a second,
 * pointless query).
 *
 * `isError` is kept for the screens, which read it; the hook hands back the
 * error object instead.
 */
function toCursorTable<T>(list: ServerList<T>) {
  return {
    rows: list.rows,
    isLoading: list.isLoading,
    isError: Boolean(list.error),
    tableProps: list.tableProps,
  };
}

/** The page size these tables open at. */
const LIBRARY_PAGE_SIZE = toBrandedPageSize(10);

/**
 * The test library, a page at a time on the server. `scope` is the screen's
 * sessionStorage scope, where its page is remembered.
 */
export function useTestPages(scope: string, params: ListTestsParams) {
  return toCursorTable(
    useServerList({
      scope,
      queryKey: testingKeys.testPages(params),
      fetchPage: (pageSize, cursor) => listTestsPage(params, { pageSize, cursor }),
      defaultPageSize: LIBRARY_PAGE_SIZE,
      keepPreviousPage: true,
      mobile: false,
    }),
  );
}

/**
 * The tags in use across tests, for the filter's dropdown. Its own query, not
 * derived from the loaded page: a tag on a test the current filter excludes
 * still has to be offerable, or the filter can only ever be narrowed.
 */
export function useTestTags() {
  return useQuery({
    queryKey: testingKeys.testTags(),
    queryFn: () => listTestTags(),
  });
}

export function useExerciseTags() {
  return useQuery({
    queryKey: testingKeys.exerciseTags(),
    queryFn: () => listExerciseTags(),
  });
}

export function useTest(testKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.test(testKey ?? ""),
    queryFn: () => getTest(testKey as string),
    enabled: Boolean(testKey),
  });
}


/** Who is on the register for one class meeting (attendance-scoped). */
export function useSessionRegistrations(
  sessionKey: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: testingKeys.sessionRegistrations(sessionKey ?? ""),
    queryFn: () => listSessionRegistrations(sessionKey as string),
    enabled: Boolean(sessionKey) && enabled,
    // `registrations_get` is on Leap's OIDC scope list (`config/oidc.ts`), but a
    // caller without the grant still gets 403. Retrying a scope refusal cannot
    // change the answer, and while it retries the query stays pending — which
    // leaves the compile dialog's Review button disabled with nothing on screen
    // to say why. Same reasoning as `useGroups`, whose 403 is also a normal
    // answer rather than a fault.
    retry: false,
  });
}

/**
 * A user's participants. Omit `userKey` for the signed-in user's own — the key
 * is part of the query key so one user's rows can't be served from another's
 * cache entry.
 */
export function useParticipants(userKey?: string, enabled = true) {
  return useQuery({
    queryKey: testingKeys.participants(userKey),
    queryFn: () =>
      userKey ? listUserParticipants(userKey) : listMyParticipants(),
    // The runner reads this only once the score is on screen, for the
    // sitting's own start and finish; hooks cannot be called conditionally.
    enabled,
  });
}

/**
 * Groups the caller can file a test under — the manager path.
 *
 * A classroom teacher gets a 403 here (no `groups_get` scope, no group
 * relation), and that is a normal answer rather than a failure: it means this
 * caller files tests under a class. `retry: false` so the form settles on that
 * answer immediately instead of spending three attempts on a fixed 403.
 */
export function useGroups() {
  return useQuery({
    queryKey: testingKeys.groups(),
    queryFn: () => listGroups(),
    // Group membership changes rarely and only outside Leap.
    staleTime: 5 * 60_000,
    retry: false,
  });
}

/** Classes the caller teaches — the teacher path for filing a test. */
export function useClasses() {
  return useQuery({
    queryKey: testingKeys.classes(),
    queryFn: () => listClasses(),
    staleTime: 5 * 60_000,
  });
}

/** A class's sessions — the choices for which one a run is set in. */
export function useClassSessions(classKey: string | null | undefined) {
  return useQuery({
    queryKey: testingKeys.classSessions(classKey ?? ""),
    queryFn: () => listClassSessions(classKey as string),
    enabled: Boolean(classKey),
    staleTime: 5 * 60_000,
  });
}

/** A class's coursework — the choices for which assignment a run hands in to. */
export function useClassCoursework(classKey: string | null | undefined, enabled = true) {
  return useQuery({
    queryKey: testingKeys.classCoursework(classKey ?? ""),
    queryFn: () => listClassCoursework(classKey as string),
    enabled: enabled && Boolean(classKey),
    staleTime: 60_000,
  });
}

export function useCreateTest(options?: MutationExtras<Test, CreateTestBody>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTestBody) => createTest(body),
    ...options,
    onSuccess: (...args) => {
      // The bare prefix, matching the `["exercises"]` / `["live-sessions"]`
      // pattern below: `testingKeys.tests()` is `["tests", {}]` because the
      // list takes filters, and that only matches the UNFILTERED entry.
      qc.invalidateQueries({ queryKey: ["tests"] });
      qc.invalidateQueries({ queryKey: testingKeys.testTags() });
      // Here rather than in each caller: both create paths (the dialog and AI
      // extract) are the same moment for a feedback survey.
      void trackFeedback(FEEDBACK_ACTIONS.testCreated, {
        role: "teacher",
        account_type: "employee",
        test_key: args[0].appsheet_key,
      });
      options?.onSuccess?.(...args);
    },
  });
}

export function usePatchTest(
  testKey: string,
  options?: MutationExtras<Test, UpdateTestBody>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateTestBody) => patchTest(testKey, body),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: testingKeys.test(testKey) });
      qc.invalidateQueries({ queryKey: ["tests"] });
      qc.invalidateQueries({ queryKey: testingKeys.testTags() });
      options?.onSuccess?.(...args);
    },
  });
}

/** A run's parts for this attempt: which are timed, and each opened part's clock. */
export function useRunParts(sessionKey: string | undefined, participantKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.runParts(sessionKey ?? "", participantKey ?? ""),
    queryFn: () => listRunParts(sessionKey as string, participantKey as string),
    enabled: Boolean(sessionKey) && Boolean(participantKey),
    staleTime: 60_000,
  });
}

/** The live paper, part by part: what the runner shows and how to open a gated part. */
export interface LivePaper {
  parts: RunPart[];
  exercises: SessionExercise[] | undefined;
  gate: RunPart | null;
  isLoading: boolean;
  isError: boolean;
  /** Open a timed part at the student's word, starting its clock. */
  openPart: (partKey: string) => void;
  openingPart: string | null;
}

/**
 * The live paper for one attempt: the parts map, then each part opened as the
 * student reaches it, with the next preloaded. `currentKey` is a question on
 * screen. An open is a repeatable POST, so each is a query keyed by its part;
 * one holding an essay Doc still being made is read again until it has its link.
 */
export function useLivePaper(
  sessionKey: string | undefined,
  participantKey: string | undefined,
  currentKey: string | undefined,
): LivePaper {
  const map = useRunParts(sessionKey, participantKey);
  const parts = map.data ?? [];
  const [askedFor, setAskedFor] = useState<ReadonlySet<string>>(() => new Set());
  const keys = partsToOpen(parts, Math.max(0, partIndexOf(parts, currentKey)), askedFor);
  const opens = useQueries({
    queries: keys.map((partKey) => ({
      queryKey: [...testingKeys.runParts(sessionKey ?? "", participantKey ?? ""), "open", partKey] as const,
      queryFn: () => openRunPart(sessionKey as string, participantKey as string, partKey),
      enabled: Boolean(sessionKey && participantKey),
      staleTime: Infinity,
      refetchInterval: (query: { state: { data?: OpenedRunPart } }) =>
        query.state.data?.exercises.some((item) => item.document?.status === "pending") ? 4_000 : false,
    })),
  });
  const opened = new Map<string, SessionExercise[]>();
  const stamped = new Map<string, OpenedRunPart>();
  opens.forEach((result) => {
    if (result.data) {
      opened.set(result.data.part_key, result.data.exercises);
      stamped.set(result.data.part_key, result.data);
    }
  });
  // An open's own stamps are newer than the map's.
  const current = parts.map((part) => {
    const fresh = stamped.get(part.part_key);
    return fresh
      ? { ...part, opened_at: fresh.opened_at, prep_ends_at: fresh.prep_ends_at, deadline_at: fresh.deadline_at }
      : part;
  });
  const state = paperState(current, opened);
  const firstLoading = Boolean(keys.length) && !opened.has(keys[0]);
  const opening = keys.find((key, i) => askedFor.has(key) && opens[i]?.isFetching && !opened.has(key)) ?? null;
  return {
    parts: current,
    exercises: map.data && !firstLoading ? state.exercises : undefined,
    gate: state.gate,
    isLoading: map.isLoading || firstLoading,
    isError: map.isError || opens.some((result) => result.isError && !result.data),
    openPart: (partKey) => setAskedFor((prev) => new Set([...prev, partKey])),
    openingPart: opening,
  };
}

/**
 * A finished attempt's whole paper, for its review: every part opened at once.
 * A finished or closed attempt stamps nothing when its parts are opened, so
 * this never starts a clock. The live runner uses `useLivePaper` instead.
 */
export function useSessionExercises(
  sessionKey: string | undefined,
  participantKey: string | undefined,
) {
  return useQuery({
    queryKey: testingKeys.sessionExercises(sessionKey ?? "", participantKey),
    queryFn: () => readWholePaper(sessionKey as string, participantKey as string),
    enabled: Boolean(sessionKey) && Boolean(participantKey),
    staleTime: 5 * 60_000,
  });
}

/**
 * A student's own gated result for one past run — the review screen's read.
 *
 * Resolves to `null` when the gate is shut: the API answers 403 until the
 * test's `answer_visibility` opens, and that is an answer ("not released yet"),
 * not a failure. Anything else is an error. `retry: false` because a refusal
 * does not become an acceptance on the third try.
 *
 * The runner does NOT use this — it calls `getParticipantResult` once, in the
 * submit flow, at the moment the score is first released.
 */
export function useParticipantResult(
  sessionKey: string | undefined,
  participantKey: string | undefined,
) {
  return useQuery<ParticipantResult | null>({
    queryKey: testingKeys.participantResult(
      sessionKey ?? "",
      participantKey ?? "",
    ),
    queryFn: async () => {
      try {
        return await getParticipantResult(
          sessionKey as string,
          participantKey as string,
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) return null;
        throw err;
      }
    },
    enabled: Boolean(sessionKey && participantKey),
    retry: false,
  });
}

/** One library exercise by its own key — the standalone exercise detail page. */
export function useExercise(exerciseKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.exercise(exerciseKey ?? ""),
    queryFn: () => getExercise(exerciseKey as string),
    enabled: Boolean(exerciseKey),
  });
}

export function useExercises(params: ListExercisesParams = {}) {
  return useQuery({
    queryKey: testingKeys.exercises(params),
    queryFn: () => listExercises(params),
  });
}

export type ExercisePageParams = Omit<ListExercisesParams, "page_size" | "cursor">;

/** The question library, a page at a time on the server. See `useTestPages`. */
export function useExercisePages(scope: string, params: ExercisePageParams) {
  return toCursorTable(
    useServerList({
      scope,
      queryKey: testingKeys.exercisePages(params),
      fetchPage: (pageSize, cursor) =>
        listExercises({ ...params, page_size: pageSize, cursor }),
      defaultPageSize: LIBRARY_PAGE_SIZE,
      keepPreviousPage: true,
      mobile: false,
    }),
  );
}

export function useTestExercises(testKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.testExercises(testKey ?? ""),
    queryFn: () => listTestExercises(testKey as string),
    enabled: Boolean(testKey),
  });
}

/**
 * One collection in full, for the fields the embedded stub omits — chiefly
 * `edited_at`, which every PATCH needs. Skipped until a collection is actually
 * selected, so the structure screen pays for it only when a part/section is
 * opened.
 */
export function useCollection(collectionKey: string | null | undefined) {
  return useQuery({
    queryKey: testingKeys.collection(collectionKey ?? ""),
    queryFn: () => getCollection(collectionKey as string),
    enabled: Boolean(collectionKey),
  });
}

export interface ListCollectionsParams {
  kind?: CollectionKind;
  search?: string;
}

/**
 * The parts library, a page at a time on the server. See `useTestPages`.
 *
 * A part is usually titled "Part 3" and its passage title is the only thing
 * that tells two apart — which is why `search` covers both columns.
 */
export function useCollectionPages(scope: string, params: ListCollectionsParams) {
  return toCursorTable(
    useServerList({
      scope,
      queryKey: testingKeys.collectionPages(params),
      fetchPage: (pageSize, cursor) =>
        listCollectionsPage(params, { pageSize, cursor }),
      defaultPageSize: LIBRARY_PAGE_SIZE,
      keepPreviousPage: true,
      mobile: false,
    }),
  );
}

/**
 * Put an existing library part onto a test, with everything under it.
 *
 * Invalidates the test's question list rather than the collection: linking does
 * not change the part, it changes the paper. A 409 here is the API refusing
 * because one of the part's questions is already on that test standalone — its
 * message names the remedy, so it is surfaced rather than rewritten.
 */
export function useLinkCollectionToTest(
  options?: MutationExtras<
    TestCollectionLink,
    { testKey: string; collectionKey: string; timers?: PartTimers; order?: number }
  >,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ testKey, collectionKey, timers, order }) =>
      linkCollectionToTest(testKey, collectionKey, timers, order),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: testingKeys.testExercises(args[1].testKey) });
      qc.invalidateQueries({ queryKey: testingKeys.test(args[1].testKey) });
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Edit a library part, or one of its sections, from the part's own screen.
 *
 * Unlike `usePatchCollection` this refetches the PART however deep the edited
 * row is — the part's detail read is where its sections' text is shown — and
 * the parts list, which shows who each part is shared with.
 */
export function usePatchLibraryCollection(
  partKey: string,
  options?: MutationExtras<
    Collection,
    { collectionKey: string; body: UpdateCollectionBody }
  >,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      collectionKey,
      body,
    }: {
      collectionKey: string;
      body: UpdateCollectionBody;
    }) => patchCollection(collectionKey, body),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: testingKeys.collection(partKey) });
      qc.invalidateQueries({ queryKey: ["collections"] });
      // Library questions embed the part's text as a stub.
      qc.invalidateQueries({ queryKey: ["exercises"] });
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Permanently delete a test. The caller's `onSuccess` runs BEFORE the test's
 * own queries are dropped, so a screen can navigate away first — dropped while
 * the detail screen is still mounted, they would refetch straight into a 404.
 */
export function useDeleteTest(
  options?: MutationExtras<void, { testKey: string; deleteContent: boolean }>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ testKey, deleteContent }) => deleteTest(testKey, deleteContent),
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      const { testKey, deleteContent } = args[1];
      qc.removeQueries({ queryKey: testingKeys.test(testKey) });
      qc.removeQueries({ queryKey: testingKeys.testExercises(testKey) });
      qc.invalidateQueries({ queryKey: ["tests"] });
      qc.invalidateQueries({ queryKey: testingKeys.testTags() });
      if (deleteContent) {
        qc.invalidateQueries({ queryKey: ["exercises"] });
        qc.invalidateQueries({ queryKey: ["collections"] });
      }
    },
  });
}

/** Delete a library part. Same ordering as `useDeleteTest`, for the same reason. */
export function useDeleteCollection(options?: MutationExtras<void, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (collectionKey: string) => deleteCollection(collectionKey),
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      qc.removeQueries({ queryKey: testingKeys.collection(args[1]) });
      qc.invalidateQueries({ queryKey: ["collections"] });
      // Its questions are standalone now, and their embedded stub is gone.
      qc.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

/**
 * Every live session the caller may see. Keep for the reads that genuinely
 * want the wider set — the Challenges tab, a test's sibling runs in the
 * results picker, and redirects that resolve a test to one of its runs.
 */
export function useLiveSessions(params?: ListLiveSessionsParams) {
  return useQuery({
    queryKey: testingKeys.liveSessions(params),
    queryFn: () => listLiveSessions(params),
  });
}

/**
 * The caller's own live sessions — the rooms they opened — for the teacher
 * dashboard: the everything list filtered by `owner_key=<their sub>`. Held
 * until the sub is known, since a request without it would be the unfiltered
 * list (a manager's whole group).
 */
export function useMyLiveSessions(
  params?: Omit<ListLiveSessionsParams, "owner_key">,
) {
  const ownerKey = useAuth().user?.sub;
  const mine = { ...params, owner_key: ownerKey };
  return useQuery({
    queryKey: testingKeys.liveSessions(mine),
    queryFn: () => listLiveSessions(mine),
    enabled: Boolean(ownerKey),
  });
}

/**
 * One live session by its own key — the session-keyed screens run off this.
 *
 * Polled, because `status` is the switch every other live read is gated on and
 * nothing else on these screens re-reads it. Start and End invalidate it, but
 * only for the tab that pressed the button: a teacher who opened results
 * directly, refreshed, or is watching from a second tab would otherwise hold a
 * `lobby` forever and never poll anything. The forced timer's server-side
 * auto-end has no button at all.
 */
export function useLiveSession(sessionKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.liveSession(sessionKey ?? ""),
    queryFn: () => getLiveSession(sessionKey as string),
    enabled: Boolean(sessionKey),
    refetchInterval: (query) => sessionPollMs(query.state.data?.status),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export type LiveSessionPageParams = Omit<ListLiveSessionsParams, "page_size" | "cursor">;

/**
 * Live sessions a page at a time on the server — for the lists a teacher pages
 * back through (the Challenges tab, a test's Past sessions). See `useTestPages`.
 *
 * `useLiveSessions` is one page of the API's default 50, which would cut both
 * lists short; `listAllPages` would be wrong the other way, a school's whole run
 * history on every visit to a tab whose first screen is the newest ten.
 *
 * `owner: "mine"` adds `owner_key=<the caller's sub>` (from `useAuth().user`,
 * the `/v2/users/me` record) instead of reading everything the caller may see.
 * The list is held until that sub is known: a page fetched without it would be
 * the unfiltered one. The key still starts `live-sessions`, so the session
 * mutations' invalidation reaches both variants.
 */
export function useLiveSessionPages(
  scope: string,
  params: LiveSessionPageParams,
  owner: "mine" | "everyone" = "everyone",
) {
  const ownerKey = useAuth().user?.sub;
  const listParams: LiveSessionPageParams =
    owner === "mine" ? { ...params, owner_key: ownerKey } : params;
  return toCursorTable(
    useServerList({
      scope,
      queryKey: testingKeys.liveSessionPages(listParams, owner),
      fetchPage: (pageSize, cursor) =>
        listLiveSessions({ ...listParams, page_size: pageSize, cursor }),
      enabled: owner === "everyone" || Boolean(ownerKey),
      defaultPageSize: LIBRARY_PAGE_SIZE,
      keepPreviousPage: true,
      mobile: false,
    }),
  );
}

/**
 * The owner's results for a session: participants — with presence, position and
 * submission while the run is going — and per-question accuracy. The one
 * authoritative Postgres read; it also works when answers are hidden, and it is
 * what the results screen polls through the lobby and the run.
 */
/**
 * One last read when a run ends.
 *
 * `liveQueryOptions` stops polling at `ended`, which on its own would leave the
 * screen holding numbers up to a tick old — and the last tick is the one that
 * matters, since the forced timer's auto-end lands right after a scramble of
 * final submits. Fires on the transition only, so an already-ended session
 * opened fresh still costs exactly one request.
 */
function useFinalReadOnEnd(
  status: LiveSessionStatus | undefined,
  refetch: () => void,
) {
  const previous = useRef(status);
  useEffect(() => {
    if (previous.current === "live" && status === "ended") refetch();
    previous.current = status;
  }, [status, refetch]);
}

// While a recompute is owed the stored row is behind the marks; it lands
// about 30 s after the last one.
const STORED_UPDATING_POLL_MS = 5_000;

/**
 * A run's stored results, where its split by skill and by part is read. Only
 * fetched once the run has ended, since nothing is stored before; polled while
 * the API says a recompute is owed.
 */
export function useStoredRunResults(sessionKey: string | undefined, status?: LiveSessionStatus) {
  return useQuery({
    queryKey: testingKeys.storedRunResults(sessionKey ?? ""),
    queryFn: () => getStoredRunResults(sessionKey as string),
    enabled: Boolean(sessionKey) && status === "ended",
    refetchInterval: (query) => (query.state.data?.updating ? STORED_UPDATING_POLL_MS : false),
  });
}

export function useSessionResults(
  sessionKey: string | undefined,
  status?: LiveSessionStatus,
  order?: AttemptOrder,
  cohortKey?: string | null,
) {
  const query = useQuery({
    queryKey: testingKeys.sessionResults(sessionKey ?? "", order, cohortKey),
    // The order is in the key, so each one is its own cache entry and switching
    // back to a previous sort is instant rather than a refetch. It also means
    // the polling a live room does keeps polling whichever order is on screen.
    queryFn: () => getLiveSessionResults(sessionKey as string, order, cohortKey),
    enabled: Boolean(sessionKey),
    // Re-sorting is a new request; keeping the previous rows on screen while it
    // lands stops the table blanking to its empty state for a beat.
    placeholderData: (previous) => previous,
    // An ended session's results are final; a running one is polled so the
    // teacher sees the room progress without a reload.
    ...liveQueryOptions(status),
  });
  useFinalReadOnEnd(status, query.refetch);
  return query;
}

/**
 * One participant's whole run — every question, their answer, the key, and the
 * risk breakdown.
 *
 * A separate read from `useSessionResults`, not a slice of it: that returns the
 * class's totals, and expanding it to every cell for every student would be the
 * wrong payload for a screen that shows one student at a time.
 */
export function useParticipantAttempt(
  sessionKey: string | undefined,
  participantKey: string | undefined,
  status?: LiveSessionStatus,
) {
  const query = useQuery({
    queryKey: testingKeys.participantAttempt(
      sessionKey ?? "",
      participantKey ?? "",
    ),
    queryFn: () =>
      getParticipantAttempt(sessionKey as string, participantKey as string),
    enabled: Boolean(sessionKey && participantKey),
    // Watched on the same cadence as the room it came from. This screen is
    // opened *during* a run to see what one student is doing; a frozen panel
    // reads as "they've stopped working" when they haven't.
    ...liveQueryOptions(status),
  });
  useFinalReadOnEnd(status, query.refetch);
  return query;
}

/**
 * Every integrity signal of one attempt, fetched only when asked for.
 *
 * The attempt read carries the most recent events and a `truncated` flag, and
 * hundreds of blurs is exactly the case where the older ones matter.
 */
export function useParticipantProctorEvents(
  sessionKey: string | undefined,
  participantKey: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: testingKeys.participantProctorEvents(
      sessionKey ?? "",
      participantKey ?? "",
    ),
    queryFn: () =>
      listParticipantProctorEvents(sessionKey as string, participantKey as string),
    enabled: enabled && Boolean(sessionKey && participantKey),
  });
}

// --- Mutations --------------------------------------------------------------
// Small helper so each mutation can invalidate its lists without repeating the
// options plumbing. `invalidate` receives the client for precise invalidation.
type MutationExtras<TData, TVars> = Omit<
  UseMutationOptions<TData, Error, TVars>,
  "mutationFn"
>;

// How long after a regrade is queued the results are read again, in ms. The
// task usually lands within seconds; an ended run's results are not polled.
const REGRADE_REREADS_MS = [3_000, 10_000, 30_000];

/**
 * A save that may be refused with a 409 `RegradeConflict`: on one, asks the
 * teacher which runs to regrade (`useRegradePrompt`) and sends it again with
 * `force`. Cancelling throws `RegradeCancelled`, so the edit stays unsaved. A
 * queued regrade re-reads every results and attempt view a few times.
 */
function useRegradingSave() {
  const qc = useQueryClient();
  const prompt = useRegradePrompt();
  const { t } = useStableI18n();
  return useCallback(
    async <T,>(send: (choice?: RegradeChoice) => Promise<T>): Promise<T> => {
      try {
        return await send();
      } catch (err) {
        const conflict = regradeConflictOf(err);
        if (!conflict) throw err;
        const keys = await prompt(conflict);
        if (keys === null) throw new RegradeCancelled();
        const result = await send({ force: true, live_session_keys: keys });
        if (keys.length) {
          toast.success(
            t("exercise.import.regrade.queued", "Saved. Regrading {n} sessions; their results update in a moment.", {
              n: keys.length,
            }),
          );
          rereadResults(qc);
        }
        return result;
      }
    },
    [qc, prompt, t],
  );
}

/** Mark every results, attempt and run view stale now and again shortly, for a queued regrade. */
function rereadResults(qc: ReturnType<typeof useQueryClient>) {
  const reread = () => {
    qc.invalidateQueries({ queryKey: ["session-results"] });
    qc.invalidateQueries({ queryKey: ["participant-attempt"] });
    qc.invalidateQueries({ queryKey: ["live-session"] });
    qc.invalidateQueries({ queryKey: ["live-sessions"] });
  };
  reread();
  REGRADE_REREADS_MS.forEach((ms) => setTimeout(reread, ms));
}

/** A new question, and the test whose part it joins (for the invalidation only; never sent). */
export type CreateExerciseVars = CreateExerciseBody & { testKey?: string };

export function useCreateExercise(options?: MutationExtras<AuthoredExercise, CreateExerciseVars>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: CreateExerciseVars) => {
      // `testKey` is for the invalidation below; the API never takes it.
      const body: CreateExerciseBody = { ...vars };
      delete (body as CreateExerciseVars).testKey;
      return createExercise(body);
    },
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ["exercises"] });
      qc.invalidateQueries({ queryKey: testingKeys.exerciseTags() });
      // Joining a part on a test puts the question on its paper, so that
      // test's question list is stale too.
      const testKey = args[1]?.testKey;
      if (testKey) {
        qc.invalidateQueries({ queryKey: testingKeys.testExercises(testKey) });
        qc.invalidateQueries({ queryKey: testingKeys.test(testKey) });
      }
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Patch any exercise, for screens that edit a list rather than one fixed key
 * (the test's exercises table / side panel). Pass `testKey` so that test's
 * question list refreshes too.
 */
export function useUpdateExercise(
  testKey?: string,
  options?: MutationExtras<
    AuthoredExercise,
    { exerciseKey: string; body: ExercisePatchBody }
  >,
) {
  const qc = useQueryClient();
  const save = useRegradingSave();
  return useMutation({
    mutationFn: ({
      exerciseKey,
      body,
    }: {
      exerciseKey: string;
      body: ExercisePatchBody;
    }) => save((choice) => patchExercise(exerciseKey, { ...body, ...choice })),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ["exercises"] });
      qc.invalidateQueries({ queryKey: testingKeys.exerciseTags() });
      qc.invalidateQueries({ queryKey: testingKeys.exercise(args[1].exerciseKey) });
      if (testKey) {
        qc.invalidateQueries({ queryKey: testingKeys.testExercises(testKey) });
      }
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Which of the caller's tests carry a library question, for the delete
 * confirmation: one `GET /v2/tests?exercise_key=` read. Only enabled while a
 * confirmation is open. The answer is a lower bound: the delete also reaches
 * tests the caller cannot see.
 */
export function useTestsLinkingExercise(exerciseKey: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: testingKeys.testsLinkingExercise(exerciseKey ?? ""),
    queryFn: () => listTests({ exerciseKey: exerciseKey as string }),
    enabled: Boolean(exerciseKey) && enabled,
    // Asked fresh each time the confirmation opens: a stale "on no tests" is
    // the one wrong answer that matters here.
    staleTime: 0,
    gcTime: 0,
  });
}

/**
 * Put one standalone library question on a test (`addQuestionToTest`): it
 * joins the test's "Questions" part. `points` is the mark on THAT test; omit it
 * to keep the library default.
 */
export function useLinkExerciseToTest(
  options?: MutationExtras<
    TestExerciseLink,
    { testKey: string; exercise: AuthoredExercise; points?: number }
  >,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ testKey, exercise, points }) => addQuestionToTest(testKey, exercise, points),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: testingKeys.testExercises(args[1].testKey) });
      qc.invalidateQueries({ queryKey: testingKeys.test(args[1].testKey) });
      // `question_count` on the list rows.
      qc.invalidateQueries({ queryKey: ["tests"] });
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Delete a library question for good (`deleteExercise`). The delete cascades
 * onto every test that links it and every answer recorded there, so every read
 * that could list it is invalidated: the library, every test's questions and
 * counts, and the collections it may have belonged to.
 */
export function useDeleteExercise(options?: MutationExtras<void, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (exerciseKey: string) => deleteExercise(exerciseKey),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ["exercises"] });
      qc.invalidateQueries({ queryKey: testingKeys.exerciseTags() });
      qc.invalidateQueries({ queryKey: ["test-exercises"] });
      qc.invalidateQueries({ queryKey: ["tests"] });
      qc.invalidateQueries({ queryKey: ["test"] });
      qc.invalidateQueries({ queryKey: ["collection"] });
      qc.invalidateQueries({ queryKey: ["collections"] });
      // The caller navigates away first; dropping the entry afterwards stops a
      // still-mounted detail screen refetching a row that no longer exists.
      options?.onSuccess?.(...args);
      qc.removeQueries({ queryKey: testingKeys.exercise(args[1]) });
    },
  });
}

/**
 * Set a question's marks on ONE test.
 *
 * Invalidates the test itself as well as its links: `max_points` on every
 * results surface is derived from them, so a stale test would show the old
 * total next to the new mark.
 */
/**
 * Mark one written answer.
 *
 * Invalidates the SESSION RESULTS as well as the attempt: marking moves the
 * class scoreboard (a student's total and their `pending` count), and the
 * results table is the screen a teacher goes back to in order to pick the next
 * paper. Left stale it would keep showing the essay as outstanding.
 */
export function useMarkAnswer(
  sessionKey: string,
  participantKey: string,
  options?: MutationExtras<
    AttemptItem,
    { testExerciseKey: string; points: number; feedback?: string | null }
  >,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ testExerciseKey, points, feedback }) =>
      markParticipantAnswer(sessionKey, participantKey, testExerciseKey, {
        points,
        feedback,
      }),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: testingKeys.participantAttempt(sessionKey, participantKey),
      });
      qc.invalidateQueries({
        queryKey: testingKeys.sessionResults(sessionKey),
      });
      // A mark queues the recompute; the refetch sees `updating` and polls it.
      qc.invalidateQueries({
        queryKey: testingKeys.storedRunResults(sessionKey),
      });
      options?.onSuccess?.(...args);
    },
  });
}

export function usePatchTestExercise(
  testKey: string,
  options?: MutationExtras<
    TestExerciseLink,
    { testExerciseKey: string; editedAt: string | null; points: number | null }
  >,
) {
  const qc = useQueryClient();
  const save = useRegradingSave();
  return useMutation({
    mutationFn: ({ testExerciseKey, editedAt, points }) =>
      save((choice) =>
        patchTestExercise(testKey, testExerciseKey, {
          edited_at: editedAt,
          points,
          ...choice,
        }),
      ),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: testingKeys.testExercises(testKey) });
      qc.invalidateQueries({ queryKey: testingKeys.test(testKey) });
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Regrade one run's auto-marked answers against today's answer keys and marks
 * (the results screen's "Regrade answers"). The work is a background task, so
 * the run's views are re-read a few times after it is queued.
 */
export function useRegradeLiveSession(
  options?: MutationExtras<{ answers: number }, string>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionKey: string) => regradeLiveSession(sessionKey),
    ...options,
    onSuccess: (...args) => {
      rereadResults(qc);
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Create a part or section. It is a LIBRARY object — creating one does not put
 * it in any test; its questions do that, either by being created with
 * `test_key` or by linking the whole collection.
 */
export function useCreateCollection(
  options?: MutationExtras<Collection, CreateCollectionBody>,
) {
  return useMutation({
    mutationFn: (body: CreateCollectionBody) => createCollection(body),
    ...options,
  });
}

/**
 * Rename/retext a part or section. Pass `testKey` so the test whose structure
 * screen shows it refetches — the collection text reaches that screen through
 * the stub embedded on each exercise, not through the collection query.
 */
export function usePatchCollection(
  testKey?: string,
  options?: MutationExtras<
    Collection,
    { collectionKey: string; body: UpdateCollectionBody }
  >,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      collectionKey,
      body,
    }: {
      collectionKey: string;
      body: UpdateCollectionBody;
    }) => patchCollection(collectionKey, body),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: testingKeys.collection(args[1].collectionKey),
      });
      if (testKey) {
        qc.invalidateQueries({ queryKey: testingKeys.testExercises(testKey) });
      }
      options?.onSuccess?.(...args);
    },
  });
}

export interface CreateLiveSessionVars {
  testKey: string;
  /** The class session the run is set in; null only on a room guests can sit. */
  sessionKey: string | null;
  delivery: LiveSessionDelivery;
  /** Who may get in; fixed for the run's life. */
  admission: LiveSessionAdmission;
}

export function useCreateLiveSession(
  options?: MutationExtras<LiveSession, CreateLiveSessionVars>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ testKey, sessionKey, delivery, admission }: CreateLiveSessionVars) =>
      createLiveSession(testKey, sessionKey, delivery, admission),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ["live-sessions"] });
      options?.onSuccess?.(...args);
    },
  });
}

export function useStartLiveSession(options?: MutationExtras<LiveSession, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionKey: string) => startLiveSession(sessionKey),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: testingKeys.liveSession(args[1]) });
      qc.invalidateQueries({ queryKey: ["live-sessions"] });
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * Change a run's time limit (lobby or live).
 *
 * Invalidates the same pair as start/end: the session itself, and every list
 * that shows it. On a live run the students' countdowns come from the live stream and
 * move on their own — this only refreshes the teacher's copy.
 */
export function usePatchLiveSession(
  options?: MutationExtras<LiveSession, PatchLiveSessionArgs>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionKey, body }: PatchLiveSessionArgs) =>
      patchLiveSession(sessionKey, body),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: testingKeys.liveSession(args[1].sessionKey),
      });
      qc.invalidateQueries({ queryKey: ["live-sessions"] });
      options?.onSuccess?.(...args);
    },
  });
}

interface PatchLiveSessionArgs {
  sessionKey: string;
  body: UpdateLiveSessionBody;
}

// --- Listening recordings ---------------------------------------------------
/** After any recording write: every owner's list and every paper's. */
function invalidateRecordings(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: testingKeys.recordings() });
  qc.invalidateQueries({
    predicate: (query) => query.queryKey[0] === "test-exercises" && query.queryKey[2] === "recordings",
  });
}

/** Everything that plays on a test's paper, with what each covers. */
export function useTestRecordings(testKey: string | null | undefined) {
  return useQuery({
    queryKey: testingKeys.testRecordings(testKey ?? ""),
    queryFn: () => listTestRecordings(testKey as string),
    enabled: Boolean(testKey),
  });
}

/** One owner's own recordings — a part's, a section's, a question's. */
export function useOwnerRecordings(
  ownerKind: RecordingOwnerKind,
  ownerKey: string | null | undefined,
) {
  return useQuery({
    queryKey: testingKeys.ownerRecordings(ownerKind, ownerKey ?? ""),
    queryFn: () => listOwnerRecordings(ownerKind, ownerKey as string),
    enabled: Boolean(ownerKey),
  });
}

/** Several owners' recordings at once — a part's and each of its sections'. */
export function useOwnersRecordings(ownerKind: RecordingOwnerKind, ownerKeys: readonly string[]) {
  return useQueries({
    queries: ownerKeys.map((ownerKey) => ({
      queryKey: testingKeys.ownerRecordings(ownerKind, ownerKey),
      queryFn: () => listOwnerRecordings(ownerKind, ownerKey),
    })),
    combine: combineRecordingLists,
  });
}

// Module-level so its reference is stable: an inline `combine` re-runs, and
// hands back a new list, on every render.
function combineRecordingLists(
  results: { data?: ListeningRecording[]; isLoading: boolean; isError: boolean }[],
) {
  return {
    data: results.flatMap((result) => result.data ?? []),
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}

/**
 * A run's recordings for the runner. Only asked for once the paper is: the API
 * refuses it in the lobby, as it refuses the paper.
 */
export function useSessionRecordings(sessionKey: string | null | undefined, enabled: boolean) {
  return useQuery({
    queryKey: testingKeys.sessionRecordings(sessionKey ?? ""),
    queryFn: () => listSessionRecordings(sessionKey as string),
    enabled: Boolean(sessionKey) && enabled,
    retry: 1,
  });
}

export function useCreateRecording(
  options?: MutationExtras<ListeningRecording, CreateRecordingBody>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRecordingBody) => createRecording(body),
    ...options,
    onSuccess: (...args) => {
      invalidateRecordings(qc);
      options?.onSuccess?.(...args);
    },
  });
}

export function usePatchRecording(
  options?: MutationExtras<ListeningRecording, { recordingKey: string; body: PatchRecordingBody }>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recordingKey, body }: { recordingKey: string; body: PatchRecordingBody }) =>
      patchRecording(recordingKey, body),
    ...options,
    onSuccess: (...args) => {
      invalidateRecordings(qc);
      // A replaced file is a new URL.
      qc.removeQueries({ queryKey: testingKeys.recordingMediaUrl(args[1].recordingKey) });
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteRecording(options?: MutationExtras<void, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recordingKey: string) => deleteRecording(recordingKey),
    ...options,
    onSuccess: (...args) => {
      invalidateRecordings(qc);
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * A teacher's signed read of a recording, fetched when the player is pressed.
 * Cached for 10 minutes, inside the API's 15-minute TTL; `fresh` skips the
 * cache — the player asks for it after a URL has failed.
 */
export function useFetchRecordingMediaUrl() {
  const qc = useQueryClient();
  return useCallback(
    (recordingKey: string, fresh = false) =>
      qc.fetchQuery({
        queryKey: testingKeys.recordingMediaUrl(recordingKey),
        queryFn: () => getRecordingMediaUrl(recordingKey),
        staleTime: fresh ? 0 : 10 * 60 * 1000,
        retry: false,
      }),
    [qc],
  );
}

/**
 * Play (`start`) or stop a recording for the whole room. Either changes the
 * session's `recordings`, so the polled session is refreshed at once rather than on
 * its next tick; the students hear it over the live stream.
 */
export function useRoomRecording(
  sessionKey: string,
  options?: MutationExtras<RecordingWindow, { recordingKey: string; action: "start" | "stop" }>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recordingKey, action }) =>
      action === "start"
        ? startRoomRecording(sessionKey, recordingKey)
        : stopRoomRecording(sessionKey, recordingKey),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: testingKeys.liveSession(sessionKey) });
      options?.onSuccess?.(...args);
    },
  });
}

// --- Cohorts, sign-up lists, results groups ---------------------------------
/** A test's cohorts, every page (a picker as much as a list). */
export function useTestCohorts(testKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.testCohorts(testKey ?? ""),
    queryFn: () => listCohorts(testKey as string),
    enabled: Boolean(testKey),
  });
}

/** A run's linked cohorts, with attempt counts and the public flag. */
export function useSessionCohorts(sessionKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.sessionCohorts(sessionKey ?? ""),
    queryFn: () => listSessionCohorts(sessionKey as string),
    enabled: Boolean(sessionKey),
  });
}

/** Every attempt at a run, from its roster; read only when `enabled`. */
export function useSessionAttempts(sessionKey: string | undefined, enabled = true) {
  return useQuery({
    queryKey: testingKeys.sessionAttempts(sessionKey ?? ""),
    queryFn: () => listSessionAttempts(sessionKey as string),
    enabled: Boolean(sessionKey) && enabled,
  });
}

/** A run's sign-up list. */
export function useSignUps(sessionKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.signUps(sessionKey ?? ""),
    queryFn: () => listSignUps(sessionKey as string),
    enabled: Boolean(sessionKey),
  });
}

/** A test's results groups, with session counts. */
export function useResultsGroups(testKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.resultsGroups(testKey ?? ""),
    queryFn: () => listResultsGroups(testKey as string),
    enabled: Boolean(testKey),
  });
}

/** One results group with its runs. */
export function useResultsGroup(testKey: string | undefined, groupKey: string | undefined) {
  return useQuery({
    queryKey: testingKeys.resultsGroup(testKey ?? "", groupKey ?? ""),
    queryFn: () => getResultsGroup(testKey as string, groupKey as string),
    enabled: Boolean(testKey && groupKey),
  });
}

/** A results group's combined results, in a server-side order. */
export function useResultsGroupResults(
  testKey: string | undefined,
  groupKey: string | undefined,
  order?: AttemptOrder,
  cohortKey?: string | null,
) {
  return useQuery({
    queryKey: testingKeys.resultsGroupResults(groupKey ?? "", order, cohortKey),
    queryFn: () =>
      getResultsGroupResults(testKey as string, groupKey as string, order, cohortKey),
    enabled: Boolean(testKey && groupKey),
    placeholderData: (previous) => previous,
  });
}

/** Everything a cohort write can change: the test's list, every run's links, results. */
function invalidateCohorts(qc: ReturnType<typeof useQueryClient>) {
  for (const key of ["test-cohorts", "session-cohorts", "session-results", "results-group-results"]) {
    qc.invalidateQueries({ queryKey: [key] });
  }
}

/** Create, rename or delete a test's cohort. */
export function useCohortWrite(testKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      write:
        | { kind: "create"; name: string }
        | { kind: "rename"; cohort: Cohort; name: string }
        | { kind: "delete"; cohortKey: string },
    ): Promise<unknown> =>
      write.kind === "create"
        ? createCohort(testKey, write.name)
        : write.kind === "rename"
          ? patchCohort(testKey, write.cohort.appsheet_key, {
              edited_at: write.cohort.edited_at,
              name: write.name,
            })
          : deleteCohort(testKey, write.cohortKey),
    onSuccess: () => invalidateCohorts(qc),
  });
}

/** Link (or flip `public` on) and unlink a run's cohorts. */
export function useSessionCohortWrite(sessionKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      write:
        | { kind: "link"; cohortKey: string; public: boolean }
        | { kind: "flag"; link: SessionCohort; public: boolean }
        | { kind: "unlink"; cohortKey: string },
    ): Promise<unknown> =>
      write.kind === "link"
        ? linkSessionCohort(sessionKey, write.cohortKey, write.public)
        : write.kind === "flag"
          ? patchSessionCohort(sessionKey, write.link.cohort_key, {
              edited_at: write.link.edited_at,
              public: write.public,
            })
          : unlinkSessionCohort(sessionKey, write.cohortKey),
    onSuccess: () => invalidateCohorts(qc),
  });
}

/** What adding a pasted list did: how many were added, and the emails already listed. */
export interface SignUpPasteResult {
  added: number;
  duplicates: string[];
}

/** Move one attempt to another of the run's cohorts from the roster. */
export function useMoveParticipant(sessionKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { participantKey: string; cohortKey: string | null }) =>
      moveParticipant(sessionKey, vars.participantKey, vars.cohortKey),
    onSuccess: () => invalidateCohorts(qc),
  });
}

/**
 * Add a pasted list to, fix one person on, or remove one person from, a run's
 * sign-up list. The API takes one person per call, so a paste is a call each,
 * in order; an email already listed (409) is counted as a duplicate rather
 * than an error. Any other refusal stops the paste there.
 */
export function useSignUpWrite(sessionKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      write:
        | { kind: "add"; entries: SignUpEntry[] }
        | { kind: "edit"; signUp: SignUp; changes: Partial<SignUpEntry> }
        | { kind: "delete"; signUpKey: string },
    ): Promise<SignUpPasteResult | void> => {
      if (write.kind === "delete") return deleteSignUp(sessionKey, write.signUpKey);
      if (write.kind === "edit") {
        await patchSignUp(sessionKey, write.signUp.appsheet_key, {
          edited_at: write.signUp.edited_at,
          ...write.changes,
        });
        return;
      }
      const result: SignUpPasteResult = { added: 0, duplicates: [] };
      try {
        for (const entry of write.entries) {
          try {
            await addSignUp(sessionKey, entry);
            result.added += 1;
          } catch (err) {
            if (!(err instanceof ApiError && err.status === 409)) throw err;
            result.duplicates.push(entry.email.trim().toLowerCase());
          }
        }
      } finally {
        // Whatever landed before a refusal is on the list; show it.
        qc.invalidateQueries({ queryKey: testingKeys.signUps(sessionKey) });
      }
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: testingKeys.signUps(sessionKey) }),
  });
}

/** Create, edit or delete a test's results group. */
export function useResultsGroupWrite(testKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      write:
        | { kind: "create"; name: string; retakeScoring: RetakeScoring }
        | { kind: "edit"; group: ResultsGroup; name?: string; retakeScoring?: RetakeScoring }
        | { kind: "delete"; groupKey: string },
    ): Promise<unknown> =>
      write.kind === "create"
        ? createResultsGroup(testKey, { name: write.name, retake_scoring: write.retakeScoring })
        : write.kind === "edit"
          ? patchResultsGroup(testKey, write.group.appsheet_key, {
              edited_at: write.group.edited_at,
              name: write.name,
              retake_scoring: write.retakeScoring,
            })
          : deleteResultsGroup(testKey, write.groupKey),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: testingKeys.resultsGroups(testKey) });
      qc.invalidateQueries({ queryKey: ["results-group-results"] });
      qc.invalidateQueries({ queryKey: ["live-session"] });
    },
  });
}

export function useEndLiveSession(options?: MutationExtras<LiveSession, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionKey: string) => endLiveSession(sessionKey),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: testingKeys.liveSession(args[1]) });
      qc.invalidateQueries({ queryKey: ["live-sessions"] });
      options?.onSuccess?.(...args);
    },
  });
}
