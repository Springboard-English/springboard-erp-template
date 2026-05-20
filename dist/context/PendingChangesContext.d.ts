import { type ReactNode } from "react";
export interface PendingChangeItem {
    section: string;
    key: string;
    value: string;
}
export interface PendingSectionRegistration {
    count: number;
    items: Array<{
        key: string;
        value: string;
    }>;
    onSave?: () => void | Promise<void>;
    onCancel?: () => void;
    saving?: boolean;
    disabled?: boolean;
    keyLabel?: string;
    valueLabel?: string;
}
export interface PendingChangesContextValue {
    globalPendingCount: number;
    globalPendingItems: PendingChangeItem[];
    sectionPendingCounts: Record<string, number>;
    activeSection: string | null;
    activeSectionPendingCount: number;
    activeSectionSaving: boolean;
    activeSectionDisabled: boolean;
    activeSectionKeyLabel: string;
    activeSectionValueLabel: string;
    setActiveSection: (section: string | null) => void;
    registerSection: (section: string, registration: PendingSectionRegistration) => void;
    unregisterSection: (section: string) => void;
    handleSaveActiveSection: () => void | Promise<void>;
    handleCancelActiveSection: () => void;
}
export declare function PendingChangesProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function usePendingChanges(): PendingChangesContextValue;
