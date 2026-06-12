import type { ReactNode } from 'react';
type FormTableSectionProps = {
    children: ReactNode;
};
type FormTableRowProps = {
    label: string;
    required?: boolean;
    helperText?: string;
    children: ReactNode;
    className?: string;
    align?: 'center' | 'start';
};
export declare function FormTableRow({ label, required, helperText, children, className, align }: FormTableRowProps): import("react/jsx-runtime").JSX.Element;
export default function FormTableSection({ children }: FormTableSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
