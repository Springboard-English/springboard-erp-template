export interface SearchableSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    keywords?: string;
}
interface SearchableSelectProps {
    id?: string;
    value: string | number;
    options: SearchableSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
    contentClassName?: string;
    onValueChange: (value: string) => void;
}
export declare function SearchableSelect({ id, value, options, placeholder, searchPlaceholder, emptyMessage, disabled, className, contentClassName, onValueChange, }: SearchableSelectProps): import("react/jsx-runtime").JSX.Element;
export {};
