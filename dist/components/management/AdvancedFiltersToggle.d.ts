export interface AdvancedFiltersToggleProps {
    open: boolean;
    onToggle?: () => void;
    activeCount?: number;
    className?: string;
}
declare const AdvancedFiltersToggle: import("react").ForwardRefExoticComponent<AdvancedFiltersToggleProps & Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export default AdvancedFiltersToggle;
