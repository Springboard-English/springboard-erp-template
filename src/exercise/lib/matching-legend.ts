// Whether a multiple matching prints its "Choose from" legend above the rows.
//
// The legend is the ONLY place a matching's choices are spelled out: the rows are
// bare A-F buttons, and the text lives on the options, copied onto every question.
// A passage on the page is not enough reason to hide it. The passage IS the
// lettered list for one kind of matching only: "which section A-E mentions…",
// where the choices are the passage's own labelled sections and extraction
// stores each label as just its letter. For headings, names or features the
// choices are separate text, the passage is the article they are matched
// against, and hiding the legend would leave a student with "Paragraph 4" and
// six letters that mean nothing.
//
// So the labels decide, not the passage: the legend is dropped only when a passage
// is showing AND every label is its bare letter, where it could add nothing.

// "A", "B.", "(C)", "d)", and roman numerals — a label that is only its marker.
const BARE_LETTER = /^\(?(?:[a-z]|[ivx]{1,4})\)?[.):]?$/i;

/** True when no option carries any text beyond its letter. */
export function labelsAreBareLetters(options: Array<{ label: string }>): boolean {
  return options.every((option) => BARE_LETTER.test(option.label.trim()));
}

export function showMatchingLegend(
  options: Array<{ label: string }>,
  hasPassage: boolean,
): boolean {
  return !hasPassage || !labelsAreBareLetters(options);
}
