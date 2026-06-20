import type { ReactNode } from 'react';
import BaseFormDialog from '@/components/dialogs/BaseFormDialog';
import FormTableSection, { FormTableRow } from '@/components/dialogs/FormTableSection';
import { useI18n } from '@/context/I18nContext';

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
    submitLabel,
    submitDisabled = false,
    onClose,
    onSubmit,
    children,
}: FormTableDialogProps) {
    const { t } = useI18n();
    return (
        <BaseFormDialog
            open={open}
            saving={saving}
            title={title}
            description={description}
            error={error}
            submitLabel={submitLabel ?? t('common.create')}
            submitDisabled={submitDisabled}
            onClose={onClose}
            onSubmit={onSubmit}
        >
            <FormTableSection>{children}</FormTableSection>
        </BaseFormDialog>
    );
}

export { FormTableRow };
