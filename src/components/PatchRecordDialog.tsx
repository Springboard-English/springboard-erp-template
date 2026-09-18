import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
// Relative, not `@/`: these types land in this module's emitted .d.ts, and tsc
// writes the specifier verbatim — a consumer would resolve `@/` against its own
// src and silently get `any`. `scripts/check-dts-portable.mjs` enforces it.
import type {
  SearchableSelectLoadParams,
  SearchableSelectOption,
  SearchableSelectPage,
} from './ui/searchable-select';
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
  /**
   * The whole option list, for a `select` whose choices are genuinely finite —
   * a status, a day of the week. For anything backed by a listing endpoint use
   * {@link loadOptions} instead: filling this from a drained endpoint is what
   * made seven views fetch every employee on mount to populate one dropdown.
   */
  options?: PatchFieldOption[];
  /**
   * Cursor-paged options for a `select`, fetched as the user opens, searches
   * and clicks "Load more". Takes precedence over {@link options}, which the
   * underlying `SearchableSelect` ignores entirely in async mode.
   *
   * Build one with `toLoadOptions` (or an app's `createInlineOptionLoader`) so
   * the picker shares its resource's page fetcher rather than inventing a fifth
   * page shape. The dialog pins its own "clear" entry to the unfiltered first
   * page, so the loader should not supply one.
   */
  loadOptions?: (params: SearchableSelectLoadParams) => Promise<SearchableSelectPage>;
  /**
   * The currently selected option, for {@link loadOptions} fields. Needed
   * because the selected row may not appear in any page that has been loaded —
   * without it the trigger falls back to rendering the raw key.
   */
  selectedOption?: SearchableSelectOption;
  placeholder?: string;
  multiline?: boolean;
  minRows?: number;
  helperText?: string;
  readOnly?: boolean;
  /**
   * Grouping hints for dialogs that lay fields out in sections. This dialog
   * renders one flat table and ignores both; they live here so a sectioned
   * form (CRM's `RecordFormDialog`) can share one field-config type instead of
   * forking it — which is how the two copies drifted apart before.
   */
  section?: string;
  sectionDescription?: string;
}

interface PatchRecordDialogProps {
  open: boolean;
  title: string;
  fields: PatchFieldConfig[];
  initialValues: Record<string, unknown>;
  error?: string | null;
  saving?: boolean;
  /** Overrides the default "only modified fields are sent" blurb. */
  description?: string;
  /** Overrides the default "Save" button label. */
  submitLabel?: string;
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

/**
 * Pins the "clear this field" entry to the top of an async option list.
 *
 * In static mode the dialog prepends it to `options`; in async mode `options`
 * is ignored, so it has to ride along with the first page instead. Only the
 * UNFILTERED first page, matching `toLoadOptions`' rule for sentinels: repeated
 * on page two, or surviving a search that excludes it, it reads as a result.
 */
function withClearOption(
  load: (params: SearchableSelectLoadParams) => Promise<SearchableSelectPage>,
  clearLabel: string,
): (params: SearchableSelectLoadParams) => Promise<SearchableSelectPage> {
  return async (params) => {
    const page = await load(params);
    if (params.cursor !== null || params.query.trim()) {
      return page;
    }

    return { ...page, options: [{ value: '', label: clearLabel }, ...page.options] };
  };
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
  description,
  submitLabel,
  onClose,
  onSubmit,
}: PatchRecordDialogProps) {
  const { t } = useI18n();
  const [rows, setRows] = useState<PatchFormRow[]>([]);
  // What the user picked this session, by field key. An async picker only knows
  // the label of an option it has loaded, and the pages are discarded when the
  // popover closes — without this the trigger reverts to showing the raw key
  // the moment the list is dropped.
  const [pickedOptions, setPickedOptions] = useState<
    Record<string, SearchableSelectOption>
  >({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setPickedOptions({});

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
      description={description ?? t('patchRecord.description')}
      error={error}
      submitLabel={submitLabel ?? t('common.save')}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {rows.map((row) => {
        const stringValue = typeof row.value === 'string' ? row.value : '';
        const isMultiline = row.type === 'text' && (row.multiline || shouldAutoExpandField(stringValue));
        const selectPlaceholder =
          row.placeholder ?? t('patchRecord.placeholder', undefined, { label: row.label });

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
                onOptionSelect={(option) => {
                  setPickedOptions((prev) => ({ ...prev, [row.key]: option }));
                }}
                disabled={row.readOnly}
                // Async mode ignores `options` wholesale, so the two are passed
                // as alternatives rather than layered.
                loadOptions={
                  row.loadOptions
                    ? withClearOption(row.loadOptions, selectPlaceholder)
                    : undefined
                }
                selectedOption={pickedOptions[row.key] ?? row.selectedOption}
                options={
                  row.loadOptions
                    ? undefined
                    : [
                        { value: '', label: selectPlaceholder },
                        ...(row.options ?? []).map((option) => ({ value: option.value, label: option.label })),
                      ]
                }
                placeholder={selectPlaceholder}
                searchPlaceholder={t('patchRecord.searchField', undefined, { label: row.label.toLowerCase() })}
              />
            ) : isMultiline ? (
              <Textarea
                value={stringValue}
                onChange={(event) => handleValueChange(row.key, event.target.value)}
                readOnly={row.readOnly}
                disabled={row.readOnly}
                rows={getAutoExpandRows(stringValue, row.minRows)}
                placeholder={row.placeholder ?? row.label}
                className="resize-y"
              />
            ) : (
              <Input
                value={stringValue}
                type={getInputType(row.type)}
                onChange={(event) => handleValueChange(row.key, event.target.value)}
                readOnly={row.readOnly}
                disabled={row.readOnly}
                placeholder={row.placeholder ?? row.label}
              />
            )}
          </FormTableRow>
        );
      })}
    </FormTableDialog>
  );
}
