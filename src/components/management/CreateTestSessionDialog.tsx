import { SearchableSelect } from '@/components/ui/searchable-select';
import type { CreateTestSessionRequest, InlineOption } from '@/api_calls/UserData';
import FormTableDialog, { FormTableRow } from '@/components/management/FormTableDialog';

interface CreateTestSessionDialogProps {
  open: boolean;
  saving?: boolean;
  error?: string | null;
  classOptions: InlineOption[];
  sessionOptions: InlineOption[];
  selectedClassKey: string;
  selectedSessionKey: string;
  loadingClasses?: boolean;
  loadingSessions?: boolean;
  onClassKeyChange: (value: string) => void;
  onSessionKeyChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (values: CreateTestSessionRequest) => Promise<void> | void;
}

export default function CreateTestSessionDialog({
  open,
  saving = false,
  error,
  classOptions,
  sessionOptions,
  selectedClassKey,
  selectedSessionKey,
  loadingClasses = false,
  loadingSessions = false,
  onClassKeyChange,
  onSessionKeyChange,
  onClose,
  onSubmit,
}: CreateTestSessionDialogProps) {
  return (
    <FormTableDialog
      open={open}
      saving={saving}
      title="Create Test Session"
      description="Attach an existing session to this test."
      error={error}
      submitLabel="Create"
      submitDisabled={!selectedSessionKey.trim()}
      onClose={onClose}
      onSubmit={() => onSubmit({ session_key: selectedSessionKey.trim() })}
    >
      <FormTableRow
        label="Class"
        helperText={!loadingClasses && classOptions.length === 0 ? 'No inline classes returned for this test group.' : undefined}
      >
        <SearchableSelect
          id="test-session-class-key"
          value={selectedClassKey}
          onValueChange={onClassKeyChange}
          disabled={saving || loadingClasses}
          options={[
            { value: '', label: loadingClasses ? 'Loading classes...' : '-- Class --' },
            ...classOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={loadingClasses ? 'Loading classes...' : '-- Class --'}
          searchPlaceholder="Search classes..."
        />
      </FormTableRow>

      <FormTableRow
        label="Session"
        required
        helperText={!loadingSessions && selectedClassKey && sessionOptions.length === 0 ? 'No sessions available for the selected class.' : undefined}
      >
        <SearchableSelect
          id="test-session-key"
          value={selectedSessionKey}
          onValueChange={onSessionKeyChange}
          disabled={saving || !selectedClassKey || loadingSessions}
          options={[
            {
              value: '',
              label: loadingSessions
                ? 'Loading sessions...'
                : selectedClassKey
                  ? '-- Session --'
                  : 'Select class first',
            },
            ...sessionOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={loadingSessions ? 'Loading sessions...' : selectedClassKey ? '-- Session --' : 'Select class first'}
          searchPlaceholder="Search sessions..."
        />
      </FormTableRow>
    </FormTableDialog>
  );
}
