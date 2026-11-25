import { describe, expect, it } from "vitest";

import { pasteAllowed } from "./use-copy-guard";

describe("pasteAllowed", () => {
  it("lets the student paste back what they copied from their own writing", () => {
    expect(pasteAllowed("has been living", ["has been living"])).toBe(true);
  });

  it("ignores whitespace, which differs by platform between copy and paste", () => {
    expect(pasteAllowed("First line\r\nsecond  line ", ["First line\nsecond line"])).toBe(true);
  });

  it("refuses text that did not come from the student's own fields", () => {
    // An answer written by a chat assistant, or the passage itself.
    expect(pasteAllowed("has been living", [])).toBe(false);
    expect(pasteAllowed("has been living here", ["has been living"])).toBe(false);
  });

  it("lets an empty paste through, since it carries nothing", () => {
    expect(pasteAllowed("", [])).toBe(true);
    expect(pasteAllowed("  \n", [])).toBe(true);
  });
});
