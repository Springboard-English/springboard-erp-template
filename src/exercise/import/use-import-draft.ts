import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import { runBatch } from "../../core/index";
import { exerciseNodeSchema } from "../index";

import {
  extractSection,
  extractedExerciseToNode,
  type DetectStructure,
  type ExtractedCollection,
  type ExtractedExercise,
  type ExtractSource,
  type DetectedSectionSpec,
  type SectionExtract,
} from "./api";
import { ApiError } from "../../exports";
import { emptyDraft, importDraftReducer, type ImportDraft, type ImportDraftAction, type ReviewItem } from "./import-draft";

// How many extract calls run at once. Each is a short, independent model call,
// so the ceiling is the provider's rate limit; a file source is re-sent whole
// with every call, so a scan of up to 15MB fans out far fewer.
const EXTRACT_CONCURRENCY = 20;
const FILE_EXTRACT_CONCURRENCY = 6;

/** How many extract calls may run at once for this source. */
function extractConcurrency(source: ExtractSource): number {
  return source.data ? FILE_EXTRACT_CONCURRENCY : EXTRACT_CONCURRENCY;
}

/** Run thunks with at most `limit` in flight; the first error stops new ones and is rethrown. */
export async function runPool(jobs: Array<() => Promise<void>>, limit: number): Promise<void> {
  const stop = new AbortController();
  let failed = false;
  let failure: unknown;
  await runBatch(jobs, (job) => job(), {
    concurrency: limit,
    signal: stop.signal,
    onSettle: (outcome) => {
      if (outcome.status !== "rejected" || failed) return;
      failed = true;
      failure = outcome.error;
      stop.abort();
    },
  });
  if (failed) throw failure;
}

/**
 * An extracted DTO as a review item, or null when it fails the schema. Ids are
 * deterministic (`ref-order`) so keys and the discard set stay stable.
 */
function toItem(dto: ExtractedExercise, ref: string, order: number): ReviewItem | null {
  const parsed = exerciseNodeSchema.safeParse(extractedExerciseToNode(dto, `draft-${ref}-${order}`));
  return parsed.success
    ? { node: parsed.data, collectionRef: dto.collection_ref ?? ref, collectionOrder: dto.collection_order ?? order }
    : null;
}

/** The draft, its dispatch, and the calls that fill it. */
export interface ImportDraftHandle {
  draft: ImportDraft;
  dispatch: (action: ImportDraftAction) => void;
  /** Read a detected paper (or, `append`, a further file into this one). */
  begin: (source: ExtractSource, structure: DetectStructure, append: boolean) => void;
  /** Read one failed or short unit again. */
  retry: (ref: string) => Promise<void>;
  /** Units being read again right now. */
  retrying: Set<string>;
  /** Forget this import and cancel its calls still running. */
  reset: () => void;
  /** The current import's abort signal, for its detect call. */
  signal: () => AbortSignal;
  /** True while `run` is still the current import. */
  isCurrent: (run: number) => boolean;
  /** The current import's id. */
  run: () => number;
}

/** How one section is read: the API's extract call, or the tour's sample. */
export type SectionExtractor = (source: ExtractSource, section: DetectedSectionSpec, signal: AbortSignal) => Promise<SectionExtract>;

/**
 * One AI import's draft paper and its extract calls. Leaving an import bumps
 * its run id and aborts its calls, so a late answer from an earlier paper is
 * dropped rather than merged into the next one. `extractor` replaces the API
 * call, for the tour's practice import.
 */
export function useImportDraft(extractor: SectionExtractor = extractSection): ImportDraftHandle {
  // Read at call time, so a begun run uses the extractor of the screen that began it.
  const extractorRef = useRef(extractor);
  extractorRef.current = extractor;
  const [draft, dispatch] = useReducer(importDraftReducer, undefined, emptyDraft);
  const [retrying, setRetrying] = useState<Set<string>>(new Set());
  const runRef = useRef(0);
  const abortRef = useRef(new AbortController());
  // Each unit's call, kept so a failed one can run again.
  const jobsRef = useRef(new Map<string, () => Promise<void>>());

  const unitJob = useCallback(
    (
      run: number,
      signal: AbortSignal,
      ref: string,
      expected: number,
      call: () => Promise<{ dtos: ExtractedExercise[]; collection?: Partial<ExtractedCollection> }>,
    ) =>
      async () => {
        try {
          const { dtos, collection } = await call();
          if (runRef.current !== run) return;
          const items = dtos.map((dto, i) => toItem(dto, ref, i)).filter((x): x is ReviewItem => x !== null);
          dispatch({
            type: "unitResolved",
            ref,
            items,
            collection,
            outcome: { status: items.length ? "done" : "failed", expected, received: dtos.length, parsed: items.length },
          });
        } catch (err) {
          if (runRef.current !== run || signal.aborted) return;
          dispatch({
            type: "unitResolved",
            ref,
            items: [],
            outcome: { status: "failed", expected, received: 0, parsed: 0, error: err instanceof ApiError ? (err.detail ?? undefined) : undefined },
          });
        }
      },
    [],
  );

  const begin = useCallback(
    (source: ExtractSource, structure: DetectStructure, append: boolean) => {
      dispatch({ type: "begin", structure, append });
      const run = runRef.current;
      const signal = abortRef.current.signal;
      const jobs: Array<() => Promise<void>> = [];
      const bumped = (job: () => Promise<void>) => () => job().finally(() => runRef.current === run && dispatch({ type: "progressBump" }));
      for (const part of structure.parts) {
        for (const section of part.sections) {
          const job = unitJob(run, signal, section.ref, section.question_count, async () => {
            const res = await extractorRef.current(source, section, signal);
            return {
              dtos: res.exercises,
              collection: {
                ...(res.passage ? { passage: res.passage } : {}),
                ...(res.prompts ? { prompts: res.prompts } : {}),
                // Merged over what detection set, by the reducer.
                ...(res.info ? { info: res.info } : {}),
              },
            };
          });
          jobsRef.current.set(section.ref, job);
          jobs.push(bumped(job));
        }
      }
      void runPool(jobs, extractConcurrency(source));
    },
    [unitJob],
  );

  const retry = useCallback(async (ref: string) => {
    const job = jobsRef.current.get(ref);
    if (!job) return;
    setRetrying((current) => new Set(current).add(ref));
    dispatch({ type: "unitPending", ref });
    try {
      await job();
    } finally {
      setRetrying((current) => {
        const next = new Set(current);
        next.delete(ref);
        return next;
      });
    }
  }, []);

  const reset = useCallback(() => {
    runRef.current += 1;
    abortRef.current.abort();
    abortRef.current = new AbortController();
    jobsRef.current = new Map();
    setRetrying(new Set());
    dispatch({ type: "reset" });
  }, []);

  return useMemo(
    () => ({
      draft,
      dispatch,
      begin,
      retry,
      retrying,
      reset,
      signal: () => abortRef.current.signal,
      isCurrent: (run: number) => runRef.current === run,
      run: () => runRef.current,
    }),
    [draft, begin, retry, retrying, reset],
  );
}
