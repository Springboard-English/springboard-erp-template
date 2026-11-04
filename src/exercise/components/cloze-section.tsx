import { Input } from "../../components/ui/input";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { GAP_TOKEN_SOURCE } from "../lib/gap-token";
import {
  rootedAnswer,
  rootedValue,
  type ExerciseAnswer,
  type ExerciseNode,
} from "../lib/exercises";
import { optionLetters } from "../lib/option-letters";
import { EXAM_FIELD_PROPS } from "../lib/exam-field";

import { RootPick } from "./root-pick";

// A run of gap-filling questions rendered as ONE cloze paragraph, with each
// question's input dropped inline where its blank belongs.
//
// The full paragraph is the section's own passage (the summary/cloze text) —
// which carries the words BETWEEN the blanks that a bare before/after pair would
// lose. Each question's `before`/`after` only ANCHORS its input into that
// passage, best-effort:
//   1. find `before` (place the input right after it, skipping the printed ____),
//   2. else find `after` (place the input right before it),
// each tried with progressively shorter fragments (the words nearest the blank)
// so a near-miss still lands. Only a gap that matches NEITHER before nor after
// falls back to a stacked row in a dedicated section. With no passage at all we
// reconstruct the text from the before/after pairs.
// A gap-family blank (the student types) OR a guided-cloze blank (the student
// picks from options printed for THAT blank). Both live inside one passage and
// need the same placement, which is the hard part — so they share this component
// and differ only in what is drawn at the blank.
export type ClozeNode = Extract<
  ExerciseNode,
  { type: "gap-filling" | "rewriting" | "mcq" }
>;

function isChoice(
  node: ClozeNode,
): node is Extract<ExerciseNode, { type: "mcq" }> {
  return node.type === "mcq";
}

// A guided-cloze blank carries no before/after — its position in the passage
// comes from the token alone. These keep the anchoring fallbacks (which only
// ever apply to gap-family blanks) from having to know that.
const beforeOf = (node: ClozeNode) => (isChoice(node) ? "" : node.content.before ?? "");
const afterOf = (node: ClozeNode) => (isChoice(node) ? "" : node.content.after ?? "");

type Segment = { text: string } | { gap: number };

// A printed blank run: 2+ underscores, an ellipsis run, or 3+ dots.
const BLANK_RUN = "(?:_{2,}|\\u2026+|\\.{3,})";
// A blank optionally tagged with its question number — "(46) ____", "46. ___",
// "46) ___" — capturing the number so an input can be placed by number.
const NUMBERED_BLANK = new RegExp(
  `(?:\\(\\s*(\\d+)\\s*\\)|(\\d+)\\s*[.)])?\\s*${BLANK_RUN}`,
  "g",
);
// The same blank at the start (after a `before` anchor) or end (before `after`),
// tolerating a leading "(46)" tag, for the fallback anchor path.
const BLANK_HEAD = new RegExp(
  `^\\s*(?:\\(?\\s*\\d+\\s*\\)?[.)]?\\s*)?${BLANK_RUN}\\s*`,
);
const BLANK_TAIL = new RegExp(
  `\\s*(?:\\(?\\s*\\d+\\s*\\)?[.)]?\\s*)?${BLANK_RUN}\\s*$`,
);
const MIN_ANCHOR = 3;

/**
 * Place each input at its PRINTED blank in the passage, matched by the number
 * tagged on the blank ("(46) ____" → question 46), falling back to sequential
 * order for an untagged blank. Accurate and deterministic — used whenever the
 * passage actually prints its blanks. Returns `count: 0` when it finds none, so
 * the caller can fall back to before/after anchoring.
 */
function buildByMarkers(
  passage: string,
  nodes: ClozeNode[],
  numbers: number[],
): { segments: Segment[]; unplaced: number[]; count: number } {
  const byNumber = new Map(numbers.map((n, index) => [n, index]));
  const segments: Segment[] = [];
  const placed = new Set<number>();
  const re = new RegExp(NUMBERED_BLANK.source, "g");
  let last = 0;
  let seq = 0;
  let count = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(passage)) !== null) {
    if (match[0].trim().length === 0) continue;
    count += 1;
    const tagged = match[1] ?? match[2];
    let index =
      tagged !== undefined ? byNumber.get(Number(tagged)) : undefined;
    if (index === undefined || placed.has(index)) {
      while (seq < nodes.length && placed.has(seq)) seq += 1;
      index = seq < nodes.length ? seq : undefined;
    }
    if (index === undefined) continue; // more blanks than questions — leave it
    segments.push({ text: passage.slice(last, match.index) });
    segments.push({ gap: index });
    placed.add(index);
    last = match.index + match[0].length;
  }
  segments.push({ text: passage.slice(last) });
  const unplaced = nodes
    .map((_, index) => index)
    .filter((index) => !placed.has(index));
  return { segments, unplaced, count };
}

/**
 * Locate an anchor fragment in `lower` at/after `cursor`, trying the full text
 * then ever-shorter slices taken from the end of `edge` (the words nearest the
 * blank). Returns the match's [start, end); null if nothing specific enough hits.
 */
function locate(
  lower: string,
  cursor: number,
  fromEnd: boolean,
  edge: string,
): { at: number; end: number } | null {
  const words = edge.split(/\s+/).filter(Boolean);
  for (let k = words.length; k >= 1; k -= 1) {
    // `before` keeps its tail (nearest the blank); `after` keeps its head.
    const fragment = (fromEnd ? words.slice(words.length - k) : words.slice(0, k)).join(" ");
    if (fragment.length < MIN_ANCHOR) continue;
    const at = lower.indexOf(fragment.toLowerCase(), cursor);
    if (at !== -1) return { at, end: at + fragment.length };
  }
  return null;
}

// Passages that don't print their blanks: place inputs by matching each
// question's before/after against the text (best-effort, progressively shorter).
function buildByAnchors(
  passage: string,
  nodes: ClozeNode[],
): { segments: Segment[]; unplaced: number[] } {
  const lower = passage.toLowerCase();
  const segments: Segment[] = [];
  const placed = new Set<number>();
  let cursor = 0;

  nodes.forEach((node, index) => {
    const before = beforeOf(node).trim();
    const after = afterOf(node).trim();

    // 1) Anchor on `before`: input lands right after the matched tail.
    const b = before ? locate(lower, cursor, true, before) : null;
    if (b) {
      segments.push({ text: passage.slice(cursor, b.end) });
      segments.push({ gap: index });
      placed.add(index);
      const marker = BLANK_HEAD.exec(passage.slice(b.end));
      cursor = b.end + (marker ? marker[0].length : 0);
      return;
    }

    // 2) Else anchor on `after`: input lands right before the matched head,
    //    with any printed blank just before it absorbed so it isn't left over.
    const a = after ? locate(lower, cursor, false, after) : null;
    if (a) {
      const head = passage.slice(cursor, a.at);
      const trailing = BLANK_TAIL.exec(head);
      const textEnd = trailing ? a.at - trailing[0].length : a.at;
      segments.push({ text: passage.slice(cursor, textEnd) });
      segments.push({ gap: index });
      placed.add(index);
      cursor = a.at; // `after` renders as the next literal
      return;
    }

    // 3) Neither matched — leave it for the dedicated fallback section.
  });

  segments.push({ text: passage.slice(cursor) });
  const unplaced = nodes
    .map((_, index) => index)
    .filter((index) => !placed.has(index));
  return { segments, unplaced };
}

// The deterministic contract: the API emits one canonical gap token per blank
// (see extraction), in question order. Split on it and fill in order — no
// heuristics. The pattern is shared with `lib/gap-token.ts` rather than written
// twice, so the two cannot drift apart.

function buildByTokens(
  passage: string,
  nodes: ClozeNode[],
): { segments: Segment[]; unplaced: number[]; count: number } {
  const segments: Segment[] = [];
  const placed = new Set<number>();
  const re = new RegExp(GAP_TOKEN_SOURCE, "gi");
  let last = 0;
  let seq = 0;
  let count = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(passage)) !== null) {
    count += 1;
    if (seq >= nodes.length) continue; // more tokens than questions
    segments.push({ text: passage.slice(last, match.index) });
    segments.push({ gap: seq });
    placed.add(seq);
    last = match.index + match[0].length;
    seq += 1;
  }
  segments.push({ text: passage.slice(last) });
  const unplaced = nodes
    .map((_, index) => index)
    .filter((index) => !placed.has(index));
  return { segments, unplaced, count };
}

// Place inputs into the passage, best deterministic path first:
//   1. `{gap}` tokens (the API's canonical contract),
//   2. printed blanks tagged with their number, or bare underscores (legacy /
//      already-extracted data),
//   3. before/after anchoring when the passage prints no blanks at all.
function buildCloze(
  passage: string,
  nodes: ClozeNode[],
  numbers: number[],
): { segments: Segment[]; unplaced: number[] } {
  const byTokens = buildByTokens(passage, nodes);
  if (byTokens.count > 0) return byTokens;
  const byMarkers = buildByMarkers(passage, nodes, numbers);
  if (byMarkers.count > 0) return byMarkers;
  return buildByAnchors(passage, nodes);
}

export function ClozeSection({
  passage,
  nodes,
  numbers,
  answers,
  onChange,
  mode = "practice",
  rootBank = null,
}: {
  /** The section's cloze passage (paragraphs). Empty → reconstruct from before/after. */
  passage: string[] | null;
  nodes: ClozeNode[];
  /** 1-based question number per node, shown on its blank. */
  numbers: number[];
  answers: Record<string, ExerciseAnswer>;
  onChange: (nodeId: string, value: ExerciseAnswer) => void;
  mode?: "practice" | "result";
  /** A banked word-formation's bank: each blank picks its root before the word. */
  rootBank?: string[] | null;
}) {
  const { t } = useI18n();
  const blank = (index: number) => {
    const node = nodes[index];
    const raw = answers[node.id];
    const { root, word: value } = rootedAnswer(raw);

    // A guided cloze prints its options under the blank, so the blank is a
    // select. Each one carries its OWN options (unlike gapped-text, where the
    // whole section shares a pool), so they come off the node.
    if (isChoice(node)) {
      const options = node.content.options ?? [];
      const chosen = node.content.correct_option_id;
      const isCorrect = mode === "result" && value === chosen;
      return (
        <span className="mx-0.5 inline-flex items-center align-middle">
          <span className="mr-1 grid size-5 shrink-0 place-items-center rounded-full bg-rose-100 text-[10px] font-extrabold text-rose-700">
            {numbers[index]}
          </span>
          <select
            value={value}
            disabled={mode === "result"}
            onChange={(event) => onChange(node.id, event.target.value)}
            className={cn(
              "inline-flex h-8 max-w-[16rem] shrink-0 rounded-sm border-2 bg-card px-2 py-0.5 text-[inherit] font-bold",
              mode === "result" &&
                (isCorrect
                  ? "border-success bg-success-bg text-mint-700"
                  : "border-error bg-error-bg text-error"),
            )}
          >
            <option value="">{t("exercise.renderer.chooseOption", "— choose —")}</option>
            {options.map((option, i) => (
              <option key={option.id} value={option.id}>
                {optionLetters(options)[i]}. {option.label}
              </option>
            ))}
          </select>
        </span>
      );
    }

    const correct = node.content.accepted_answers?.[0];
    const isCorrect =
      mode === "result" &&
      correct !== undefined &&
      value.trim().toLowerCase() === correct.toLowerCase();
    const keyedRoot = node.content.root;
    // With a bank the answer is `{ root, word }`; without, the word alone.
    const emit = (nextRoot: string, nextWord: string) =>
      onChange(node.id, rootBank ? rootedValue(nextRoot, nextWord) : nextWord);
    return (
      <span className="mx-0.5 inline-flex items-center align-middle">
        <span className="mr-1 grid size-5 shrink-0 place-items-center rounded-full bg-rose-100 text-[10px] font-extrabold text-rose-700">
          {numbers[index]}
        </span>
        {rootBank ? (
          <RootPick
            bank={rootBank}
            value={root}
            disabled={mode === "result"}
            verdict={
              mode === "result" && keyedRoot !== undefined
                ? root.toLowerCase() === keyedRoot.toLowerCase()
                : undefined
            }
            onChange={(next) => emit(next, value)}
          />
        ) : null}
        <Input
          {...EXAM_FIELD_PROPS}
          value={value}
          // The number badge already labels the blank, so the input stays clean.
          disabled={mode === "result"}
          onChange={(event) => emit(root, event.target.value)}
          size={Math.max(value.length, 6)}
          className={cn(
            "field-sizing-content inline-flex h-8 w-auto min-w-[90px] max-w-full shrink-0 rounded-sm border-2 bg-card px-2 py-0.5 text-center text-[inherit] font-bold",
            mode === "result" &&
              (isCorrect
                ? "border-success bg-success-bg text-mint-700"
                : "border-error bg-error-bg text-error"),
          )}
        />
        {/* A paragraph-shape word formation prints its words down the margin,
            one per blank — so the word belongs HERE, beside its own input, not
            in a bank under the passage. `InlineBlank` draws the same chip for
            the sentence-shape run; both read off `content.given_word`, because
            which shape the paper used is presentation and not the task. */}
        {/* Not beside a root picker: there the given word IS the root. */}
        {!isChoice(node) && node.content.given_word && !rootBank ? <span className="ml-1 inline-flex items-center rounded-sm border-2 border-lav-300 bg-lav-bg px-1.5 py-0 align-middle text-[10px] font-extrabold text-lav-700">{node.content.given_word}</span> : null}
      </span>
    );
  };

  const text = (passage ?? []).join("\n\n").trim();

  const wrapper = "rounded-2xl border bg-card p-5 text-[15px] leading-[2.4] text-foreground shadow-sm sm:p-7";

  // No passage: reconstruct the sentence from each gap's before/after.
  if (!text) {
    return (
      <div className={wrapper}>
        {nodes.map((node, index) => (
          <span key={node.id}>
            {/* A run of separate sentences can print one to transform above an
                item, as `InlineBlank` does; a passage has nowhere to put it. */}
            {!isChoice(node) && node.content.source_sentence ? (
              <span className="block text-sm leading-6 text-muted-foreground">
                {node.content.source_sentence}
              </span>
            ) : null}
            {beforeOf(node) ? <>{beforeOf(node)} </> : null}
            {blank(index)}
            {afterOf(node) ? <> {afterOf(node)}</> : null}{" "}
          </span>
        ))}
      </div>
    );
  }

  const { segments, unplaced } = buildCloze(text, nodes, numbers);

  return (
    <div className="space-y-4">
      <div className={cn(wrapper, "whitespace-pre-wrap")}>
        {segments.map((segment, k) =>
          "text" in segment ? (
            <span key={k}>{segment.text}</span>
          ) : (
            <span key={k}>{blank(segment.gap)}</span>
          ),
        )}
      </div>

      {/* Gaps whose anchor wasn't found in the passage still need answering. */}
      {unplaced.length ? (
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <p className="mb-3 text-[11px] font-extrabold text-muted-foreground">
            {t("exercise.renderer.alsoComplete", "Also complete")}
          </p>
          <div className="space-y-3 text-[15px] leading-9 text-foreground">
            {unplaced.map((index) => (
              <div key={nodes[index].id}>
                {beforeOf(nodes[index]) ? <>{beforeOf(nodes[index])} </> : null}
                {blank(index)}
                {afterOf(nodes[index]) ? <> {afterOf(nodes[index])}</> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
