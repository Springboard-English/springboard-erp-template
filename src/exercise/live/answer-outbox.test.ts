import { describe, expect, it } from "vitest";

import { AnswerOutbox, createAnswerSender } from "./answer-outbox";

describe("AnswerOutbox", () => {
  it("offers a changed answer, and not while it is on its way", () => {
    const outbox = new AnswerOutbox();
    outbox.change("q1");
    expect(outbox.next()).toBe("q1");
    outbox.start("q1");
    expect(outbox.next()).toBeNull();
  });

  it("saves only the version a send carried", () => {
    // An edit made while the send was in flight must not be cleared by it.
    const outbox = new AnswerOutbox();
    outbox.change("q1");
    const version = outbox.start("q1");
    outbox.change("q1");
    outbox.settle("q1", version, true);
    expect(outbox.isSaved("q1")).toBe(false);
    expect(outbox.next()).toBe("q1");
  });

  it("keeps a failed answer unsaved", () => {
    const outbox = new AnswerOutbox();
    outbox.change("q1");
    outbox.settle("q1", outbox.start("q1"), false);
    expect(outbox.unsaved()).toEqual(["q1"]);
  });

  it("treats an answer it never saw change as saved", () => {
    // Restored from the server after a refresh.
    expect(new AnswerOutbox().isSaved("q1")).toBe(true);
  });

  it("makes a resend send a saved answer again", () => {
    const outbox = new AnswerOutbox();
    outbox.change("q1");
    outbox.settle("q1", outbox.start("q1"), true);
    expect(outbox.isSaved("q1")).toBe(true);
    outbox.resend(["q1", "q2"]);
    expect(outbox.unsaved()).toEqual(["q1", "q2"]);
  });
});

/** A send the test resolves by hand, recording what was in flight. */
function manualSend() {
  const pending = new Map<string, Array<{ resolve: () => void; reject: () => void }>>();
  let inFlight = 0;
  let maxInFlight = 0;
  // The invariant under concurrency: one question, one request.
  const inFlightIds = new Set<string>();
  let doubleSent = false;
  const sent: string[] = [];
  const send = (id: string) =>
    new Promise<void>((resolve, reject) => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      if (inFlightIds.has(id)) doubleSent = true;
      inFlightIds.add(id);
      sent.push(id);
      const done = (fn: () => void) => () => {
        inFlight -= 1;
        inFlightIds.delete(id);
        fn();
      };
      pending.set(id, [...(pending.get(id) ?? []), { resolve: done(resolve), reject: done(reject) }]);
    });
  const settle = async (id: string, ok = true) => {
    const next = pending.get(id)?.shift();
    if (!next) throw new Error(`no send in flight for ${id}`);
    if (ok) next.resolve();
    else next.reject();
    // Let the sender's loop move on.
    await new Promise((r) => setTimeout(r, 0));
  };
  return {
    send,
    settle,
    sent,
    maxInFlight: () => maxInFlight,
    doubleSent: () => doubleSent,
  };
}

describe("createAnswerSender", () => {
  it("never sends one question twice at once, whoever asks", async () => {
    const outbox = new AnswerOutbox();
    const wire = manualSend();
    const sender = createAnswerSender(outbox, wire.send);
    outbox.change("q1");
    outbox.change("q2");

    const autosave = sender.drain();
    const pageMove = sender.drain();
    await new Promise((r) => setTimeout(r, 0));
    await wire.settle("q1");
    await wire.settle("q2");
    await expect(autosave).resolves.toEqual({ saved: true, failures: 0, stalled: 0 });
    await expect(pageMove).resolves.toEqual({ saved: true, failures: 0, stalled: 0 });

    expect(wire.doubleSent()).toBe(false);
    // The second caller found nothing left to send.
    expect(wire.sent).toEqual(["q1", "q2"]);
  });

  it("sends several at once, and never more than the bound", async () => {
    const outbox = new AnswerOutbox();
    const wire = manualSend();
    const sender = createAnswerSender(outbox, wire.send, { concurrency: 3 });
    for (const id of ["q1", "q2", "q3", "q4"]) outbox.change(id);

    const run = sender.drain();
    await new Promise((r) => setTimeout(r, 0));
    expect(wire.sent).toEqual(["q1", "q2", "q3"]);

    // The fourth leaves as soon as one of the three comes back.
    await wire.settle("q1");
    expect(wire.sent).toEqual(["q1", "q2", "q3", "q4"]);
    await wire.settle("q2");
    await wire.settle("q3");
    await wire.settle("q4");

    await expect(run).resolves.toEqual({ saved: true, failures: 0, stalled: 0 });
    expect(wire.maxInFlight()).toBe(3);
  });

  it("sends an edit made mid-send again, in the same run", async () => {
    const outbox = new AnswerOutbox();
    const wire = manualSend();
    const sender = createAnswerSender(outbox, wire.send);
    outbox.change("q1");

    const run = sender.drain();
    await new Promise((r) => setTimeout(r, 0));
    outbox.change("q1");
    await wire.settle("q1");
    await wire.settle("q1");

    await expect(run).resolves.toEqual({ saved: true, failures: 0, stalled: 0 });
    expect(wire.sent).toEqual(["q1", "q1"]);
  });

  it("starts nothing more after a failure unless told to keep going", async () => {
    const outbox = new AnswerOutbox();
    const wire = manualSend();
    const sender = createAnswerSender(outbox, wire.send, { concurrency: 2 });
    for (const id of ["q1", "q2", "q3"]) outbox.change(id);

    const stopping = sender.drain();
    await new Promise((r) => setTimeout(r, 0));
    expect(wire.sent).toEqual(["q1", "q2"]);
    await wire.settle("q1", false);
    // The one already on its way is seen through; q3 never leaves.
    await wire.settle("q2");
    await expect(stopping).resolves.toEqual({ saved: false, failures: 1, stalled: 0 });
    expect(wire.sent).toEqual(["q1", "q2"]);
    expect(outbox.unsaved()).toEqual(["q1", "q3"]);

    const final = sender.drain({ keepGoing: true });
    await new Promise((r) => setTimeout(r, 0));
    await wire.settle("q1", false);
    await wire.settle("q3");
    // Every answer tried once; the refused one is still unsaved.
    await expect(final).resolves.toEqual({ saved: false, failures: 1, stalled: 0 });
    expect(outbox.unsaved()).toEqual(["q1"]);
  });

  it("moves a stuck send to the slow lane and saves the rest", async () => {
    // One request that never comes back must not hold `running` forever, or
    // every later save would queue behind it and send nothing.
    const outbox = new AnswerOutbox();
    const wire = manualSend();
    let lateSettles = 0;
    const sender = createAnswerSender(outbox, wire.send, {
      concurrency: 1,
      stallMs: 20,
      onLateSettle: () => (lateSettles += 1),
    });
    outbox.change("q1");
    outbox.change("q2");

    const run = sender.drain();
    await new Promise((r) => setTimeout(r, 30));
    // q1 is still out; the one worker moved on to q2 regardless.
    expect(wire.sent).toEqual(["q1", "q2"]);
    await wire.settle("q2");
    await expect(run).resolves.toEqual({ saved: false, failures: 0, stalled: 1 });

    // A later run does not wait for it, and does not send q1 a second time.
    outbox.change("q3");
    const next = sender.drain();
    await new Promise((r) => setTimeout(r, 0));
    await wire.settle("q3");
    await expect(next).resolves.toEqual({ saved: false, failures: 0, stalled: 1 });
    expect(wire.doubleSent()).toBe(false);

    // When it does come back, it counts, and the runner is told.
    await wire.settle("q1");
    expect(lateSettles).toBe(1);
    expect(outbox.unsaved()).toEqual([]);
    await expect(sender.drain()).resolves.toEqual({ saved: true, failures: 0, stalled: 0 });
  });

  it("aborts a send that never returns, and sends it again", async () => {
    const outbox = new AnswerOutbox();
    const signals: AbortSignal[] = [];
    // The first send hangs until aborted; the second succeeds.
    const send = (_id: string, signal: AbortSignal) =>
      new Promise<void>((resolve, reject) => {
        signals.push(signal);
        if (signals.length > 1) resolve();
        else signal.addEventListener("abort", () => reject(new Error("aborted")));
      });
    let lateSettles = 0;
    const sender = createAnswerSender(outbox, send, {
      stallMs: 10,
      abortMs: 40,
      onLateSettle: () => (lateSettles += 1),
    });
    outbox.change("q1");

    await expect(sender.drain()).resolves.toEqual({ saved: false, failures: 0, stalled: 1 });
    await new Promise((r) => setTimeout(r, 50));
    expect(signals[0].aborted).toBe(true);
    expect(lateSettles).toBe(1);
    // Aborted is unsaved, and free to go again.
    await expect(sender.drain()).resolves.toEqual({ saved: true, failures: 0, stalled: 0 });
    expect(signals).toHaveLength(2);
  });
});
