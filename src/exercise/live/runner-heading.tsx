import { useCallback, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { EditableText } from "../components/exercise-edit";
import { collectionHeading } from "../components/collection-context";
import type { CollectionStub } from "./api";
import { useStableI18n } from "./i18n";
import { cn } from "../../lib/utils";
import { useCloseOnOutsidePress } from "../lib/use-close-on-outside-press";

// The part/section title shown in the runner's top bar. The bar is a fixed
// height, so the section instruction is truncated to one line — but the full
// instruction (and the part's) matters to the student, so the heading is a
// button that drops the whole thing down in a panel. A chevron hints it opens.
//
// In the question editor (`edit`), the panel is where the part's title and
// instruction and the section's instruction are edited, typed in place.
//
// The panel closes on a press anywhere outside it, or Escape. A press in a list
// or dialog the panel opened is not outside it (`useCloseOnOutsidePress`).
/** How the editor changes a part's or section's heading text. */
export interface HeadingEdit {
  onChange: (collectionKey: string, patch: { title?: string; instruction?: string }) => void;
  /** The host's further settings for the section (task, word bank). */
  extra?: ReactNode;
}

/** A press in an open dialog or alert dialog, which portal to the body. */
const keepDialogs = (target: Element | null) => Boolean(target?.closest?.('[role="dialog"], [role="alertdialog"]'));

/** The runner's part/section heading, which drops the full instructions down. */
export function RunnerHeading({
  stub,
  edit,
  compact = false,
}: {
  stub: CollectionStub | null | undefined;
  edit?: HeadingEdit;
  /** A one-line chip at the left of the bar (the import, whose centre holds its steps). */
  compact?: boolean;
}) {
  const { t } = useStableI18n();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { part, section } = collectionHeading(stub, t);

  // A dialog the panel opened (the host's settings) may render outside its tree.
  const onPointerDownCapture = useCloseOnOutsidePress(open, close, keepDialogs);

  const partObj = stub?.kind === "part" ? stub : stub?.parent;
  const sectionObj = stub?.kind === "section" ? stub : null;
  const partInstruction = partObj?.instruction ?? null;
  const sectionInstruction = sectionObj?.instruction ?? null;

  if (!part && !section && !edit) return null;

  // There's more to show than the two truncated lines when either instruction
  // exists (the section line is the instruction, shown in full in the panel);
  // in the editor the panel always opens, since it is where they are edited.
  const hasMore = Boolean(partInstruction || section || (edit && (partObj || sectionObj)));

  return (
    <div onPointerDownCapture={onPointerDownCapture} className={cn("relative flex max-w-full", compact ? "min-w-0" : "mx-auto justify-center")}>
      <button
        type="button"
        onClick={() => hasMore && setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex min-w-0 items-center gap-1.5 max-md:min-h-11 max-md:min-w-11 pointer-coarse:min-h-11 pointer-coarse:min-w-11",
          compact && "h-9 max-w-[22rem] rounded-full border bg-muted/60 px-3 hover:bg-muted",
          hasMore ? "cursor-pointer" : "cursor-default",
        )}
      >
        {compact ? (
          // One line: the part, then the section's instruction, cut to the chip.
          <span className="flex min-w-0 items-baseline gap-1.5">
            {part ? <span className="shrink-0 text-xs font-extrabold text-rose-700">{part}</span> : null}
            {section ? <span className="truncate text-xs font-semibold text-muted-foreground">{section}</span> : null}
          </span>
        ) : (
        <span className="min-w-0">
          {part ? (
            <span className="block truncate text-[11px] font-extrabold text-rose-700">
              {part}
            </span>
          ) : null}
          {section ? (
            <span className="block truncate text-xs font-semibold text-muted-foreground">
              {section}
            </span>
          ) : null}
        </span>
        )}
        {hasMore ? (
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        ) : null}
      </button>

      {open ? (
        <>
          <div
            // On a phone the heading sits left of centre, so a panel centred on
            // it would run off the screen: there it is pinned to both edges.
            // A compact chip sits at the bar's left, so its panel opens from there.
            className={cn(
              "absolute top-full z-30 mt-3 max-h-[70dvh] w-[min(92vw,44rem)] overflow-y-auto rounded-2xl border bg-card p-5 text-left shadow-xl max-sm:fixed max-sm:inset-x-3 max-sm:top-20 max-sm:mt-0 max-sm:w-auto max-sm:translate-x-0",
              compact ? "left-0" : "left-1/2 -translate-x-1/2",
            )}
          >
            {edit ? (
              <div className="space-y-3">
                {partObj ? (
                  <div className="space-y-1">
                    <p className="text-[11px] font-extrabold text-rose-700">
                      <EditableText
                        value={partObj.title ?? ""}
                        label={t("exercise.live.runnerHeading.partTitle", "Part title")}
                        onChange={(title) => edit.onChange(partObj.appsheet_key, { title })}
                      />
                    </p>
                    <p className="text-sm font-semibold leading-6 text-muted-foreground">
                      <EditableText
                        value={partObj.instruction ?? ""}
                        label={t("exercise.live.runnerHeading.partInstruction", "Part instruction")}
                        onChange={(instruction) => edit.onChange(partObj.appsheet_key, { instruction })}
                      />
                    </p>
                  </div>
                ) : null}
                {sectionObj ? (
                  <p className={cn("text-sm font-bold leading-6 text-foreground", partObj && "border-t pt-3")}>
                    <EditableText
                      value={sectionObj.instruction ?? ""}
                      label={t("exercise.live.runnerHeading.sectionInstruction", "Section instruction")}
                      onChange={(instruction) => edit.onChange(sectionObj.appsheet_key, { instruction })}
                    />
                  </p>
                ) : null}
                {edit.extra ? <div className="border-t pt-3">{edit.extra}</div> : null}
              </div>
            ) : (
              <>
            {part ? (
              <p className="text-[11px] font-extrabold text-rose-700">
                {part}
              </p>
            ) : null}
            {partInstruction ? (
              <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">
                {partInstruction}
              </p>
            ) : null}
            {sectionInstruction ? (
              <p
                className={cn(
                  "text-sm font-bold leading-6 text-foreground",
                  (part || partInstruction) && "mt-3 border-t pt-3",
                )}
              >
                {sectionInstruction}
              </p>
            ) : null}
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
