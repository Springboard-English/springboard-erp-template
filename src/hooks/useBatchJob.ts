import { useCallback, useRef, useState } from "react";
import { type BatchOutcome, runBatch } from "../core/runBatch";

export type BatchItemStatus = "pending" | "running" | "ok" | "failed";

export interface BatchItemResult<R> {
  status: BatchItemStatus;
  result?: R;
  /** The failure as text, for a row. */
  error?: string;
  /** The value thrown, so a caller can still read `ApiError.status`. */
  cause?: unknown;
}

export interface UseBatchJobOptions {
  /** Simultaneous in-flight requests. */
  concurrency?: number;
}

export interface BatchJob<T, R> {
  /** Per-item state, keyed by `keyOf(item)`. Survives a re-run. */
  results: Record<string, BatchItemResult<R>>;
  isRunning: boolean;
  /** Items finished (ok or failed) out of the total for the current run. */
  progress: { done: number; total: number };
  run: (items: T[]) => Promise<BatchOutcome<T, R>[]>;
  /** Re-runs only the items that failed. */
  retryFailed: (items: T[]) => Promise<BatchOutcome<T, R>[]>;
  reset: () => void;
  cancel: () => void;
}

/**
 * `runBatch` with per-item state for a screen. The run lives in the tab:
 * closing it stops the queue, and items already sent have already happened.
 */
export function useBatchJob<T, R>(
  keyOf: (item: T) => string,
  perform: (item: T) => Promise<R>,
  options: UseBatchJobOptions = {},
): BatchJob<T, R> {
  const { concurrency } = options;
  const [results, setResults] = useState<Record<string, BatchItemResult<R>>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  // Refs because the run reads them between renders: an abort has to stop the
  // next dispatch, and `results` would otherwise rebuild `retryFailed` per item.
  const controllerRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<Record<string, BatchItemResult<R>>>({});

  const writeResult = useCallback((key: string, value: BatchItemResult<R>) => {
    resultsRef.current = { ...resultsRef.current, [key]: value };
    setResults(resultsRef.current);
  }, []);

  const run = useCallback(
    async (items: T[]) => {
      if (items.length === 0) return [];
      const controller = new AbortController();
      controllerRef.current = controller;
      setIsRunning(true);
      setProgress({ done: 0, total: items.length });
      for (const item of items) writeResult(keyOf(item), { status: "pending" });

      const outcomes = await runBatch(items, perform, {
        concurrency,
        signal: controller.signal,
        onStart: (item) => writeResult(keyOf(item), { status: "running" }),
        onSettle: (outcome) => {
          // A cancelled item stays pending: it was never sent.
          if (outcome.status === "cancelled") return;
          const key = keyOf(outcome.item);
          if (outcome.status === "fulfilled") {
            writeResult(key, { status: "ok", result: outcome.value });
          } else {
            const { error } = outcome;
            writeResult(key, {
              status: "failed",
              error: error instanceof Error ? error.message : String(error),
              cause: error,
            });
          }
          setProgress((current) => ({ ...current, done: current.done + 1 }));
        },
      });
      setIsRunning(false);
      return outcomes;
    },
    [concurrency, keyOf, perform, writeResult],
  );

  const retryFailed = useCallback(
    (items: T[]) => run(items.filter((item) => resultsRef.current[keyOf(item)]?.status === "failed")),
    [keyOf, run],
  );

  const reset = useCallback(() => {
    resultsRef.current = {};
    setResults({});
    setProgress({ done: 0, total: 0 });
  }, []);

  const cancel = useCallback(() => controllerRef.current?.abort(), []);

  return { results, isRunning, progress, run, retryFailed, reset, cancel };
}
