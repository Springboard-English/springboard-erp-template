import { useEffect, useState } from 'react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Input } from '@/components/ui/input';
import type { InlineOption } from '@/api_calls/UserData';
import FormTableDialog, { FormTableRow } from '@/components/management/FormTableDialog';

interface CreateTestDialogProps {
  open: boolean;
  saving?: boolean;
  error?: string | null;
  groupOptions: InlineOption[];
  loadingGroups?: boolean;
  onClose: () => void;
  onSubmit: (values: { group_key: string; name: string }) => Promise<void> | void;
}

export default function CreateTestDialog({
  open,
  saving = false,
  error,
  groupOptions,
  loadingGroups = false,
  onClose,
  onSubmit,
}: CreateTestDialogProps) {
  const [groupKey, setGroupKey] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setGroupKey('');
    setName('');
  }, [open]);

  const handleSubmit = async () => {
    await onSubmit({
      group_key: groupKey.trim(),
      name: name.trim(),
    });
  };

  return (
    <FormTableDialog
      open={open}
      saving={saving}
      title="Create Test"
      error={error}
      submitLabel="Create"
      submitDisabled={!groupKey.trim() || !name.trim()}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormTableRow label="Group" required>
        <SearchableSelect
          id="test-group-key"
          value={groupKey}
          onValueChange={setGroupKey}
          disabled={saving || loadingGroups}
          options={[
            { value: '', label: loadingGroups ? 'Loading groups...' : '-- Group --' },
            ...groupOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={loadingGroups ? 'Loading groups...' : '-- Group --'}
          searchPlaceholder="Search groups..."
        />
      </FormTableRow>

      <FormTableRow label="Name" required>
        <Input
          id="test-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Test name"
          disabled={saving}
        />
      </FormTableRow>
    </FormTableDialog>
  );
}
