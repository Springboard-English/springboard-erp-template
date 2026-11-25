import { describe, expect, it } from "vitest";

import { liveEventAction } from "./live-channel";

describe("liveEventAction", () => {
  it("merges a status that carries fields", () => {
    expect(liveEventAction({ type: "status", fields: { status: "live" } }, false)).toBe("apply");
  });

  it("skips only the first connect, and catches up after anything else", () => {
    expect(liveEventAction({ type: "ready" }, true)).toBe("skip");
    expect(liveEventAction({ type: "ready" }, false)).toBe("catch-up");
    expect(liveEventAction({ type: "resync" }, false)).toBe("catch-up");
    expect(liveEventAction({ type: "status" }, false)).toBe("catch-up");
  });
});
