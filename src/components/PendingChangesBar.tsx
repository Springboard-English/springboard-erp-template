import { Fragment, useEffect, useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

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
  onSave: () => void | Promise<void>;
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

export default function PendingChangesBar({
  pendingCount,
  pendingItems,
  saving = false,
  onSave,
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
  const [isUnsavedOpen, setIsUnsavedOpen] = useState(false);
  const show = pendingCount > 0;

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
    pendingCount === 1
      ? t("pendingChanges.count.one")
      : t("pendingChanges.count.other", undefined, { count: pendingCount });

  return createPortal(
    <div
      className={cn(
        "fixed bottom-[calc(4rem+0.75rem)] left-3 right-3 z-[35] transform-gpu transition-all md:bottom-6 md:left-[calc(18rem+1.5rem)] md:right-6",
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
              "pointer-events-auto mx-auto w-[calc(100%-7rem)] overflow-auto rounded-t-[28px] border border-b-0 border-border/70 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.5)] backdrop-blur",
              dimmed ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/95",
            )}
          >
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/70">
                <tr className="border-b border-border/70">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {pendingKeyLabel}
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
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
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
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
            "pointer-events-auto relative flex min-h-[3.75rem] items-center justify-between gap-3 rounded-[999px] border border-border/70 px-4 py-2 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.4)] backdrop-blur-md",
            dimmed ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/96",
          )}
        >
          <div className="flex min-w-0 shrink items-center gap-2.5 text-sm">
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
            </span>
            <span className="truncate font-medium text-foreground">
              {countLabel}
            </span>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            {hasUnsavedItems ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saving || disabled}
                onClick={() => setIsUnsavedOpen((current) => !current)}
              >
                <ClipboardList className="size-4" />
                {viewUnsavedLabel}
                <ChevronUp
                  className={cn(
                    "size-4 transition-transform",
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
                disabled={saving || disabled}
              >
                <X className="size-4" />
                {cancelLabel}
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              disabled={saving || disabled}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {saving ? t("pendingChanges.saving") : saveLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
