import { type ReactNode } from "react";
export interface AdvancedFiltersPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: ReactNode;
    onClear?: () => void;
    onApply?: () => void;
    children: ReactNode;
    className?: string;
    gridClassName?: string;
}
export default function AdvancedFiltersPanel({ open, onOpenChange, trigger, onClear, onApply, children, className, gridClassName, }: AdvancedFiltersPanelProps): import("react/jsx-runtime").JSX.Element;
