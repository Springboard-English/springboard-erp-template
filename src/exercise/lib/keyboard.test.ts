import { describe, expect, it, vi } from "vitest";
import type { KeyboardEvent } from "react";

import { ignoreSpaceActivation } from "./keyboard";

// A focused button re-fires on every Space press, so an exam could be walked to
// the end and submitted with a key a student presses constantly while typing.

function press(key: string) {
  const preventDefault = vi.fn();
  ignoreSpaceActivation({ key, preventDefault } as unknown as KeyboardEvent<HTMLElement>);
  return preventDefault;
}

describe("ignoreSpaceActivation", () => {
  it("swallows Space", () => {
    expect(press(" ")).toHaveBeenCalled();
    // Older browsers report the legacy name.
    expect(press("Spacebar")).toHaveBeenCalled();
  });

  it("leaves Enter alone, so the control stays keyboard-operable", () => {
    expect(press("Enter")).not.toHaveBeenCalled();
  });

  it("leaves every other key alone", () => {
    for (const key of ["Tab", "ArrowRight", "a", "Escape"]) {
      expect(press(key)).not.toHaveBeenCalled();
    }
  });
});
