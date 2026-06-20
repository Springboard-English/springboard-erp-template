import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import FormTableDialog, { FormTableRow } from '@/components/dialogs/FormTableDialog';
import { useI18n } from '@/context/I18nContext';

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

type PatchFormRow = PatchFieldConfig & {
  value: string | boolean;
  initialValue: string | boolean;
};

function normalizeValue(type: PatchFieldType, value: unknown): string | boolean {
  if (type === 'boolean') {
    return value === true;
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function shouldAutoExpandField(value: string): boolean {
  return value.includes('\n') || value.length > 80;
}

function getAutoExpandRows(value: string, minRows?: number): number {
  const newlineCount = value.split('\n').length;
  const wrappedLineEstimate = Math.ceil(value.length / 90);
  return Math.min(12, Math.max(minRows ?? 3, newlineCount, wrappedLineEstimate));
}

function getInputType(type: PatchFieldType) {
  if (type === 'number') {
    return 'number';
  }

  if (type === 'date') {
    return 'date';
  }

  return 'text';
}

export default function PatchRecordDialog({
  open,
  title,
  fields,
  initialValues,
  error,
  saving = false,
  onClose,
  onSubmit,
}: PatchRecordDialogProps) {
  const { t } = useI18n();
  const [rows, setRows] = useState<PatchFormRow[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setRows(fields.map((field) => {
      const normalizedValue = normalizeValue(field.type, initialValues[field.key]);
      return {
        ...field,
        value: normalizedValue,
        initialValue: normalizedValue,
      };
    }));
  }, [fields, initialValues, open]);

  const handleValueChange = (key: string, nextValue: string | boolean) => {
    setRows((prev) => prev.map((row) => (
      row.key === key
        ? { ...row, value: nextValue }
        : row
    )));
  };

  const handleSubmit = async () => {
    const payload = rows.reduce<Record<string, unknown>>((acc, row) => {
      if (row.value === row.initialValue || row.readOnly) {
        return acc;
      }

      if (row.type === 'boolean') {
        acc[row.key] = Boolean(row.value);
        return acc;
      }

      const textValue = typeof row.value === 'string' ? row.value.trim() : '';
      if (!textValue) {
        acc[row.key] = null;
        return acc;
      }

      if (row.type === 'number') {
        acc[row.key] = Number(textValue);
        return acc;
      }

      acc[row.key] = textValue;
      return acc;
    }, {});

    await onSubmit(payload);
  };

  return (
    <FormTableDialog
      open={open}
      saving={saving}
      title={title}
      description={t('patchRecord.description')}
      error={error}
      submitLabel={t('common.save')}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {rows.map((row) => {
        const stringValue = typeof row.value === 'string' ? row.value : '';
        const isMultiline = row.type === 'text' && (row.multiline || shouldAutoExpandField(stringValue));

        return (
          <FormTableRow
            key={row.key}
            label={row.label}
            helperText={row.helperText}
            align={isMultiline ? 'start' : 'center'}
          >
            {row.type === 'boolean' ? (
              <label className="inline-flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(row.value)}
                  disabled={row.readOnly}
                  onChange={(event) => handleValueChange(row.key, event.target.checked)}
                  className="size-4 rounded border-input accent-primary"
                />
                <span>{Boolean(row.value) ? t('patchRecord.enabled') : t('patchRecord.disabled')}</span>
              </label>
            ) : row.type === 'select' ? (
              <SearchableSelect
                value={stringValue}
                onValueChange={(value) => handleValueChange(row.key, value)}
                disabled={row.readOnly}
                options={[
                  { value: '', label: t('patchRecord.placeholder', undefined, { label: row.label }) },
                  ...(row.options ?? []).map((option) => ({ value: option.value, label: option.label })),
                ]}
                placeholder={t('patchRecord.placeholder', undefined, { label: row.label })}
                searchPlaceholder={t('patchRecord.searchField', undefined, { label: row.label.toLowerCase() })}
              />
            ) : isMultiline ? (
              <Textarea
                value={stringValue}
                onChange={(event) => handleValueChange(row.key, event.target.value)}
                readOnly={row.readOnly}
                disabled={row.readOnly}
                rows={getAutoExpandRows(stringValue, row.minRows)}
                placeholder={row.label}
                className="resize-y"
              />
            ) : (
              <Input
                value={stringValue}
                type={getInputType(row.type)}
                onChange={(event) => handleValueChange(row.key, event.target.value)}
                readOnly={row.readOnly}
                disabled={row.readOnly}
                placeholder={row.label}
              />
            )}
          </FormTableRow>
        );
      })}
    </FormTableDialog>
  );
}
