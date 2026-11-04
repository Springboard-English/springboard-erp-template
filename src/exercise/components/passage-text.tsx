import { Fragment, type ReactNode } from "react";

import { showGapTokens } from "../lib/gap-token";
import { parseMarkup } from "../lib/passage-markup";

// One passage paragraph, drawn. Every prose rendering of a part's or section's
// passage goes through here so that they agree on two things: `{gap}` prints as
// a ruled blank, and the teacher's `**bold**` / `*italic*` / `__underline__`
// print as styling rather than as punctuation.
//
// The two have to happen in this order and in this one place. Markup is parsed
// against the RAW text and the gap tokens are printed inside each span
// afterwards — done the other way round, `{gap}` would already have become
// `______` and the underline mark would latch onto the ruled line (see
// lib/passage-markup.ts).
//
// The explicit classes rather than the browser's defaults for `strong`/`em`/`u`:
// preflight reweights `strong`, and a passage that reads as bold in one place
// and bolder in another is the kind of thing nobody reports.
export function PassageText({ text }: { text: string }) {
  return (
    <>
      {parseMarkup(text).map((span, index) => {
        let node: ReactNode = showGapTokens(span.text);
        if (span.italic) node = <em className="italic">{node}</em>;
        if (span.bold) node = <strong className="font-bold">{node}</strong>;
        if (span.underline)
          node = <u className="underline underline-offset-2">{node}</u>;
        return <Fragment key={index}>{node}</Fragment>;
      })}
    </>
  );
}
