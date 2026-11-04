// How big a question stem should be rendered, given how much of it there is.
//
// Stems vary enormously: "She has ___ finished her homework." is three words,
// while an open-cloze sentence can run to sixty with four blanks in it. A single
// fixed size cannot serve both — the size that makes a short stem read as a
// question makes a long one shout over the passage it is asking about, and the
// generous line-height an inline input needs (so the control doesn't collide
// with the line above) turns a wrapped paragraph into a column of far-apart
// lines.
//
// The scale is the design system's own, not invented here — see
// `knowledge/design-system/13-question-patterns.html`: a short stem is 16px
// bold, a long inline-blank sentence is 15px at line-height 1.9, and body
// passage text is 14.5px at 1.7. The same file is why the inline input inherits
// its size from the sentence (`.iblank { font-size: inherit }`) rather than
// fixing its own — a 16px input inside a 15px sentence sits visibly proud of it.
export type PromptDensity = "short" | "medium" | "long";

// Character counts, not word counts: what pushes a stem onto a fourth line is
// its rendered width, and CJK-free English stems track length closely enough.
const MEDIUM_AT = 80;
const LONG_AT = 200;

/**
 * Total the stem's parts and bucket it. Callers pass every piece that renders on
 * the same line — for a gap-fill that is the text before *and* after the blank,
 * since the blank sits between them in one paragraph.
 */
export function promptDensity(
  ...parts: Array<string | null | undefined>
): PromptDensity {
  const length = parts.reduce(
    (total, part) => total + (part?.trim().length ?? 0),
    0,
  );
  if (length <= MEDIUM_AT) return "short";
  if (length <= LONG_AT) return "medium";
  return "long";
}

// Stems made only of text: the size drops and the weight eases off as the stem
// grows, so a long one reads as a paragraph rather than a headline.
const STATIC_CLASS: Record<PromptDensity, string> = {
  short: "text-base font-bold leading-7",
  medium: "text-[15px] font-bold leading-7",
  long: "text-[15px] font-semibold leading-[1.75]",
};

// Stems with a control (input, word chip) sitting on the text baseline need
// extra leading or the control's border overlaps the line above. It still
// tightens with length: 2.6 is right for one line and a wall of whitespace by
// the fifth.
const INLINE_CLASS: Record<PromptDensity, string> = {
  short: "text-base font-bold leading-[2.4]",
  medium: "text-[15px] font-bold leading-[2.2]",
  long: "text-[15px] font-semibold leading-[1.9]",
};

/**
 * Tailwind classes for a question stem. `inline` is for stems that embed a
 * control in the sentence (gap-fill, word bank); `static` for plain text.
 */
export function promptTextClass(
  density: PromptDensity,
  variant: "static" | "inline" = "static",
): string {
  return variant === "inline" ? INLINE_CLASS[density] : STATIC_CLASS[density];
}
