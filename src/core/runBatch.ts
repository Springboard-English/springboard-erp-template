export const DEFAULT_BATCH_CONCURRENCY = 10;

export interface RunBatchOptions<T, R> {
  /** Simultaneous in-flight calls. */
  concurrency?: number;
  /** Aborting stops the next dispatch; calls already in flight still finish. */
  signal?: AbortSignal;
  onStart?: (item: T, index: number) => void;
  onSettle?: (outcome: BatchOutcome<T, R>, index: number) => void;
}

/** What happened to one item. A `rejected` error is the value thrown, untouched. */
export type BatchOutcome<T, R> =
  | { status: "fulfilled"; item: T; value: R }
  | { status: "rejected"; item: T; error: unknown }
  | { status: "cancelled"; item: T };

/**
 * Calls `perform` once per item with bounded concurrency and never rejects.
 * Outcomes come back in item order, so the caller owns the failure policy.
 */
export async function runBatch<T, R>(
  items: readonly T[],
  perform: (item: T) => Promise<R>,
  options: RunBatchOptions<T, R> = {},
): Promise<BatchOutcome<T, R>[]> {
  const { signal, onStart, onSettle } = options;
  const concurrency = Math.max(1, options.concurrency ?? DEFAULT_BATCH_CONCURRENCY);
  const outcomes = new Array<BatchOutcome<T, R>>(items.length);
  let cursor = 0;

  const settle = (index: number, outcome: BatchOutcome<T, R>) => {
    outcomes[index] = outcome;
    onSettle?.(outcome, index);
  };

  const worker = async () => {
    // Walks an index, not the item, so a falsy item doesn't end the run.
    while (cursor < items.length && !signal?.aborted) {
      const index = cursor;
      cursor += 1;
      const item = items[index];
      onStart?.(item, index);
      try {
        settle(index, { status: "fulfilled", item, value: await perform(item) });
      } catch (error) {
        settle(index, { status: "rejected", item, error });
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  for (; cursor < items.length; cursor += 1) {
    settle(cursor, { status: "cancelled", item: items[cursor] });
  }
  return outcomes;
}
