import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { animated, useSpring } from "@react-spring/web";
import type { SpringConfig } from "@react-spring/web";
import {
  ClipboardList,
  Loader2,
  Save,
  X,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailActionsMenu } from "@/components/layout/DetailLayout";
import PendingBarConfirmDialog from "@/components/PendingBarConfirmDialog";
// Relative: this type reaches the published .d.ts, where `@/` does not resolve.
import type { PendingBarConfirm } from "./PendingBarConfirmDialog";
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

/**
 * One button on the bar in actions mode, standing in for Save. `P` is what
 * `confirm.prepare` resolves to (`undefined` without one) and reaches
 * `onRun`. Build one with `definePendingBarAction` so `P` is inferred.
 */
export interface PendingBarAction<P = undefined> {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Defaults to "default" (filled). */
  variant?: "default" | "outline" | "destructive";
  disabled?: boolean;
  /** Renders it in the bar's "⋯" menu instead of as a button. */
  overflow?: boolean;
  /** Runs on click, or on confirm when `confirm` is set; the bar shows it running until it settles. */
  onRun: (prepared: P) => void | Promise<void>;
  confirm?: PendingBarConfirm<P>;
}

// `any` here is deliberate: one bar mixes actions with different prepared
// types, and `PendingBarAction<unknown>` would reject every one that has a
// `prepare`. `definePendingBarAction` keeps each action checked on its own.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPendingBarAction = PendingBarAction<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPendingBarConfirm = PendingBarConfirm<any>;

/** Types one bar action on its own, inferring `P` from `confirm.prepare`, so it can sit in a mixed `actions` list. */
export function definePendingBarAction<P = undefined>(
  action: PendingBarAction<P>,
): AnyPendingBarAction {
  return action;
}

/** The id the default Save path uses for its confirmation dialog. */
const SAVE_ACTION_ID = "__save";

export interface PendingChangeItem {
  section?: string;
  key: string;
  value: string;
}

export const PENDING_CHANGES_BAR_DEFAULT_SAVE_LABEL = "Save changes";
export const PENDING_CHANGES_BAR_DEFAULT_CANCEL_LABEL = "Cancel";
export const PENDING_CHANGES_BAR_DEFAULT_VIEW_UNSAVED_LABEL = "Review";
export const PENDING_CHANGES_BAR_DEFAULT_PENDING_KEY_LABEL = "OBJECT";
export const PENDING_CHANGES_BAR_DEFAULT_PENDING_VALUE_LABEL = "Changed";
export const PENDING_CHANGES_BAR_DEFAULT_EXPAND_MAX_HEIGHT = 440;
export const PENDING_CHANGES_BAR_DEFAULT_SPRING_CONFIG: SpringConfig = {
  tension: 320,
  friction: 34,
};
export const PENDING_CHANGES_BAR_DEFAULT_BAR_TRANSITION_MS = 250;
export const PENDING_CHANGES_BAR_DEFAULT_CHEVRON_TRANSITION_MS = 200;

export interface PendingChangesBarProps {
  pendingCount: number;
  pendingItems?: PendingChangeItem[];
  saving?: boolean;
  /**
   * The Save button. Not needed when `actions` is given. With `saveConfirm` it
   * runs on confirm and receives the prepared value.
   */
  // Method syntax on purpose: it is checked bivariantly, so a handler typed
  // for the click event (which Save without a dialog still passes) compiles.
  onSave?(prepared?: unknown): void | Promise<void>;
  /** Puts a confirmation dialog in front of Save. */
  saveConfirm?: AnyPendingBarConfirm;
  /**
   * Replaces Save with these buttons (actions mode), e.g. for selected rows.
   * `onCancel` stays the secondary button. On a phone only the first
   * non-overflow action stays a button; the rest move to the "⋯" menu.
   */
  actions?: readonly AnyPendingBarAction[];
  /** Replaces the "N unsaved changes" text, e.g. "3 assessments selected". */
  countLabel?: string;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  viewUnsavedLabel?: string;
  pendingKeyLabel?: string;
  pendingValueLabel?: string;
  dimmed?: boolean;
  disabled?: boolean;
  expandMaxHeight?: number;
  expandSpringConfig?: SpringConfig;
  barTransitionMs?: number;
  chevronTransitionMs?: number;
}

/**
 * The floating bar at the bottom of the page that holds unsaved edits: a
 * count, an optional Review list (`pendingItems`), Cancel and Save. Given
 * `actions` it holds pending actions instead (ticked rows waiting for a send
 * or a delete), each with an optional confirmation dialog; extra actions sit
 * in a "⋯" menu. Shown while `pendingCount` is above zero.
 */
export default function PendingChangesBar({
  pendingCount,
  pendingItems,
  saving = false,
  onSave,
  saveConfirm,
  actions,
  countLabel: countLabelOverride,
  onCancel,
  saveLabel = PENDING_CHANGES_BAR_DEFAULT_SAVE_LABEL,
  cancelLabel = PENDING_CHANGES_BAR_DEFAULT_CANCEL_LABEL,
  viewUnsavedLabel = PENDING_CHANGES_BAR_DEFAULT_VIEW_UNSAVED_LABEL,
  pendingKeyLabel = PENDING_CHANGES_BAR_DEFAULT_PENDING_KEY_LABEL,
  pendingValueLabel = PENDING_CHANGES_BAR_DEFAULT_PENDING_VALUE_LABEL,
  dimmed = false,
  disabled = false,
  expandMaxHeight = PENDING_CHANGES_BAR_DEFAULT_EXPAND_MAX_HEIGHT,
  expandSpringConfig = PENDING_CHANGES_BAR_DEFAULT_SPRING_CONFIG,
  barTransitionMs = PENDING_CHANGES_BAR_DEFAULT_BAR_TRANSITION_MS,
  chevronTransitionMs = PENDING_CHANGES_BAR_DEFAULT_CHEVRON_TRANSITION_MS,
}: PendingChangesBarProps) {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [isUnsavedOpen, setIsUnsavedOpen] = useState(false);
  // The action running without a dialog; a confirmed run shows in its dialog.
  const [runningId, setRunningId] = useState<string | null>(null);
  // `key` remounts the dialog on every open, so no state leaks between runs.
  const [dialog, setDialog] = useState<{ key: number; id: string; open: boolean } | null>(null);
  const show = pendingCount > 0;
  const actionsMode = actions !== undefined;
  const busy = saving || disabled || runningId !== null;

  const hasUnsavedItems = useMemo(
    () => Array.isArray(pendingItems) && pendingItems.length > 0,
    [pendingItems],
  );
  const showSectionColumn = useMemo(
    () => (pendingItems ?? []).some((item) => Boolean(item.section)),
    [pendingItems],
  );
  const groupedPendingItems = useMemo(() => {
    const groups = new Map<string, PendingChangeItem[]>();
    (pendingItems ?? []).forEach((item) => {
      const sectionName = item.section?.trim() || t("pendingChanges.generalSection");
      const current = groups.get(sectionName) ?? [];
      current.push(item);
      groups.set(sectionName, current);
    });
    return Array.from(groups.entries()).map(([section, items]) => ({
      section,
      items,
    }));
  }, [pendingItems]);

  const [expandSpring, expandApi] = useSpring(() => ({
    maxHeight: 0,
    opacity: 0,
    config: expandSpringConfig,
  }));

  useEffect(() => {
    if (!show) {
      setIsUnsavedOpen(false);
    }
  }, [show]);

  useEffect(() => {
    const isOpen = isUnsavedOpen && hasUnsavedItems;
    expandApi.start({
      maxHeight: isOpen ? expandMaxHeight : 0,
      opacity: isOpen ? 1 : 0,
      config: expandSpringConfig,
    });
  }, [isUnsavedOpen, hasUnsavedItems, expandApi, expandMaxHeight, expandSpringConfig]);

  if (typeof document === "undefined") {
    return null;
  }

  const countLabel =
    countLabelOverride ??
    (pendingCount === 1
      ? t("pendingChanges.count.one")
      : t("pendingChanges.count.other", undefined, { count: pendingCount }));

  // A phone has room for the count, Review, Clear and one labelled button;
  // every other action goes to the "⋯" menu there.
  const buttonActions = (actions ?? []).filter((action) => !action.overflow);
  const inlineActions = isMobile ? buttonActions.slice(0, 1) : buttonActions;
  const menuActions = (actions ?? []).filter(
    (action) => !inlineActions.includes(action),
  );

  const activeConfirm: AnyPendingBarConfirm | null = !dialog
    ? null
    : dialog.id === SAVE_ACTION_ID
      ? (saveConfirm ?? null)
      : (actions?.find((action) => action.id === dialog.id)?.confirm ?? null);
  const activeAction =
    dialog && dialog.id !== SAVE_ACTION_ID
      ? actions?.find((action) => action.id === dialog.id)
      : undefined;

  const openDialog = (id: string) =>
    setDialog((current) => ({ key: (current?.key ?? 0) + 1, id, open: true }));

  const runAction = async (action: AnyPendingBarAction) => {
    if (busy || action.disabled) return;
    if (action.confirm) {
      openDialog(action.id);
      return;
    }
    setRunningId(action.id);
    try {
      await action.onRun(undefined);
    } finally {
      setRunningId(null);
    }
  };


  // Hidden labels keep the phone bar on one line; the icon and the
  // screen-reader text stay. Only in actions mode, so edit pages are unchanged.
  const compactLabel = actionsMode ? "max-md:sr-only" : undefined;

  return createPortal(
    <div
      className={cn(
        // Layer scale (see DetailLayout): app chrome ≤ 40, the floating detail
        // panel 50, this bar 55, modals/popovers 60. The bar has to clear the
        // floating panel — the edits it saves are made *inside* that panel, and
        // any lower layer sits under the panel's backdrop, unreachable.
        "fixed bottom-[calc(4rem+0.75rem)] left-3 right-3 z-[55] transform-gpu transition-all md:bottom-6 md:left-[calc(18rem+1.5rem)] md:right-6",
        show
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-6 opacity-0 pointer-events-none",
      )}
      style={{ transitionDuration: `${barTransitionMs}ms` }}
    >
      <div className="relative">
        <animated.div
          style={{
            maxHeight: expandSpring.maxHeight,
            opacity: expandSpring.opacity,
          }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              // No `pointer-events-auto` here — see the pill below.
              "mx-auto w-[calc(100%-7rem)] overflow-auto rounded-t-[28px] border border-b-0 border-border/70 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.5)] backdrop-blur",
              dimmed ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/95",
            )}
          >
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/70">
                <tr className="border-b border-border/70">
                  <th className="whitespace-nowrap px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">
                    {pendingKeyLabel}
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">
                    {pendingValueLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedPendingItems.map((group, groupIndex) => (
                  <Fragment key={`${group.section}-${groupIndex}`}>
                    {showSectionColumn ? (
                      <tr className="border-b border-border/70 bg-muted/45">
                        <td
                          colSpan={2}
                          className="px-4 py-2 text-sm font-semibold text-muted-foreground"
                        >
                          {group.section}
                        </td>
                      </tr>
                    ) : null}
                    {group.items.map((item, itemIndex) => (
                      <tr
                        key={`${group.section}-${item.key}-${item.value}-${itemIndex}`}
                        className="border-b border-border/60 last:border-b-0"
                      >
                        <td className="px-4 py-2.5 align-top font-medium text-foreground">
                          {item.key}
                        </td>
                        <td className="px-4 py-2.5 align-top text-muted-foreground">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </animated.div>

        <div
          className={cn(
            // Deliberately NOT `pointer-events-auto`. The wrapper above owns
            // that decision and sets `pointer-events-none` while the bar is
            // hidden — but `pointer-events` is overridable by a descendant, so
            // re-enabling it here would leave a 60px invisible strip (opacity
            // 0, still hit-testable) across the bottom of every screen,
            // swallowing clicks on whatever sits under it, such as the data
            // tables' pager. Inheriting is what makes "hidden" mean
            // untouchable.
            "relative flex min-h-[3.75rem] items-center justify-between gap-3 rounded-[999px] border border-border/70 px-4 py-2 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.4)] backdrop-blur-md",
            // A phone's action buttons fill the row, so the count takes a line of its own.
            actionsMode &&
              "max-md:flex-col max-md:items-stretch max-md:gap-2 max-md:rounded-[28px] max-md:py-3",
            dimmed ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/96",
          )}
        >
          <div className="flex min-w-0 shrink items-center gap-2.5 text-sm">
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-warning" />
            </span>
            <span className="truncate font-medium text-foreground">
              {countLabel}
            </span>
          </div>

          <div
            className={cn(
              "flex shrink-0 items-center justify-end gap-1.5",
              actionsMode ? "flex-nowrap" : "flex-wrap",
            )}
          >
            {hasUnsavedItems ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => setIsUnsavedOpen((current) => !current)}
              >
                <ClipboardList className="size-4" />
                {actionsMode ? <span className={compactLabel}>{viewUnsavedLabel}</span> : viewUnsavedLabel}
                <ChevronUp
                  className={cn(
                    "size-4 transition-transform",
                    actionsMode && "max-md:hidden",
                    isUnsavedOpen ? "rotate-0" : "rotate-180",
                  )}
                  style={{ transitionDuration: `${chevronTransitionMs}ms` }}
                />
              </Button>
            ) : null}
            {onCancel ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={busy}
              >
                <X className="size-4" />
                {actionsMode ? <span className={compactLabel}>{cancelLabel}</span> : cancelLabel}
              </Button>
            ) : null}
            {actionsMode ? (
              <>
                {inlineActions.map((action) => (
                  <Button
                    key={action.id}
                    type="button"
                    size="sm"
                    variant={action.variant ?? "default"}
                    disabled={busy || action.disabled}
                    onClick={() => void runAction(action)}
                  >
                    {runningId === action.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      action.icon
                    )}
                    {action.label}
                  </Button>
                ))}
                <DetailActionsMenu
                  // Upward: below the bar is the phone's bottom nav.
                  side="top"
                  actions={menuActions.map((action) => ({
                    label: action.label,
                    icon: action.icon,
                    destructive: action.variant === "destructive",
                    disabled: busy || action.disabled,
                    // Deferred a tick: a dialog opened in the same event as
                    // the menu closes loses its focus trap to the menu's
                    // focus restore.
                    onSelect: () => {
                      window.setTimeout(() => void runAction(action), 0);
                    },
                  }))}
                />
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={saveConfirm ? () => openDialog(SAVE_ACTION_ID) : onSave}
                disabled={saving || disabled}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {saving ? t("pendingChanges.saving") : saveLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
      {dialog && activeConfirm ? (
        <PendingBarConfirmDialog
          key={dialog.key}
          open={dialog.open}
          onOpenChange={(open) =>
            setDialog((current) => (current ? { ...current, open } : current))
          }
          confirm={activeConfirm}
          fallbackConfirmLabel={
            dialog.id === SAVE_ACTION_ID
              ? saveLabel
              : (activeAction?.label ?? t("pendingChanges.confirm"))
          }
          onRun={(prepared) =>
            dialog.id === SAVE_ACTION_ID
              ? onSave?.(prepared)
              : activeAction?.onRun(prepared)
          }
        />
      ) : null}
    </div>,
    document.body,
  );
}
