import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  fetchAccountOptions,
  fetchInlineEmployeeOptions,
  fetchInlineSessionClassOptions,
  type InlineOption,
} from '@/api_calls/UserData';
import FormTableDialog, { FormTableRow } from '@/components/management/FormTableDialog';

export interface CreateSessionDialogValues {
  class_key: string;
  timestamp: string;
  duration: number;
  account: string;
  mentor: string | null;
  ta: string | null;
  password: string | null;
  attendees: boolean;
}

interface CreateSessionDialogProps {
  open: boolean;
  saving?: boolean;
  error?: string | null;
  defaultClassKey?: string;
  defaultTimestamp?: string;
  onClose: () => void;
  onSubmit: (values: CreateSessionDialogValues) => Promise<void> | void;
}

export default function CreateSessionDialog({
  open,
  saving = false,
  error,
  defaultClassKey = '',
  defaultTimestamp = '',
  onClose,
  onSubmit,
}: CreateSessionDialogProps) {
  const [classKey, setClassKey] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [duration, setDuration] = useState('60');
  const [account, setAccount] = useState('');
  const [mentor, setMentor] = useState('');
  const [ta, setTa] = useState('');
  const [password, setPassword] = useState('');
  const [attendees, setAttendees] = useState(true);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [classesError, setClassesError] = useState<string | null>(null);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const employeeOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['inlineEmployeeOptions'],
    queryFn: () => fetchInlineEmployeeOptions(),
    enabled: open,
  });
  const classOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['inlineSessionClassOptions'],
    queryFn: () => fetchInlineSessionClassOptions(),
    enabled: open,
  });
  const accountOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['accountOptions'],
    queryFn: () => fetchAccountOptions(),
    enabled: open,
  });
  const employeesLoading = employeeOptionsQuery.isFetching;
  const classesLoading = classOptionsQuery.isFetching;
  const accountsLoading = accountOptionsQuery.isFetching;
  const employeeOptions = employeeOptionsQuery.data ?? [];
  const classOptions = classOptionsQuery.data ?? [];
  const accountOptions = accountOptionsQuery.data ?? [];

  useEffect(() => {
    if (!open) {
      return;
    }

    setClassKey(defaultClassKey);
    setTimestamp(defaultTimestamp);
    setDuration('60');
    setAccount('');
    setMentor('');
    setTa('');
    setPassword('');
    setAttendees(true);
  }, [defaultClassKey, defaultTimestamp, open]);

  useEffect(() => {
    if (employeeOptionsQuery.error) {
      setEmployeesError(employeeOptionsQuery.error instanceof Error ? employeeOptionsQuery.error.message : 'Failed to load employee options');
    } else {
      setEmployeesError(null);
    }
  }, [employeeOptionsQuery.error]);

  useEffect(() => {
    if (classOptionsQuery.error) {
      setClassesError(classOptionsQuery.error instanceof Error ? classOptionsQuery.error.message : 'Failed to load class options');
    } else {
      setClassesError(null);
    }
  }, [classOptionsQuery.error]);

  useEffect(() => {
    if (accountOptionsQuery.error) {
      setAccountsError(accountOptionsQuery.error instanceof Error ? accountOptionsQuery.error.message : 'Failed to load account options');
    } else {
      setAccountsError(null);
    }
  }, [accountOptionsQuery.error]);

  const handleSubmit = async () => {
    await onSubmit({
      class_key: classKey.trim(),
      timestamp: timestamp.trim(),
      duration: Number(duration),
      account: account.trim(),
      mentor: mentor.trim() || null,
      ta: ta.trim() || null,
      password: password.trim() || null,
      attendees,
    });
  };

  const submitDisabled =
    !classKey.trim()
    || !timestamp.trim()
    || !account.trim()
    || !duration.trim()
    || !Number.isFinite(Number(duration))
    || Number(duration) <= 0;

  const combinedError = [error, classesError, accountsError, employeesError]
    .filter((entry): entry is string => Boolean(entry))
    .join('\n');

  return (
    <FormTableDialog
      open={open}
      saving={saving}
      title="Create Session"
      error={combinedError || null}
      submitLabel="Create"
      submitDisabled={submitDisabled}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormTableRow label="Class" required>
        <SearchableSelect
          id="session-class-inline"
          value={classKey}
          onValueChange={(value) => {
            if (!value) {
              return;
            }
            setClassKey(value);
          }}
          disabled={saving || classesLoading}
          options={[
            { value: '', label: classesLoading ? 'Loading classes...' : '-- Class --' },
            ...classOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={classesLoading ? 'Loading classes...' : '-- Class --'}
          searchPlaceholder="Search classes..."
        />
      </FormTableRow>

      <FormTableRow label="Account" required>
        <SearchableSelect
          id="session-account"
          value={account}
          onValueChange={setAccount}
          disabled={saving || accountsLoading}
          options={[
            { value: '', label: accountsLoading ? 'Loading accounts...' : '-- Account --' },
            ...accountOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={accountsLoading ? 'Loading accounts...' : '-- Account --'}
          searchPlaceholder="Search accounts..."
        />
      </FormTableRow>

      <FormTableRow label="Timestamp" required>
        <Input
          id="session-timestamp"
          type="datetime-local"
          value={timestamp}
          onChange={(event) => setTimestamp(event.target.value)}
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="Duration (min)" required>
        <Input
          id="session-duration"
          type="number"
          min="1"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          placeholder="60"
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="Mentor">
        <SearchableSelect
          id="session-mentor"
          value={mentor}
          onValueChange={setMentor}
          disabled={saving || employeesLoading}
          options={[
            { value: '', label: employeesLoading ? 'Loading employees...' : '-- Mentor --' },
            ...employeeOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={employeesLoading ? 'Loading employees...' : '-- Mentor --'}
          searchPlaceholder="Search mentors..."
        />
      </FormTableRow>

      <FormTableRow label="Teaching Assistant">
        <SearchableSelect
          id="session-ta"
          value={ta}
          onValueChange={setTa}
          disabled={saving || employeesLoading}
          options={[
            { value: '', label: employeesLoading ? 'Loading employees...' : '-- Teaching Assistant --' },
            ...employeeOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={employeesLoading ? 'Loading employees...' : '-- Teaching Assistant --'}
          searchPlaceholder="Search assistants..."
        />
      </FormTableRow>

      <FormTableRow label="Password">
        <Input
          id="session-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Optional meeting password"
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="Attendees">
        <label className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={attendees}
            onChange={(event) => setAttendees(event.target.checked)}
            className="size-4 rounded border-input accent-primary"
            disabled={saving}
          />
          Generate attendees from class registrations
        </label>
      </FormTableRow>
    </FormTableDialog>
  );
}
