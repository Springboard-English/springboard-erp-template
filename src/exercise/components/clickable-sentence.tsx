import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { tokenizeSentence, type SentenceToken, type WordSpan } from "../lib/error-correction";

/** A run of words drawn as ONE block: a pick, a selection, a marked mistake. */
export type HighlightRun = { span: WordSpan; className: string };

// No underline on a run: across the space between two words it reads as an
// underscore ("more_colder"). The background is the highlight.
const SELECTED_RUN = "bg-lav-bg font-extrabold text-lav-700";

// The sentence, drawn as clickable word tokens. Shared by the student runner
// (where clicks select the error) and the teacher editors (where the same
// clicks mark the answer), so the offsets a teacher stores are byte-identical
// to the ones a student's selection reports — the whole grading contract. A
// click reports one word's offset; the caller builds a span from it
// (`toggleSpanWord`).
//
// A highlighted run is wrapped in one element carrying the colour, rather than
// each word colouring itself — per word, "more colder" would draw as two boxes with
// the space between them a third.
export function ClickableSentence({
  sentence,
  selected,
  runs,
  onSelect,
  disabled,
  className,
  wordClassName,
  wordBadge,
}: {
  sentence: string;
  /** The selected run of words, highlighted as one. */
  selected: WordSpan | null;
  /** Further runs to highlight, each as one block. Earlier runs win an
   * overlap; a later run is clipped to start after them. */
  runs?: HighlightRun[];
  onSelect?: (offset: number) => void;
  disabled?: boolean;
  className?: string;
  /** Extra classes per word outside any run. */
  wordClassName?: (offset: number) => string | undefined;
  /** A small label after a word — an error hunt's row number on the word that
   * row picked. Drawn inside the button, so it never moves an offset. */
  wordBadge?: (offset: number) => ReactNode;
}) {
  const tokens = tokenizeSentence(sentence);
  const allRuns = [
    ...(selected ? [{ span: selected, className: SELECTED_RUN }] : []),
    ...(runs ?? []),
  ];
  // Which run each token belongs to, first come first served.
  const owner = tokens.map(() => -1);
  allRuns.forEach((run, r) => {
    tokens.forEach((token, t) => {
      if (owner[t] === -1 && token.offset >= run.span.start && token.offset < run.span.end) {
        owner[t] = r;
      }
    });
  });

  const renderToken = (token: SentenceToken, index: number, inRun: boolean) => {
    if (!token.isWord) {
      // Preserve the exact spacing/punctuation so offsets keep meaning.
      return (
        <span key={index} style={{ whiteSpace: "pre-wrap" }}>
          {token.text}
        </span>
      );
    }
    const badge = wordBadge?.(token.offset);
    return (
      <button
        key={index}
        type="button"
        disabled={disabled}
        onClick={() => onSelect?.(token.offset)}
        className={cn(
          "underline-offset-4 transition-colors",
          // Inside a run the run draws the background; a word of its own
          // would cut the block back into pieces.
          !inRun && "rounded-sm px-0.5",
          !inRun && !disabled && "cursor-pointer hover:bg-lav-bg",
          inRun && !disabled && "cursor-pointer",
          !inRun && wordClassName?.(token.offset),
        )}
      >
        {token.text}
        {badge !== undefined && badge !== null ? (
          // inline-block, so the word's underline doesn't run through it.
          <sup className="ml-0.5 inline-block rounded bg-lav-500 px-1 text-[10px] leading-4 font-extrabold text-white no-underline">
            {badge}
          </sup>
        ) : null}
      </button>
    );
  };

  const out: ReactNode[] = [];
  for (let t = 0; t < tokens.length; ) {
    const r = owner[t];
    if (r === -1) {
      out.push(renderToken(tokens[t], t, false));
      t += 1;
      continue;
    }
    const start = t;
    while (t < tokens.length && owner[t] === r) t += 1;
    // A run never ends on a gap: trailing punctuation stays outside it.
    let end = t;
    while (end > start && !tokens[end - 1].isWord) end -= 1;
    out.push(
      <span
        key={`run-${start}`}
        // `box-decoration-clone` keeps the block whole on each line a long run
        // wraps onto.
        className={cn("rounded-md px-1 box-decoration-clone", allRuns[r].className)}
      >
        {tokens.slice(start, end).map((token, k) => renderToken(token, start + k, true))}
      </span>,
    );
    for (let k = end; k < t; k += 1) out.push(renderToken(tokens[k], k, false));
  }

  return <p className={cn("text-lg leading-loose text-foreground", className)}>{out}</p>;
}
