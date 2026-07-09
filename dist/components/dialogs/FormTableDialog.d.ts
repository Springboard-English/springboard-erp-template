import { type ReactNode } from 'react';
import { FormTableRow } from '@/components/dialogs/FormTableSection';
export type FormTableDialogTab = {
    label: string;
    content: ReactNode;
    /** Skip the FormTableSection wrapper — use for tabs with custom table layouts */
    raw?: boolean;
    /** Show a completion checkmark on the tab pill */
    complete?: boolean;
};
type FormTableDialogProps = {
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
    children?: ReactNode;
    tabs?: FormTableDialogTab[];
};
export default function FormTableDialog({ open, saving, title, description, error, submitLabel, submitDisabled, submitDisabledReason, onClose, onSubmit, children, tabs, }: FormTableDialogProps): import("react/jsx-runtime").JSX.Element;
export { FormTableRow };
