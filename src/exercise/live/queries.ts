// The live runner's TanStack Query reads over `./api`: the caller's record, their
// runs, the paper part by part, and a run's recordings.
import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { partIndexOf, partsToOpen, paperState } from "./paper-parts";

import {
  getCurrentUser,
  listMyParticipants,
  listRunParts,
  listSessionRecordings,
  openRunPart,
  type OpenedRunPart,
  type RunPart,
  type SessionExercise,
} from "./api";

// --- Query keys -------------------------------------------------------------
// The same keys as Leap's own, so an app that also invalidates them (a hand-in
// refreshing "participants") reaches these reads.
export const testingKeys = {
  runParts: (sessionKey: string, participantKey: string) => ["run-parts", sessionKey, participantKey] as const,
  participants: () => ["participants", "me"] as const,
  currentUser: () => ["current-user"] as const,
  sessionRecordings: (sessionKey: string) => ["recordings", "session", sessionKey] as const,
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

/** The signed-in user's own participants: every run they joined. */
export function useParticipants(enabled = true) {
  return useQuery({
    queryKey: testingKeys.participants(),
    queryFn: () => listMyParticipants(),
    // The runner reads this only once the score is on screen, for the
    // sitting's own start and finish; hooks cannot be called conditionally.
    enabled,
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
  /** Whether a part after the loaded ones is on its way (preloading, or a timed part opening). */
  loadingMore: boolean;
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
    loadingMore: state.more || opening !== null,
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
