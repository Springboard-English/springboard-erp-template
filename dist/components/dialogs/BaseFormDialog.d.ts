import type { ReactNode } from 'react';
type BaseFormDialogProps = {
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
export default function BaseFormDialog({ open, saving, title, description, error, submitLabel, submitDisabled, onClose, onSubmit, children, }: BaseFormDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
