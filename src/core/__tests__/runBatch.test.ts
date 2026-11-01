import { describe, expect, it, vi } from "vitest";
import { runBatch } from "../runBatch";

describe("runBatch", () => {
  it("never exceeds the concurrency and returns outcomes in item order", async () => {
    let inFlight = 0;
    let peak = 0;
    const outcomes = await runBatch(
      [3, 1, 2, 0],
      async (delay) => {
        inFlight += 1;
        peak = Math.max(peak, inFlight);
        await new Promise((resolve) => setTimeout(resolve, delay));
        inFlight -= 1;
        return delay * 2;
      },
      { concurrency: 2 },
    );
    expect(peak).toBe(2);
    expect(outcomes.map((outcome) => outcome.status === "fulfilled" && outcome.value)).toEqual([6, 2, 4, 0]);
  });

  it("keeps the thrown error untouched and carries on", async () => {
    const failure = Object.assign(new Error("gone"), { status: 404 });
    const outcomes = await runBatch(["a", "b"], async (item) => {
      if (item === "a") throw failure;
      return item;
    });
    expect(outcomes[0]).toEqual({ status: "rejected", item: "a", error: failure });
    expect(outcomes[1]).toEqual({ status: "fulfilled", item: "b", value: "b" });
  });

  it("does not stop at a falsy item", async () => {
    const perform = vi.fn(async (item: number) => item);
    await runBatch([0, 1], perform, { concurrency: 1 });
    expect(perform).toHaveBeenCalledTimes(2);
  });

  it("marks undispatched items cancelled after an abort", async () => {
    const controller = new AbortController();
    const outcomes = await runBatch(
      ["a", "b", "c"],
      async (item) => {
        controller.abort();
        return item;
      },
      { concurrency: 1, signal: controller.signal },
    );
    expect(outcomes.map((outcome) => outcome.status)).toEqual(["fulfilled", "cancelled", "cancelled"]);
  });

  it("clamps a concurrency below one and handles no items", async () => {
    expect(await runBatch([], async () => 1)).toEqual([]);
    const outcomes = await runBatch([1], async (item) => item, { concurrency: 0 });
    expect(outcomes[0].status).toBe("fulfilled");
  });
});
