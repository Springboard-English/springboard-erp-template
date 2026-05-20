import type { ReactNode } from 'react';
type FormTableDialogProps = {
    open: boolean;
    saving?: boolean;
    title: string;
    description?: string;
    error?: string | null;
    submitLabel?: string;
    submitDisabled?: boolean;
    onClose: () => void;
    onSubmit: () => void | Promise<void>;
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
export default function FormTableDialog({ open, saving, title, description, error, submitLabel, submitDisabled, onClose, onSubmit, children, }: FormTableDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
