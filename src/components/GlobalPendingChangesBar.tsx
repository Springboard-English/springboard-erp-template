import PendingChangesBar from "@/components/PendingChangesBar";
// Relative: this type reaches the published .d.ts, where `@/` does not resolve.
import type { PendingChangesBarProps } from "./PendingChangesBar";
import { usePendingChanges } from "@/context/PendingChangesContext";
import { useI18n } from "@/context/I18nContext";

/** The labels and looks of the shared bar; its state comes from the provider. */
export type GlobalPendingChangesBarProps = Pick<
  PendingChangesBarProps,
  | "saveLabel"
  | "cancelLabel"
  | "viewUnsavedLabel"
  | "pendingKeyLabel"
  | "pendingValueLabel"
  | "dimmed"
  | "expandMaxHeight"
  | "expandSpringConfig"
  | "barTransitionMs"
  | "chevronTransitionMs"
> & {
  /** Cancel's label in selection mode. Defaults to "Clear Selection". */
  clearSelectionLabel?: string;
};

/**
 * The one pending-changes bar for a `PendingChangesProvider`: the total of
 * every registered form, Save all, Discard all, a blocked source's message,
 * or a selection's actions when nothing is unsaved. Render it once, inside
 * the provider. A lone source's own labels beat the props given here.
 */
export default function GlobalPendingChangesBar({
  saveLabel,
  cancelLabel,
  clearSelectionLabel,
  pendingKeyLabel,
  pendingValueLabel,
  ...rest
}: GlobalPendingChangesBarProps) {
  const { t } = useI18n();
  const pending = usePendingChanges();
  const sole = pending.soleSource;
  const selectionMode = pending.mode === "selection";
  return (
    <PendingChangesBar
      {...rest}
      pendingCount={pending.pendingCount}
      pendingItems={pending.pendingItems}
      saving={pending.saving}
      disabled={pending.disabled}
      blocked={pending.blocked}
      onSave={async () => {
        await pending.saveAll();
      }}
      onCancel={pending.discardAll}
      actions={pending.actions}
      countLabel={pending.countLabel}
      saveLabel={sole?.saveLabel ?? saveLabel}
      cancelLabel={
        sole?.cancelLabel
        ?? (selectionMode
          ? (clearSelectionLabel ?? t("pendingChanges.clearSelection"))
          : cancelLabel)
      }
      pendingKeyLabel={sole?.keyLabel ?? pendingKeyLabel}
      pendingValueLabel={sole?.valueLabel ?? pendingValueLabel}
    />
  );
}
