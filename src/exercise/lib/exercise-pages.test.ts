import { describe, expect, it } from "vitest";

import type { CollectionStub } from "../types";
import { buildPages, pageLayout } from "./exercise-pages";
import type { ExerciseNode } from "./exercises";

// The live runner and the teacher preview both page and lay out through these,
// so a change here changes what a student sits AND what the teacher checked it
// against.

function stub(over: Partial<CollectionStub> = {}): CollectionStub {
  return {
    appsheet_key: "sec-1",
    kind: "section",
    title: null,
    instruction: null,
    passage_title: null,
    passage: null,
    info: null,
    parent: null,
    ...over,
  };
}

function mcq(id: string): ExerciseNode {
  return {
    id,
    type: "mcq",
    skillTag: "reading",
    title: "",
    instruction: "",
    points: 1,
    content: { prompt: "p", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }] },
  } as ExerciseNode;
}

function gap(id: string): ExerciseNode {
  return {
    id,
    type: "gap-filling",
    skillTag: "vocab-grammar",
    title: "",
    instruction: "",
    points: 1,
    content: { before: "She has", after: "finished." },
  } as ExerciseNode;
}

function shortAnswer(id: string): ExerciseNode {
  return {
    id,
    type: "short-answer",
    skillTag: "reading",
    title: "",
    instruction: "",
    points: 1,
    // A prompt and a place to type — a short answer has no blank to sit either
    // side of, so it carries no before/after at all.
    content: { prompt: "Why did the company close?" },
  } as ExerciseNode;
}

function rewriting(id: string): ExerciseNode {
  return {
    id,
    type: "rewriting",
    skillTag: "vocab-grammar",
    title: "",
    instruction: "",
    points: 1,
    content: { before: "Rewrite using DESPITE: It rained, but we went.", after: "" },
  } as ExerciseNode;
}

function errorCorrection(id: string): ExerciseNode {
  return {
    id,
    type: "error-correction",
    skillTag: "vocab-grammar",
    title: "",
    instruction: "",
    points: 1,
    content: { sentence: "She have been here." },
  } as ExerciseNode;
}

function pagesOf(nodes: ExerciseNode[], stubs: Record<string, CollectionStub | null>) {
  return buildPages(nodes, new Map(Object.entries(stubs)));
}

describe("buildPages", () => {
  it("puts a whole section on one page", () => {
    const nodes = [mcq("a"), mcq("b"), mcq("c")];
    const section = stub();
    const pages = pagesOf(nodes, { a: section, b: section, c: section });
    expect(pages).toHaveLength(1);
    expect(pages[0].nodeIndices).toEqual([0, 1, 2]);
  });

  it("gives a standalone question its own page", () => {
    const nodes = [mcq("a"), mcq("b")];
    const pages = pagesOf(nodes, { a: null, b: null });
    expect(pages.map((p) => p.nodeIndices)).toEqual([[0], [1]]);
  });

  it("does not group a question that hangs off a part", () => {
    // Only a SECTION groups. Two questions under one part are two pages —
    // grouping by part would put an entire reading part on a single screen.
    const part = stub({ kind: "part", appsheet_key: "part-1" });
    const pages = pagesOf([mcq("a"), mcq("b")], { a: part, b: part });
    expect(pages.map((p) => p.nodeIndices)).toEqual([[0], [1]]);
  });

  it("starts a new page when the section changes", () => {
    const one = stub({ appsheet_key: "sec-1" });
    const two = stub({ appsheet_key: "sec-2" });
    const pages = pagesOf([mcq("a"), mcq("b"), mcq("c")], { a: one, b: two, c: two });
    expect(pages.map((p) => p.nodeIndices)).toEqual([[0], [1, 2]]);
  });

  it("splits a section that isn't contiguous", () => {
    // Not a supported state — `lib/reorder.ts` keeps a section contiguous — but
    // if one ever arrives interleaved, paging must not silently merge across the
    // intruder and reorder the paper.
    const section = stub();
    const pages = pagesOf([mcq("a"), mcq("b"), mcq("c")], {
      a: section,
      b: null,
      c: section,
    });
    expect(pages.map((p) => p.nodeIndices)).toEqual([[0], [1], [2]]);
  });

  it("returns no pages for no nodes", () => {
    expect(buildPages([], new Map())).toEqual([]);
  });
});

describe("pageLayout", () => {
  it("draws a gap-filling section WITH a passage as one inline cloze", () => {
    const nodes = [gap("a"), gap("b")];
    const section = stub({ passage: ["She has {gap} finished, and he {gap} too."] });
    const [page] = pagesOf(nodes, { a: section, b: section });
    expect(pageLayout(page, nodes).kind).toBe("cloze");
  });

  it("keeps a gap-filling section with NO passage as separate questions", () => {
    // A run of independent gap-fill sentences ("Complete each sentence with the
    // correct form") shares an instruction, not a text. Sent to ClozeSection it
    // would hit the no-passage fallback, which reconstructs each sentence from
    // its before/after inside ONE <div> — so ten sentences would print as a
    // single run-on paragraph. A cloze is a passage with holes; no passage, no cloze.
    const nodes = [gap("a"), gap("b")];
    const [page] = pagesOf(nodes, { a: stub(), b: stub() });
    expect(pageLayout(page, nodes).kind).toBe("questions");
  });

  it("keeps a short-answer section question by question, not as a paragraph", () => {
    // A SAQ has no hole in a printed text — it is a question that stands on its
    // own. Drawn as a cloze it would lose its card, and with no section passage
    // to anchor into (a SAQ run is judged against the PART's reading passage, so
    // its own is empty) the whole run would print as ONE paragraph of stems with
    // inputs between them.
    const nodes = [shortAnswer("a"), shortAnswer("b")];
    const [page] = pagesOf(nodes, { a: stub(), b: stub() });
    expect(pageLayout(page, nodes).kind).toBe("questions");
  });

  it("keeps a rewriting section question by question too", () => {
    // Same reason: a whole sentence to redo, not a blank in a passage.
    const nodes = [rewriting("a"), rewriting("b")];
    const [page] = pagesOf(nodes, { a: stub(), b: stub() });
    expect(pageLayout(page, nodes).kind).toBe("questions");
  });

  it("keeps a lone gap question as a plain question, not a cloze", () => {
    // A standalone gap has no section summary to weave the blanks into.
    const nodes = [gap("a")];
    const [page] = pagesOf(nodes, { a: null });
    expect(pageLayout(page, nodes).kind).toBe("questions");
  });

  it("draws a gapped-text section as the dropdown table", () => {
    const nodes = [mcq("a"), mcq("b")];
    const section = stub({ info: { layout: "gapped-text" } });
    const [page] = pagesOf(nodes, { a: section, b: section });
    expect(pageLayout(page, nodes).kind).toBe("gapped-text");
  });

  it("draws a guided-cloze mcq section as a cloze, not MCQ cards", () => {
    // Each blank prints its own options, but they live inside one passage —
    // split into cards, none of them can be answered.
    const nodes = [mcq("a"), mcq("b")];
    const section = stub({ info: { layout: "guided-cloze" }, passage: ["A {gap} b {gap}."] });
    const [page] = pagesOf(nodes, { a: section, b: section });
    expect(pageLayout(page, nodes).kind).toBe("cloze");
  });

  it("leaves an mcq section with no layout as plain questions", () => {
    const nodes = [mcq("a"), mcq("b")];
    const section = stub({ passage: ["A reading passage."] });
    const [page] = pagesOf(nodes, { a: section, b: section });
    expect(pageLayout(page, nodes).kind).toBe("questions");
  });

  it("merges a multi-select section into one question group", () => {
    // "Choose TWO" is two marks — two mcq questions sharing a stem — so it is a
    // layout over the existing type rather than a type of its own.
    const nodes = [mcq("a"), mcq("b")];
    const section = stub({ info: { layout: "multi-select" } });
    const [page] = pagesOf(nodes, { a: section, b: section });
    expect(pageLayout(page, nodes).kind).toBe("multi-select");
  });

  it("draws a jumbled-paragraph section as its own drag layout", () => {
    const nodes = [mcq("a"), mcq("b"), mcq("c")];
    const section = stub({ info: { layout: "jumbled-paragraph" } });
    const [page] = pagesOf(nodes, { a: section, b: section, c: section });
    expect(pageLayout(page, nodes).kind).toBe("jumbled-paragraph");
  });

  it("keeps the shell narrow for the drag layouts", () => {
    // They draw their own text inline (the passage with its gaps, or the
    // paragraphs themselves), so a side passage column would print it twice.
    const nodes = [mcq("a"), mcq("b")];
    for (const layout of ["gapped-text", "jumbled-paragraph"] as const) {
      const section = stub({ info: { layout }, passage: ["A {gap} passage {gap}."] });
      const [page] = pagesOf(nodes, { a: section, b: section });
      expect(pageLayout(page, nodes).hasPassage).toBe(false);
    }
  });

  it("draws an error-correction section over a passage as the hunt", () => {
    // The teacher's review shows the whole paragraph with every mistake marked;
    // the student must get the same, not one card per sentence, or the two
    // screens disagree about what the exercise is.
    const nodes = [errorCorrection("a"), errorCorrection("b")];
    const section = stub({ passage: ["A passage with two mistakes."] });
    const [page] = pagesOf(nodes, { a: section, b: section });
    const layout = pageLayout(page, nodes);
    expect(layout.kind).toBe("error-hunt");
    // The hunt renders that passage itself, so the shell must not also put it
    // in a side column — that would print it twice.
    expect(layout.hasPassage).toBe(false);
  });

  it("keeps error-correction as plain cards with no passage to hunt in", () => {
    const nodes = [errorCorrection("a")];
    const [page] = pagesOf(nodes, { a: stub() });
    expect(pageLayout(page, nodes).kind).toBe("questions");
  });

  it("still shows a part reading passage beside a hunt", () => {
    const nodes = [errorCorrection("a")];
    const parent = stub({ kind: "part", appsheet_key: "p1", passage: ["Reading."] });
    const section = stub({ passage: ["Hunt in me."], parent });
    const [page] = pagesOf(nodes, { a: section });
    expect(pageLayout(page, nodes).hasPassage).toBe(true);
  });

  it("falls back to plain questions when a section mixes types", () => {
    const nodes = [mcq("a"), gap("b")];
    const section = stub();
    const [page] = pagesOf(nodes, { a: section, b: section });
    expect(pageLayout(page, nodes).kind).toBe("questions");
  });

  describe("hasPassage — whether the shell goes wide", () => {
    it("is true for a passage on the section", () => {
      const nodes = [mcq("a")];
      const [page] = pagesOf(nodes, { a: stub({ passage: ["Text."] }) });
      expect(pageLayout(page, nodes).hasPassage).toBe(true);
    });

    it("is true for a passage inherited from the part", () => {
      const nodes = [mcq("a")];
      const parent = stub({ kind: "part", appsheet_key: "p1", passage: ["Text."] });
      const [page] = pagesOf(nodes, { a: stub({ parent }) });
      expect(pageLayout(page, nodes).hasPassage).toBe(true);
    });

    it("is false for a cloze whose only passage IS the cloze", () => {
      // The section's own text becomes the cloze body, so there is nothing left
      // to show beside it — going wide would leave an empty column.
      const nodes = [gap("a"), gap("b")];
      const section = stub({ passage: ["The summary ____."] });
      const [page] = pagesOf(nodes, { a: section, b: section });
      const layout = pageLayout(page, nodes);
      expect(layout.kind).toBe("cloze");
      expect(layout.hasPassage).toBe(false);
    });

    it("is true for a cloze that also sits under a reading passage", () => {
      const nodes = [gap("a"), gap("b")];
      const parent = stub({ kind: "part", appsheet_key: "p1", passage: ["Reading."] });
      const section = stub({ passage: ["The summary ____."], parent });
      const [page] = pagesOf(nodes, { a: section, b: section });
      expect(pageLayout(page, nodes).hasPassage).toBe(true);
    });

    it("is false with no collection at all", () => {
      const nodes = [mcq("a")];
      const [page] = pagesOf(nodes, { a: null });
      expect(pageLayout(page, nodes).hasPassage).toBe(false);
    });
  });

  describe("a guided cloze with no layout", () => {
    // An import from before the layout existed, or one the API dropped it
    // from, would otherwise fall back to cards with empty prompts beside
    // identical blanks.
    it("draws as a cloze when the passage has one {gap} per question", () => {
      const nodes = [mcq("a"), mcq("b")];
      const section = stub({ passage: ["The delay was {gap} and {gap}."] });
      const [page] = pagesOf(nodes, { a: section, b: section });
      expect(pageLayout(page, nodes).kind).toBe("cloze");
    });

    it("stays questions when the gap count does not match", () => {
      const nodes = [mcq("a"), mcq("b")];
      const section = stub({ passage: ["Only {gap} here."] });
      const [page] = pagesOf(nodes, { a: section, b: section });
      expect(pageLayout(page, nodes).kind).toBe("questions");
    });

    it("never overrides a layout the section names", () => {
      // A gapped text carries {gap} tokens too.
      const nodes = [mcq("a"), mcq("b")];
      const section = stub({
        info: { layout: "gapped-text" },
        passage: ["One {gap} two {gap}."],
      });
      const [page] = pagesOf(nodes, { a: section, b: section });
      expect(pageLayout(page, nodes).kind).toBe("gapped-text");
    });
  });
});
