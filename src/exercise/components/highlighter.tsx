import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Eraser, Highlighter } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { valueLabel } from "../i18n";
import { useExerciseTourAnchor } from "../lib/tour-anchors";
import { useDismissOutside } from "../lib/use-dismiss-outside";
import type { SavedHighlight } from "../types";

// The student's highlighter, for any region of the runner: the reading passage
// and the questions column (instructions, labels, prompts) alike. It is a TOOL:
// the student turns it on and picks a colour in the bottom bar
// (`HighlighterButton`), then a mouse drag highlights on release. A touch or
// keyboard selection has no release to act on — the OS keeps adjusting it — so
// there the selection gets a one-tap chip instead.
//
// Highlights are drawn with the CSS Custom Highlight API so the DOM isn't
// rewritten — no reflow, and selection offsets stay valid. Where the API is
// unavailable, highlighting silently no-ops and the text still reads.
//
// The highlight registry is global per NAME, so several scopes on one page (the
// passage and the questions beside it) cannot each own a colour's entry — the
// last to write would wipe the other's. Scopes keep their own ranges and every
// change repaints each colour from all of them.
//
// Saving: each scope files its highlights under a `scopeKey` as character
// offsets into its text plus the start of the quoted text (`SavedHighlight`),
// and restores them when that key comes back. The provider's owner persists the
// whole map (the runner sends it on its heartbeat).

export const HIGHLIGHT_COLOURS = ["yellow", "green", "blue", "pink"] as const;
export type HighlightColour = (typeof HIGHLIGHT_COLOURS)[number];
/** What a drag does: paint in a colour, or erase what it overlaps. */
export type HighlightTool = HighlightColour | "erase";
export type SavedHighlights = Record<string, SavedHighlight[]>;

const QUOTE_CHARS = 200;
// The API's limit for one attempt: `HeartbeatBody._bounded`.
export const MAX_HIGHLIGHTS = 500;

/** Whether another highlight fits in this attempt's allowance. */
export function hasHighlightRoom(all: SavedHighlights): boolean {
  return Object.values(all).reduce((sum, marks) => sum + marks.length, 0) < MAX_HIGHLIGHTS;
}

type Mark = { colour: HighlightColour; range: Range };

type HighlighterContextValue = {
  on: boolean;
  tool: HighlightTool;
  setOn: (on: boolean) => void;
  setTool: (tool: HighlightTool) => void;
  load: (scopeKey: string) => SavedHighlight[];
  save: (scopeKey: string, marks: SavedHighlight[]) => void;
  hasRoom: () => boolean;
  limitReached: (message: string) => void;
};

// No provider: the tool can never be turned on, so nothing highlights.
const HighlighterContext = createContext<HighlighterContextValue>({
  on: false,
  tool: "yellow",
  setOn: () => undefined,
  setTool: () => undefined,
  load: () => [],
  save: () => undefined,
  hasRoom: () => true,
  limitReached: () => undefined,
});

export function useHighlighterTool() {
  return useContext(HighlighterContext);
}

/**
 * Tool state and saved highlights for one screen. `initial` seeds the saved
 * map; `onChange` receives the whole map after every change. `onLimitReached`
 * shows the translated message when a mark is refused for want of room.
 */
export function HighlighterProvider({
  initial,
  onChange,
  onLimitReached,
  children,
}: {
  initial?: SavedHighlights | null;
  onChange?: (all: SavedHighlights) => void;
  onLimitReached?: (message: string) => void;
  children: ReactNode;
}) {
  const [on, setOn] = useState(false);
  const [tool, setTool] = useState<HighlightTool>("yellow");
  const savedRef = useRef<SavedHighlights>({ ...(initial ?? {}) });
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onLimitReachedRef = useRef(onLimitReached);
  onLimitReachedRef.current = onLimitReached;

  const value = useMemo<HighlighterContextValue>(
    () => ({
      on,
      tool,
      setOn,
      setTool,
      load: (scopeKey) => savedRef.current[scopeKey] ?? [],
      save: (scopeKey, marks) => {
        const next = { ...savedRef.current };
        if (marks.length) next[scopeKey] = marks;
        else delete next[scopeKey];
        savedRef.current = next;
        onChangeRef.current?.(next);
      },
      hasRoom: () => hasHighlightRoom(savedRef.current),
      limitReached: (message) => onLimitReachedRef.current?.(message),
    }),
    [on, tool],
  );

  return <HighlighterContext.Provider value={value}>{children}</HighlighterContext.Provider>;
}

type CSSWithHighlights = {
  highlights?: { set: (name: string, h: unknown) => void; delete: (name: string) => void };
};
type HighlightCtor = new (...ranges: Range[]) => unknown;

const scopes = new Map<symbol, Mark[]>();
// Most recently used last: equal-priority highlights paint in registration
// order, so re-registering puts the colour just applied on top of an overlap.
let paintOrder: HighlightColour[] = [...HIGHLIGHT_COLOURS];

function paint() {
  const registry = (CSS as unknown as CSSWithHighlights).highlights;
  const Ctor = (window as unknown as { Highlight?: HighlightCtor }).Highlight;
  if (!registry || !Ctor) return;
  const all = [...scopes.values()].flat();
  for (const colour of paintOrder) {
    registry.delete(`sb-hl-${colour}`);
    const ranges = all.filter((mark) => mark.colour === colour).map((mark) => mark.range);
    if (ranges.length) registry.set(`sb-hl-${colour}`, new Ctor(...ranges));
  }
}

function supported(): boolean {
  return Boolean(
    (CSS as unknown as CSSWithHighlights).highlights &&
      (window as unknown as { Highlight?: HighlightCtor }).Highlight,
  );
}

// Strict overlap, so a highlight merely touching the selection's edge survives.
// Ranges over nodes React has since detached sit in another tree and throw.
function overlaps(a: Range, b: Range): boolean {
  try {
    return (
      a.compareBoundaryPoints(Range.END_TO_START, b) < 0 &&
      a.compareBoundaryPoints(Range.START_TO_END, b) > 0
    );
  } catch {
    return false;
  }
}

// A boundary's offset into the container's text. `Range.toString()` and
// `textContent` both concatenate every text node in order, so the two agree.
function offsetOf(container: Node, node: Node, offset: number): number {
  const before = document.createRange();
  before.setStart(container, 0);
  before.setEnd(node, offset);
  return before.toString().length;
}

function serialise(container: Node, mark: Mark): SavedHighlight | null {
  const { range } = mark;
  if (range.collapsed || !container.contains(range.commonAncestorContainer)) return null;
  const quote = range.toString().slice(0, QUOTE_CHARS);
  if (!quote.trim()) return null;
  return {
    colour: mark.colour,
    start: offsetOf(container, range.startContainer, range.startOffset),
    end: offsetOf(container, range.endContainer, range.endOffset),
    quote,
  };
}

// Where a saved highlight sits in the text now. Its offsets, if the quote is
// still there; otherwise the quote's occurrence nearest them, since an answer
// drawn as text above it (a matching slot, a reordered paragraph) shifts them.
export function locate(text: string, saved: SavedHighlight): [number, number] | null {
  if (text.startsWith(saved.quote, saved.start)) return [saved.start, saved.end];
  let best = -1;
  for (let i = text.indexOf(saved.quote); i !== -1; i = text.indexOf(saved.quote, i + 1)) {
    if (best === -1 || Math.abs(i - saved.start) < Math.abs(best - saved.start)) best = i;
  }
  if (best === -1) return null;
  return [best, Math.min(best + (saved.end - saved.start), text.length)];
}

function rangeAt(container: Node, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let seen = 0;
  let started = false;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = node.nodeValue?.length ?? 0;
    if (!started && start <= seen + length) {
      range.setStart(node, start - seen);
      started = true;
    }
    if (started && end <= seen + length) {
      range.setEnd(node, end - seen);
      return range;
    }
    seen += length;
  }
  return null;
}

function restore(container: Node, saved: SavedHighlight[]): Mark[] {
  const text = container.textContent ?? "";
  return saved.flatMap((item) => {
    const at = locate(text, item);
    const range = at ? rangeAt(container, at[0], at[1]) : null;
    return range ? [{ colour: item.colour, range }] : [];
  });
}

function Swatch({ tool, className }: { tool: HighlightTool; className?: string }) {
  if (tool === "erase") return <Eraser className={className ?? "size-3.5"} />;
  return (
    <span
      style={{ backgroundColor: `var(--highlight-${tool}-swatch)` }}
      className={className ?? "inline-block size-3.5 rounded-full"}
    />
  );
}

/**
 * A highlightable region: attach `ref` to its container and render `chip`
 * beside it (not inside — it would count as the region's text). `count` and
 * `clear` are for a clear-all control, if the region has one.
 */
export function useHighlighter(
  enable: boolean | undefined,
  scopeKey: string,
): {
  ref: React.RefObject<HTMLDivElement | null>;
  count: number;
  clear: () => void;
  chip: ReactNode;
} {
  const { t } = useI18n();
  const { on, tool, load, save, hasRoom, limitReached } = useHighlighterTool();
  const active = Boolean(enable && on);
  const ref = useRef<HTMLDivElement>(null);
  const [id] = useState(() => Symbol("highlight-scope"));
  const [count, setCount] = useState(0);
  const [chipAt, setChipAt] = useState<{ x: number; y: number } | null>(null);

  // The tool as of now, for listeners registered once per activation.
  const toolRef = useRef(tool);
  toolRef.current = tool;
  const saveRef = useRef(save);
  saveRef.current = save;

  const store = (marks: Mark[]) => {
    scopes.set(id, marks);
    paint();
    setCount(marks.length);
    const container = ref.current;
    if (container) {
      saveRef.current(
        scopeKey,
        marks.flatMap((mark) => serialise(container, mark) ?? []),
      );
    }
  };

  // Load what this scope saved: on mount, and whenever the content changes
  // under it (a different passage, the next page), whose old ranges would
  // point at replaced text nodes. `load` is read here and not a dependency —
  // it is only ever the provider's current map.
  useEffect(() => {
    const container = ref.current;
    const marks = enable && container ? restore(container, load(scopeKey)) : [];
    scopes.set(id, marks);
    paint();
    setCount(marks.length);
    setChipAt(null);
  }, [id, scopeKey, enable]);

  useEffect(
    () => () => {
      scopes.delete(id);
      paint();
    },
    [id],
  );

  const selectionHere = (): Range | null => {
    const selection = window.getSelection();
    const container = ref.current;
    if (!selection || selection.isCollapsed || !selection.rangeCount || !container) return null;
    const range = selection.getRangeAt(0);
    return container.contains(range.commonAncestorContainer) ? range : null;
  };

  const apply = () => {
    const range = selectionHere()?.cloneRange();
    if (!range) return;
    const current = scopes.get(id) ?? [];
    const using = toolRef.current;
    if (using === "erase") {
      store(current.filter((mark) => !overlaps(mark.range, range)));
    } else if (range.toString().trim()) {
      if (hasRoom()) {
        paintOrder = [...paintOrder.filter((c) => c !== using), using];
        store([...current, { colour: using, range }]);
      } else {
        limitReached(t("exercise.highlighter.limitReached", "Highlight limit reached. Erase one to add another."));
      }
    }
    window.getSelection()?.removeAllRanges();
    setChipAt(null);
  };
  const applyRef = useRef(apply);
  applyRef.current = apply;

  // A mouse drag applies on release. Anything else that selects — a long-press
  // on an iPad or phone, Shift+arrows — never releases in a way we can see, so
  // it follows the selection and offers the chip.
  useEffect(() => {
    if (!active || !supported()) {
      setChipAt(null);
      return;
    }
    let dragging = false;

    const placeChip = () => {
      const range = selectionHere();
      if (!range) {
        setChipAt(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      // Below the text on touch, where the OS draws its own Copy menu above it.
      const below = window.matchMedia("(pointer: coarse)").matches;
      setChipAt({ x: rect.left + rect.width / 2, y: below ? rect.bottom + 52 : rect.top });
    };

    const onSelectionChange = () => {
      if (!dragging) placeChip();
    };
    // Only a press INSIDE this region starts a drag. Otherwise the release of
    // any click — picking a colour in the bottom bar — would apply the tool to
    // whatever selection happened to be left over here.
    const onPointerDown = (event: PointerEvent) => {
      dragging =
        event.pointerType === "mouse" &&
        event.target instanceof Node &&
        Boolean(ref.current?.contains(event.target));
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      if (selectionHere()) applyRef.current();
    };

    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
    };
    // Only `active`: the tool and the apply step are read through refs, so a
    // colour change doesn't re-register the listeners mid-drag.
  }, [active]);

  const clear = () => store([]);

  const chip =
    active && chipAt ? (
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        // On press, not click: a tap can clear the selection (and so this chip)
        // before its click lands. onClick stays for Enter/Space.
        onPointerDown={(event) => {
          event.preventDefault();
          apply();
        }}
        onClick={apply}
        style={{
          position: "fixed",
          left: chipAt.x,
          top: chipAt.y - 44,
          transform: "translateX(-50%)",
        }}
        // Inverted against the page rather than pinned to the ink ramp, so the
        // floating chip stays the opposite of whatever it is floating over.
        className="z-50 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background shadow-lg md:pointer-fine:min-h-9"
      >
        <Swatch tool={tool} />
        {tool === "erase" ? t("exercise.highlighter.erase", "Erase") : t("exercise.highlighter.highlight", "Highlight")}
      </button>
    ) : null;

  return { ref, count, clear, chip };
}

/** A highlightable block with no controls of its own beyond the chip. */
export function HighlightScope({
  enable,
  scopeKey,
  children,
}: {
  enable?: boolean;
  scopeKey: string;
  children: ReactNode;
}) {
  const { ref, chip } = useHighlighter(enable, scopeKey);
  // No `cursor-text` here, unlike the passage: it would be inherited by every
  // answer button in the column.
  return (
    <>
      <div ref={ref}>{children}</div>
      {chip}
    </>
  );
}

/**
 * The highlighter's switch and colour picker, for the runner's bottom bar.
 * `open` is controlled by the bar, like `NotesButton`, so one panel shows at a
 * time. Pressing it while off turns the tool on and shows the colours.
 */
export function HighlighterButton({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const { on, tool, setOn, setTool } = useHighlighterTool();
  const anchor = useExerciseTourAnchor("highlight");
  const rootRef = useRef<HTMLDivElement>(null);
  useDismissOutside(rootRef, open, () => onOpenChange(false));

  const choose = (next: HighlightTool) => {
    setTool(next);
    setOn(true);
    onOpenChange(false);
  };

  return (
    <div ref={rootRef} className="relative">
      {open ? (
        <div className="absolute bottom-full left-1/2 z-10 mb-3 w-max -translate-x-1/2 rounded-2xl border-2 border-border bg-card p-3 shadow-xl">
          <p className="mb-2 text-[11px] font-extrabold text-muted-foreground">
            {t("exercise.highlighter.panelTitle", "Highlighter · drag over text")}
          </p>
          <div className="flex items-center gap-2">
            {HIGHLIGHT_COLOURS.map((colour) => (
              <button
                key={colour}
                type="button"
                aria-label={valueLabel(t, `Highlight ${colour}`)}
                aria-pressed={on && tool === colour}
                onClick={() => choose(colour)}
                style={{ backgroundColor: `var(--highlight-${colour}-swatch)` }}
                className={cn(
                  "size-11 rounded-full ring-offset-2 md:pointer-fine:size-9 ring-offset-card transition-transform hover:scale-110",
                  on && tool === colour && "ring-2 ring-foreground",
                )}
              />
            ))}
            <button
              type="button"
              aria-label={t("exercise.highlighter.eraser", "Eraser")}
              aria-pressed={on && tool === "erase"}
              onClick={() => choose("erase")}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full border-2 md:pointer-fine:size-9 border-border ring-offset-2 ring-offset-card hover:border-rose-200",
                on && tool === "erase" && "ring-2 ring-foreground",
              )}
            >
              <Eraser className="size-4" />
            </button>
          </div>
          {on ? (
            <button
              type="button"
              onClick={() => {
                setOn(false);
                onOpenChange(false);
              }}
              className="mt-3 min-h-11 w-full rounded-full border-2 border-border px-3 py-1.5 text-xs font-bold hover:border-rose-200 md:pointer-fine:min-h-9"
            >
              {t("exercise.highlighter.turnOff", "Turn Off")}
            </button>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (!on) setOn(true);
          onOpenChange(!open);
        }}
        aria-expanded={open}
        aria-pressed={on}
        // An icon below `sm`, like Notes: the footer has no room for the label.
        aria-label={t("exercise.highlighter.button", "Highlighter")}
        {...anchor}
        className={cn(
          "relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 px-2.5 py-1.5 text-xs font-bold transition-colors sm:px-3.5 md:pointer-fine:min-h-9 md:pointer-fine:min-w-9",
          open || on
            ? "border-rose-400 bg-rose-50 text-rose-700"
            : "border-border bg-card text-foreground hover:border-rose-200",
        )}
      >
        <Highlighter className="size-4" />
        <span className="hidden sm:inline">{t("exercise.highlighter.highlight", "Highlight")}</span>
        {on ? <Swatch tool={tool} /> : null}
      </button>
    </div>
  );
}
