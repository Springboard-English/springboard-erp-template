import { describe, expect, it } from "vitest";

import {
  IMPORT_NEW_TEST,
  IMPORT_NO_TEST,
  importSaveReady,
} from "./save-import-dialog";
import type { TestScope } from "./test-scope-fields";

// The two import modes each forbid what the other is for, and this predicate is
// the only place that is enforced before anything is written: an exercise import
// must be tagged, a test import must actually reach a test. Both rules are about
// what a teacher CAN'T recover from afterwards — an untagged loose question is
// unfindable, and a "test" that stopped at the library is one nobody can sit.

const GROUP_SCOPE: TestScope = { area: "group", groupKey: "grp_1" };

function ready(over: Partial<Parameters<typeof importSaveReady>[0]>) {
  return importSaveReady({
    mode: "tests",
    testKey: IMPORT_NEW_TEST,
    newTestName: "Reading Practice 8",
    newTestScope: GROUP_SCOPE,
    tags: [],
    ...over,
  });
}

describe("importSaveReady", () => {
  describe("an exercise import", () => {
    it("needs a tag", () => {
      expect(ready({ mode: "exercises", tags: [] })).toBe(false);
      expect(ready({ mode: "exercises", tags: ["b2"] })).toBe(true);
    });

    it("needs a scope too, and it is the more load-bearing of the two", () => {
      // A library import has no test to inherit reach from, so without this
      // every part it writes is readable by its author and nobody else. A tag
      // makes a question findable;
      // this is what makes the passage openable at all.
      expect(
        ready({ mode: "exercises", tags: ["b2"], newTestScope: null }),
      ).toBe(false);
      // Incomplete counts as absent: the picker holds an area before it holds
      // a key, and half a scope resolves to no tuple.
      expect(
        ready({
          mode: "exercises",
          tags: ["b2"],
          newTestScope: { area: "group", groupKey: "" },
        }),
      ).toBe(false);
    });

    it("ignores the TEST destination — it has no picker for one", () => {
      // Whatever the destination state is left holding, the mode decides. The
      // scope is not part of that: in this mode it parents the parts rather
      // than a test, so it is read even though `testKey` is not.
      expect(
        ready({ mode: "exercises", tags: ["b2"], testKey: IMPORT_NO_TEST }),
      ).toBe(true);
      expect(
        ready({
          mode: "exercises",
          tags: ["b2"],
          testKey: IMPORT_NEW_TEST,
          newTestName: "",
        }),
      ).toBe(true);
    });
  });

  describe("a test import", () => {
    it("refuses to stop at the library", () => {
      expect(ready({ testKey: IMPORT_NO_TEST })).toBe(false);
      // Even fully tagged: tags are not the missing thing here.
      expect(ready({ testKey: IMPORT_NO_TEST, tags: ["b2"] })).toBe(false);
    });

    it("takes an existing test as-is", () => {
      expect(ready({ testKey: "tst_42" })).toBe(true);
    });

    it("needs a name and a scope for a new test", () => {
      expect(ready({ newTestName: "  " })).toBe(false);
      expect(ready({ newTestScope: null })).toBe(false);
      expect(ready({ newTestScope: { area: "group", groupKey: "" } })).toBe(false);
      expect(ready({})).toBe(true);
    });

    it("does not require tags", () => {
      expect(ready({ tags: [] })).toBe(true);
    });
  });
});
