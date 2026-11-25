import { useEffect, useRef } from "react";

// Holds the clipboard shut over the live exam in both directions. The paper
// cannot leave the runner as text (no Ctrl+C, no dragging a selection into
// another tab), and outside text cannot come in (no pasting an answer a chat
// assistant wrote). It is a deterrent against the cheapest routes, not a claim
// that the text is sealed: a screenshot, a phone camera and retyping all
// remain, and nothing in a browser can stop them.
//
// The rules, each of which a blunter implementation gets wrong:
//
//  1. **Never disable SELECTION.** The obvious `user-select: none` would take
//     the passage highlighter with it (`annotatable-passage.tsx` builds its
//     ranges from `window.getSelection()`, and its container asks for
//     `select-text` explicitly). Selecting is how a student reads a long text;
//     copying is what we are stopping. Cancel the clipboard, keep the selection.
//  2. **The student's own writing stays theirs.** A copy that starts inside an
//     input, textarea or contenteditable is allowed: it can only carry what they
//     typed, and moving a paragraph in the essay box or a draft out of the notes
//     pad is ordinary exam work. The same text may be pasted back. Anything else
//     pasted or dropped into a field is refused, because it came from outside.
//  3. **`dragstart` counts as copying, and `drop` as pasting.** Dragging a
//     selection into another window moves the text with no clipboard event at
//     all. Safe to cancel wholesale here: the runner's drag interactions
//     (gapped text, jumbled paragraphs) are @dnd-kit's pointer sensors, not
//     native HTML5 drag, and nothing in the app sets `draggable`.
//  4. **The right-click menu is off for a mouse, on for touch.** Its entries are
//     the quickest way to an assistant: "Search Google for…", Lens, "Ask
//     Gemini/Copilot", "Translate to Vietnamese". On a touch screen the same
//     event belongs to the long-press that selects text (and so the
//     highlighter), so a touch press keeps it.
//
// Listeners sit on `window`, in the capture phase, so nothing below them can
// stop one first. A refused paste or drop is reported through `onBlockedPaste`;
// `use-proctoring.ts` reports blocked copies itself and no pastes at all, since
// every paste that lands is the student's own text.

const EDITABLE = "input, textarea, [contenteditable]:not([contenteditable='false'])";

// How many of the student's own copies are remembered for pasting back.
const OWN_COPIES_KEPT = 20;

/** Whether this event came out of a field holding the student's own writing. */
export function fromOwnWriting(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest(EDITABLE) !== null;
}

function normalise(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Whether a paste may land: empty, or text the student copied out of their own
 * answers or notes during this sitting. Whitespace is ignored, since a copy out
 * of a textarea and its paste back differ in line endings by platform.
 */
export function pasteAllowed(pasted: string, ownCopies: readonly string[]): boolean {
  const text = normalise(pasted);
  if (text === "") return true;
  return ownCopies.some((own) => normalise(own) === text);
}

/** The text selected in the field (or contenteditable) an event started in. */
function selectedOwnText(target: EventTarget | null): string {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const { selectionStart, selectionEnd, value } = target;
    if (selectionStart === null || selectionEnd === null) return "";
    return value.slice(selectionStart, selectionEnd);
  }
  return document.getSelection()?.toString() ?? "";
}

export type BlockedPasteVia = "paste" | "drop";

export function useCopyGuard(
  enabled: boolean,
  /** Called with the refused text's length — never the text itself. */
  onBlockedPaste?: (length: number, via: BlockedPasteVia) => void,
): void {
  const onBlockedRef = useRef(onBlockedPaste);
  onBlockedRef.current = onBlockedPaste;

  useEffect(() => {
    if (!enabled) return;

    const ownCopies: string[] = [];
    // A drag that started in the student's own writing, so its drop is allowed.
    let ownDrag = false;
    // The kind of pointer that last went down, for a `contextmenu` that does not
    // carry its own `pointerType`.
    let lastPointer = "mouse";

    const blockCopy = (event: Event) => {
      if (fromOwnWriting(event.target)) {
        const text = selectedOwnText(event.target);
        if (text) {
          ownCopies.push(text);
          if (ownCopies.length > OWN_COPIES_KEPT) ownCopies.shift();
        }
        if (event.type === "dragstart") ownDrag = true;
        return;
      }
      event.preventDefault();
    };

    const onDragEnd = () => {
      ownDrag = false;
    };

    const onPaste = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text") ?? "";
      if (pasteAllowed(text, ownCopies)) return;
      event.preventDefault();
      onBlockedRef.current?.(text.length, "paste");
    };

    const onDrop = (event: DragEvent) => {
      if (ownDrag) return;
      const text = event.dataTransfer?.getData("text") ?? "";
      // Files and images dropped onto the page are not answers either; the
      // browser would otherwise open them in place of the exam.
      event.preventDefault();
      if (fromOwnWriting(event.target) && text) onBlockedRef.current?.(text.length, "drop");
    };

    const onPointerDown = (event: PointerEvent) => {
      lastPointer = event.pointerType;
    };

    const onContextMenu = (event: MouseEvent) => {
      const pointer = "pointerType" in event ? String(event.pointerType) : lastPointer;
      if (pointer === "touch") return;
      event.preventDefault();
    };

    window.addEventListener("copy", blockCopy, true);
    window.addEventListener("cut", blockCopy, true);
    window.addEventListener("dragstart", blockCopy, true);
    window.addEventListener("dragend", onDragEnd, true);
    window.addEventListener("paste", onPaste, true);
    window.addEventListener("drop", onDrop, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("contextmenu", onContextMenu, true);

    return () => {
      window.removeEventListener("copy", blockCopy, true);
      window.removeEventListener("cut", blockCopy, true);
      window.removeEventListener("dragstart", blockCopy, true);
      window.removeEventListener("dragend", onDragEnd, true);
      window.removeEventListener("paste", onPaste, true);
      window.removeEventListener("drop", onDrop, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("contextmenu", onContextMenu, true);
    };
  }, [enabled]);
}
