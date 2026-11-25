import { describe, expect, it } from "vitest";

import {
  runnerPhase,
  shouldBlockCopying,
  shouldLoadPaper,
  shouldReportProctoring,
  shouldResendHighlights,
  shouldRetrySaves,
  type RunnerPhase,
} from "./live-phase";

function phase(over: Partial<Parameters<typeof runnerPhase>[0]> = {}): RunnerPhase {
  return runnerPhase({
    joinStatus: "live",
    liveStatus: null,
    step: "answer",
    closed: false,
    ...over,
  });
}

describe("runnerPhase", () => {
  it("waits when the join said lobby and nothing has pushed yet", () => {
    // Not the exam paper: the teacher has not started.
    expect(phase({ joinStatus: "lobby" })).toBe("waiting");
  });

  it("keeps waiting when the stream never arrives", () => {
    // The stream blocked or buffered: liveStatus stays null forever and the
    // seed has to be trusted.
    expect(phase({ joinStatus: "lobby", liveStatus: null })).toBe("waiting");
  });

  it("flips into the paper on the stream's push", () => {
    expect(phase({ joinStatus: "lobby", liveStatus: "live" })).toBe("answering");
  });

  it("lets the live doc override a stale join status", () => {
    // The join response is a snapshot; the doc is the running truth.
    expect(phase({ joinStatus: "live", liveStatus: "lobby" })).toBe("waiting");
  });

  it("closes a run that ends while the student is still waiting", () => {
    expect(phase({ joinStatus: "lobby", liveStatus: "ended" })).toBe("closed");
  });

  it("lobby outranks whatever page the student was left on", () => {
    expect(phase({ joinStatus: "lobby", step: "review" })).toBe("waiting");
  });

  it("keeps a submitted student on their confirmation when the run ends", () => {
    // The forced timer auto-ends a few seconds after their own submit; that must
    // not replace the result they just earned with "this challenge has ended".
    expect(phase({ step: "submitted", closed: true })).toBe("submitted");
    expect(phase({ step: "score", closed: true })).toBe("score");
  });

  it("closes an unsubmitted student when the teacher ends the run", () => {
    expect(phase({ closed: true })).toBe("closed");
  });

  it("carries the review step through", () => {
    expect(phase({ step: "review" })).toBe("review");
  });

  it("shows their own time is up on a public link", () => {
    // The room stays `live` forever, so nothing in the status can report this.
    // Without it a reload after expiry hands the paper back and every answer is
    // silently refused by the server.
    expect(phase({ expired: true })).toBe("expired");
  });

  it("treats an ended room as the bigger fact", () => {
    // A class run whose timer ran out is `ended`, and that is what the student
    // should be told — not that they personally ran out of time.
    expect(phase({ expired: true, closed: true })).toBe("closed");
    expect(phase({ expired: true, joinStatus: "ended" })).toBe("closed");
  });

  it("does not take a submitted student back to an expiry screen", () => {
    // They beat the clock. The auto-finish task lands seconds later and must
    // not overwrite the result they just earned.
    expect(phase({ expired: true, step: "submitted" })).toBe("submitted");
    expect(phase({ expired: true, step: "score" })).toBe("score");
  });

  it("is unaffected when nothing sets expired", () => {
    // A caller may omit it; the default must not change a phase.
    expect(phase({})).toBe("answering");
    expect(phase({ expired: false })).toBe("answering");
  });
});

describe("shouldLoadPaper", () => {
  it("does not ask for the paper while waiting", () => {
    // The API answers 403 there, which would render as a broken screen rather
    // than as "not yet".
    expect(shouldLoadPaper("waiting")).toBe(false);
  });

  it("asks once the run is live", () => {
    expect(shouldLoadPaper("answering")).toBe(true);
    expect(shouldLoadPaper("review")).toBe(true);
  });
});

describe("shouldReportProctoring", () => {
  it("reports nothing while waiting", () => {
    // Load-bearing: the waiting room invites the student to leave.
    expect(shouldReportProctoring("waiting")).toBe(false);
  });

  it("reports only while they are actually working", () => {
    expect(shouldReportProctoring("answering")).toBe(true);
    expect(shouldReportProctoring("review")).toBe(true);
    expect(shouldReportProctoring("submitted")).toBe(false);
    expect(shouldReportProctoring("score")).toBe(false);
    expect(shouldReportProctoring("closed")).toBe(false);
    // Charging risk to someone whose exam is already over would manufacture
    // evidence against a student who cannot act on it.
    expect(shouldReportProctoring("expired")).toBe(false);
  });
});

describe("shouldBlockCopying", () => {
  it("blocks wherever the paper is on screen", () => {
    expect(shouldBlockCopying("answering")).toBe(true);
    expect(shouldBlockCopying("review")).toBe(true);
    // Deliberately wider than shouldReportProctoring: the score screen is the
    // paper WITH its answers and explanations.
    expect(shouldBlockCopying("score")).toBe(true);
  });

  it("gives the browser back once there is nothing to copy", () => {
    expect(shouldBlockCopying("waiting")).toBe(false);
    expect(shouldBlockCopying("submitted")).toBe(false);
    expect(shouldBlockCopying("closed")).toBe(false);
    expect(shouldBlockCopying("expired")).toBe(false);
  });
});

describe("shouldResendHighlights", () => {
  it("keeps them through a dropped ping or a server error", () => {
    expect(shouldResendHighlights(undefined)).toBe(true);
    expect(shouldResendHighlights(503)).toBe(true);
  });

  it("drops a map the server refused, so presence keeps working", () => {
    expect(shouldResendHighlights(422)).toBe(false);
  });
});

describe("shouldRetrySaves", () => {
  it("retries while the paper is open", () => {
    expect(shouldRetrySaves("answering")).toBe(true);
    expect(shouldRetrySaves("review")).toBe(true);
  });

  it("stops once the server would refuse every send", () => {
    expect(shouldRetrySaves("waiting")).toBe(false);
    expect(shouldRetrySaves("submitted")).toBe(false);
    expect(shouldRetrySaves("score")).toBe(false);
    expect(shouldRetrySaves("expired")).toBe(false);
    expect(shouldRetrySaves("closed")).toBe(false);
  });
});
