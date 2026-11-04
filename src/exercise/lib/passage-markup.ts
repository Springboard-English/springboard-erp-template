// Basic inline markup inside a passage paragraph — the stopgap for the marks
// extraction cannot see.
//
// Some tasks are written against a word that the paper UNDERLINES ("suggest a
// synonym for the underlined word"), and PDF text extraction returns the
// characters without the styling, so the question arrives pointing at a word the
// student cannot pick out. Until extraction carries the marks, a teacher types
// them: this is what turns what they typed back into styling.
//
// FRONTEND ONLY, deliberately. The markers are stored as part of the passage
// text — the API neither knows nor cares — so nothing here needs a migration or
// a new field, and the day extraction learns to emit real marks this can be
// replaced without unpicking a schema.
//
// The grammar is three marks, and no more:
//
//   **bold**      *italic*      __underline__
//
// `__` is UNDERLINE, not the strong emphasis CommonMark makes it. Markdown has
// no underline at all, and underline is the entire reason this exists; giving
// `__` its CommonMark meaning would leave the one mark teachers actually need
// unspellable. Everything else — links, headings, lists — is deliberately absent:
// a passage is prose off a paper, and every character a parser claims is a
// character a teacher can no longer type literally.

/** A textarea's text with the selection to restore after an edit. */
export interface TextEdit {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

/** The markers a toolbar button writes — the same three the parser reads. */
export const MARKUP_MARKERS = { bold: "**", italic: "*", underline: "__" } as const;

/**
 * Wrap the selection in `marker`, or unwrap it when it is already wrapped — so
 * a toolbar button toggles, the way it does in any editor. With nothing
 * selected it inserts an empty pair and leaves the cursor between them.
 */
export function toggleMarkup(
  text: string,
  start: number,
  end: number,
  marker: string,
): TextEdit {
  const size = marker.length;
  const wrapped =
    text.slice(start - size, start) === marker && text.slice(end, end + size) === marker;
  if (wrapped) {
    return {
      text: text.slice(0, start - size) + text.slice(start, end) + text.slice(end + size),
      selectionStart: start - size,
      selectionEnd: end - size,
    };
  }
  return {
    text: text.slice(0, start) + marker + text.slice(start, end) + marker + text.slice(end),
    selectionStart: start + size,
    selectionEnd: end + size,
  };
}

/** Replace the selection with `insert`, leaving the cursor just after it. */
export function insertText(text: string, start: number, end: number, insert: string): TextEdit {
  const at = start + insert.length;
  return { text: text.slice(0, start) + insert + text.slice(end), selectionStart: at, selectionEnd: at };
}

export interface MarkupSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

type Style = Omit<MarkupSpan, "text">;

const MARKS = [
  // Longest first: `**` has to be tried before `*`, or every bold opener would
  // parse as an empty italic.
  { open: "**", flag: "bold" },
  { open: "__", flag: "underline" },
  { open: "*", flag: "italic" },
] as const satisfies readonly { open: string; flag: keyof Style }[];

interface Mark {
  flag: keyof Style;
  content: string;
  /** Index just past the closing delimiter. */
  end: number;
}

/**
 * A mark opening at `at`, or null if what is there is ordinary text.
 *
 * The rejections are what keep a reading passage readable. A run of the
 * delimiter longer than the mark itself is never a mark — a gapped text prints
 * its holes as `______`, so `__` matching into a ruled line would underline the
 * words BETWEEN two blanks and eat half of each. Content that is empty, that
 * starts or ends with a space, or that crosses a line break is rejected for the
 * same reason CommonMark rejects it: a lone `*` in prose ("2 * 3", a footnote
 * star) must stay a lone `*` rather than swallowing the rest of the paragraph.
 */
function markAt(text: string, at: number): Mark | null {
  for (const { open, flag } of MARKS) {
    if (!text.startsWith(open, at)) continue;
    const delimiter = open[0];
    if (text[at - 1] === delimiter || text[at + open.length] === delimiter) continue;

    // The first close that yields usable content; a rejected one is not the end
    // of the mark, so keep looking rather than giving up on the opener.
    let from = at + open.length;
    for (;;) {
      const close = text.indexOf(open, from);
      if (close < 0) break;
      if (text[close - 1] === delimiter || text[close + open.length] === delimiter) {
        from = close + 1;
        continue;
      }
      const content = text.slice(at + open.length, close);
      if (content && !content.includes("\n") && !/^\s|\s$/.test(content)) {
        return { flag, content, end: close + open.length };
      }
      from = close + open.length;
    }
  }
  return null;
}

function parseInto(text: string, style: Style): MarkupSpan[] {
  const spans: MarkupSpan[] = [];
  let plain = "";
  const flush = () => {
    if (plain) spans.push({ text: plain, ...style });
    plain = "";
  };

  let index = 0;
  while (index < text.length) {
    const mark = markAt(text, index);
    if (!mark) {
      plain += text[index];
      index += 1;
      continue;
    }
    flush();
    // Recursive, so `**a __b__**` is bold throughout and underlined in the
    // middle. The content is strictly shorter than what contains it, so this
    // terminates.
    spans.push(...parseInto(mark.content, { ...style, [mark.flag]: true }));
    index = mark.end;
  }
  flush();
  return spans;
}

/**
 * A paragraph as the styled runs it is made of — one span per stretch of text
 * that shares a style, in reading order.
 *
 * Unmarked text comes back as a single unstyled span, so a caller can always
 * render the spans and never has to special-case "no markup". Text is returned
 * VERBATIM apart from the delimiters, which is what lets a caller run
 * `showGapTokens` over each span afterwards.
 */
export function parseMarkup(text: string): MarkupSpan[] {
  return parseInto(text, {});
}
