import type { SpringConfig } from "@react-spring/web";
export interface PendingChangeItem {
    section?: string;
    key: string;
    value: string;
}
export declare const PENDING_CHANGES_BAR_DEFAULT_SAVE_LABEL = "Save changes";
export declare const PENDING_CHANGES_BAR_DEFAULT_CANCEL_LABEL = "Cancel";
export declare const PENDING_CHANGES_BAR_DEFAULT_VIEW_UNSAVED_LABEL = "Review";
export declare const PENDING_CHANGES_BAR_DEFAULT_PENDING_KEY_LABEL = "OBJECT";
export declare const PENDING_CHANGES_BAR_DEFAULT_PENDING_VALUE_LABEL = "Changed";
export declare const PENDING_CHANGES_BAR_DEFAULT_EXPAND_MAX_HEIGHT = 440;
export declare const PENDING_CHANGES_BAR_DEFAULT_SPRING_CONFIG: SpringConfig;
export declare const PENDING_CHANGES_BAR_DEFAULT_BAR_TRANSITION_MS = 250;
export declare const PENDING_CHANGES_BAR_DEFAULT_CHEVRON_TRANSITION_MS = 200;
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
export default function PendingChangesBar({ pendingCount, pendingItems, saving, onSave, onCancel, saveLabel, cancelLabel, viewUnsavedLabel, pendingKeyLabel, pendingValueLabel, dimmed, disabled, expandMaxHeight, expandSpringConfig, barTransitionMs, chevronTransitionMs, }: PendingChangesBarProps): import("react").ReactPortal | null;
