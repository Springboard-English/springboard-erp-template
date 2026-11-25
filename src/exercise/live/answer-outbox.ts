// Which answers the server holds, and the one queue that sends the rest.
//
// The runner sends answers from three places — the autosave, a page move and
// the hand-in — and every one goes through here, so two requests for the same
// question are never in flight at once (the API can answer that with an
// OpenFGA 409 or a duplicate-key 500 for an answer that was in fact saved), and
// answers the server already has are not re-sent.
//
// Pure and DOM-free, so the rules are tested without a browser: see
// answer-outbox.test.ts.

/** The per-question bookkeeping: what changed, what the server confirmed. */
export class AnswerOutbox {
  /** Bumped on every change to a question's answer. */
  private readonly latest = new Map<string, number>();
  /** The version the server last confirmed. */
  private readonly confirmed = new Map<string, number>();
  private readonly inFlight = new Set<string>();

  /** The student changed this answer. */
  change(id: string): void {
    this.latest.set(id, (this.latest.get(id) ?? 0) + 1);
  }

  /**
   * Send these again even though the server may already have them — the final
   * send's precaution. An answer the server confirmed is marked unsaved until
   * it confirms it again.
   */
  resend(ids: Iterable<string>): void {
    for (const id of ids) this.change(id);
  }

  /**
   * The next answer to send: changed since the server last confirmed it, not
   * already on its way, and not in `skip` (the ones that failed this run).
   */
  next(skip: ReadonlySet<string> = new Set()): string | null {
    for (const [id, version] of this.latest) {
      if (
        version > (this.confirmed.get(id) ?? 0) &&
        !this.inFlight.has(id) &&
        !skip.has(id)
      ) {
        return id;
      }
    }
    return null;
  }

  /** A send for `id` is leaving now. Returns the version it carries. */
  start(id: string): number {
    this.inFlight.add(id);
    return this.latest.get(id) ?? 0;
  }

  /**
   * The send carrying `version` came back. A success confirms only that
   * version: an edit made while it was in flight stays unsaved and is sent
   * again.
   */
  settle(id: string, version: number, ok: boolean): void {
    this.inFlight.delete(id);
    if (ok && version > (this.confirmed.get(id) ?? 0)) {
      this.confirmed.set(id, version);
    }
  }

  /**
   * Whether the server holds this answer as it now stands. An answer never
   * changed here — restored from the server after a refresh — is saved.
   */
  isSaved(id: string): boolean {
    return (this.latest.get(id) ?? 0) <= (this.confirmed.get(id) ?? 0);
  }

  unsaved(): string[] {
    return [...this.latest.keys()].filter((id) => !this.isSaved(id));
  }
}

export interface DrainResult {
  /** Nothing is left unsaved. */
  saved: boolean;
  /** How many sends failed in this run. */
  failures: number;
  /** How many sends are still out on the slow lane (see `STALL_MS`). */
  stalled: number;
}

/**
 * How many answer sends may be in flight at once.
 *
 * Bounded, and the bound is per student: at a class deadline every student in
 * the room flushes at the same second, so this is multiplied by thirty against
 * the busiest endpoint the API has. Four is enough to put a forty-question
 * hand-in inside the server's ten-second answer grace with room to spare.
 */
export const SEND_CONCURRENCY = 4;

/**
 * How long a send may hold up the run before it is moved to the slow lane.
 * Under the server's ten-second answer grace, so a stalled send cannot also
 * stall a time-up hand-in past it.
 */
export const STALL_MS = 8_000;

/**
 * When a send on the slow lane is given up on and aborted. Nothing else ends
 * it: there is no fetch timeout anywhere in the chain, and a half-open
 * connection can leave a request pending for minutes.
 */
export const ABORT_MS = 30_000;

export interface AnswerSenderOptions {
  concurrency?: number;
  stallMs?: number;
  abortMs?: number;
  /** A send on the slow lane came back, either way, after its run had ended. */
  onLateSettle?: () => void;
}

const STALLED = Symbol("stalled");

/**
 * The one sender. `drain` sends what `outbox` holds, and every caller shares the
 * run in progress: a second call waits for the first to finish and then sends
 * whatever is still unsaved.
 *
 * Sends go out concurrently, up to `concurrency` of them. A send still pending
 * after `stallMs` moves to the slow lane and stops holding up the run, so one
 * stuck request does not block every save after it.
 */
export function createAnswerSender(
  outbox: AnswerOutbox,
  send: (id: string, signal: AbortSignal) => Promise<void>,
  options: AnswerSenderOptions = {},
) {
  const {
    concurrency = SEND_CONCURRENCY,
    stallMs = STALL_MS,
    abortMs = ABORT_MS,
    onLateSettle,
  } = options;
  let running: Promise<void> | null = null;
  // On the slow lane. Each stays in flight in the outbox until it settles, so
  // an edit to the same question waits for it rather than racing it — which
  // copy the server kept would otherwise be down to arrival order.
  const stalled = new Set<string>();

  /** One send, settled into the outbox. Resolves to whether it saved; never rejects. */
  function sendOnce(id: string, version: number): Promise<boolean> {
    const controller = new AbortController();
    const ceiling = setTimeout(() => controller.abort(), abortMs);
    return send(id, controller.signal).then(
      () => true,
      () => false,
    ).then((ok) => {
      clearTimeout(ceiling);
      outbox.settle(id, version, ok);
      return ok;
    });
  }

  async function run(keepGoing: boolean): Promise<number> {
    const failed = new Set<string>();
    // A failure stops the run from STARTING anything more; sends already on
    // their way are seen through, since there is no calling them back.
    let stopped = false;

    // Each worker claims an answer, sends it, then comes back for the next.
    // Claiming is synchronous — `next` then `start` with no await between — so
    // two workers can never leave carrying the same question.
    async function worker(): Promise<void> {
      while (!stopped) {
        const id = outbox.next(failed);
        if (id === null) return;
        const sending = sendOnce(id, outbox.start(id));
        let timer: ReturnType<typeof setTimeout> | undefined;
        const stall = new Promise<typeof STALLED>((resolve) => {
          timer = setTimeout(() => resolve(STALLED), stallMs);
        });
        const outcome = await Promise.race([sending, stall]);
        clearTimeout(timer);
        if (outcome === STALLED) {
          stalled.add(id);
          void sending.then(() => {
            stalled.delete(id);
            onLateSettle?.();
          });
          continue;
        }
        if (!outcome) {
          failed.add(id);
          if (!keepGoing) stopped = true;
        }
      }
    }

    const workers: Promise<void>[] = [];
    for (let i = 0; i < Math.max(1, concurrency); i += 1) workers.push(worker());
    await Promise.all(workers);
    return failed.size;
  }

  /**
   * Send everything unsaved.
   *
   * By default the first failure ends the run — nothing further is started:
   * the rest are unlikely to get through either, and the caller follows a
   * failure with a room check.
   * `keepGoing` tries every answer once regardless — the final send's rule,
   * where one refused answer must not stop the others reaching the server.
   */
  async function drain(options: { keepGoing?: boolean } = {}): Promise<DrainResult> {
    while (running) await running;
    const task = run(options.keepGoing ?? false);
    const done = task.then(() => undefined);
    running = done;
    try {
      const failures = await task;
      return { saved: outbox.unsaved().length === 0, failures, stalled: stalled.size };
    } finally {
      if (running === done) running = null;
    }
  }

  return { drain };
}
