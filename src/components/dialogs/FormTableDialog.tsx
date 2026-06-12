import type { ReactNode } from 'react';
import BaseFormDialog from '@/components/dialogs/BaseFormDialog';
import FormTableSection, { FormTableRow } from '@/components/dialogs/FormTableSection';

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

export default function FormTableDialog({
    open,
    saving = false,
    title,
    description,
    error,
    submitLabel = 'Create',
    submitDisabled = false,
    onClose,
    onSubmit,
    children,
}: FormTableDialogProps) {
    return (
        <BaseFormDialog
            open={open}
            saving={saving}
            title={title}
            description={description}
            error={error}
            submitLabel={submitLabel}
            submitDisabled={submitDisabled}
            onClose={onClose}
            onSubmit={onSubmit}
        >
            <FormTableSection>{children}</FormTableSection>
        </BaseFormDialog>
    );
}

export { FormTableRow };
