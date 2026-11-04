import type { KeyboardEvent } from "react";

// Space must not drive the exam.
//
// A `<button>` natively activates on both Enter and Space, and keeps focus after
// a click. In the runner that means: click "Next" once, then every Space press
// advances a page — and on the last page it steps into review, where the same
// press lands on "Submit answers". A student typing answers presses Space
// constantly, so an exam could be walked to the end and finalised by a key they
// never meant to aim at a button.
//
// Enter still activates, so these controls remain fully keyboard-operable;
// Space-to-activate is a browser convention rather than a WCAG requirement, and
// on a control that submits an exam it is a footgun worth giving up. Scoped to
// the runner's navigation and submit controls — ordinary buttons keep it.
export function ignoreSpaceActivation(event: KeyboardEvent<HTMLElement>): void {
  if (event.key === " " || event.key === "Spacebar") {
    event.preventDefault();
  }
}
