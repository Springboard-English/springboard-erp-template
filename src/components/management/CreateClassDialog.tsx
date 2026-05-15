import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import type { InlineOption } from '@/api_calls/UserData';
import FormTableDialog, { FormTableRow } from '@/components/management/FormTableDialog';

export interface CreateClassDialogValues {
  group_key: string;
  class_name: string;
  date_start: string | null;
  date_end: string | null;
  status: string;
}

interface CreateClassDialogProps {
  open: boolean;
  saving?: boolean;
  error?: string | null;
  groupOptions: InlineOption[];
  groupOptionsLoading?: boolean;
  defaultStatus?: string;
  onClose: () => void;
  onSubmit: (values: CreateClassDialogValues) => Promise<void> | void;
}

const STATUS_OPTIONS = ['Active', 'Recruiting', 'Completed'] as const;

export default function CreateClassDialog({
  open,
  saving = false,
  error,
  groupOptions,
  groupOptionsLoading = false,
  defaultStatus = 'Active',
  onClose,
  onSubmit,
}: CreateClassDialogProps) {
  const [groupKey, setGroupKey] = useState('');
  const [className, setClassName] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [status, setStatus] = useState(defaultStatus);

  useEffect(() => {
    if (!open) {
      return;
    }

    setGroupKey('');
    setClassName('');
    setDateStart('');
    setDateEnd('');
    setStatus(defaultStatus);
  }, [defaultStatus, open]);

  const handleSubmit = async () => {
    await onSubmit({
      group_key: groupKey.trim(),
      class_name: className.trim(),
      date_start: dateStart.trim() || null,
      date_end: dateEnd.trim() || null,
      status: status.trim() || 'Active',
    });
  };

  return (
    <FormTableDialog
      open={open}
      saving={saving}
      title="Create Class"
      error={error}
      submitLabel="Create"
      submitDisabled={groupOptionsLoading || !groupKey.trim() || !className.trim()}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormTableRow label="Class Group" required>
        <SearchableSelect
          id="class-group"
          value={groupKey}
          onValueChange={setGroupKey}
          disabled={saving || groupOptionsLoading}
          options={[
            { value: '', label: groupOptionsLoading ? 'Loading groups...' : '-- Group --' },
            ...groupOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={groupOptionsLoading ? 'Loading groups...' : '-- Group --'}
          searchPlaceholder="Search groups..."
        />
      </FormTableRow>

      <FormTableRow label="Class Name" required>
        <Input
          id="class-name"
          value={className}
          onChange={(event) => setClassName(event.target.value)}
          placeholder="Class name"
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="Start Date">
        <Input
          id="class-date-start"
          type="date"
          value={dateStart}
          onChange={(event) => setDateStart(event.target.value)}
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="End Date">
        <Input
          id="class-date-end"
          type="date"
          value={dateEnd}
          onChange={(event) => setDateEnd(event.target.value)}
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="Status">
        <SearchableSelect
          id="class-status"
          value={status}
          onValueChange={setStatus}
          disabled={saving}
          options={STATUS_OPTIONS.map((option) => ({ value: option, label: option }))}
          searchPlaceholder="Search status..."
        />
      </FormTableRow>
    </FormTableDialog>
  );
}
