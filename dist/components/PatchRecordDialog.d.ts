export type PatchFieldType = 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'select';
export interface PatchFieldOption {
    label: string;
    value: string;
}
export interface PatchFieldConfig {
    key: string;
    label: string;
    type: PatchFieldType;
    options?: PatchFieldOption[];
    multiline?: boolean;
    minRows?: number;
    helperText?: string;
    readOnly?: boolean;
}
interface PatchRecordDialogProps {
    open: boolean;
    title: string;
    fields: PatchFieldConfig[];
    initialValues: Record<string, unknown>;
    error?: string | null;
    saving?: boolean;
    onClose: () => void;
    onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
}
export default function PatchRecordDialog({ open, title, fields, initialValues, error, saving, onClose, onSubmit, }: PatchRecordDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
