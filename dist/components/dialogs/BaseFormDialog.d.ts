import type { ReactNode } from 'react';
type BaseFormDialogProps = {
    open: boolean;
    saving?: boolean;
    title: string;
    description?: string;
    error?: string | null;
    submitLabel?: string;
    submitDisabled?: boolean;
    submitDisabledReason?: string;
    onClose: () => void;
    onSubmit: () => void | Promise<void>;
    children: ReactNode;
    subHeader?: ReactNode;
};
export default function BaseFormDialog({ open, saving, title, description, error, submitLabel, submitDisabled, submitDisabledReason, onClose, onSubmit, children, subHeader, }: BaseFormDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
