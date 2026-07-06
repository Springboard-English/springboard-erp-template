import { type ReactNode } from 'react';
import { FormTableRow } from '@/components/dialogs/FormTableSection';
export type FormTableDialogTab = {
    label: string;
    content: ReactNode;
};
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
    children?: ReactNode;
    tabs?: FormTableDialogTab[];
};
export default function FormTableDialog({ open, saving, title, description, error, submitLabel, submitDisabled, onClose, onSubmit, children, tabs, }: FormTableDialogProps): import("react/jsx-runtime").JSX.Element;
export { FormTableRow };
