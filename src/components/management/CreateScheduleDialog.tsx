import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  fetchAccountOptions,
  fetchDayblockOptions,
  fetchInlineEmployeeOptions,
  fetchInlineSessionClassOptions,
  type InlineOption,
} from '@/api_calls/UserData';
import FormTableDialog, { FormTableRow } from '@/components/management/FormTableDialog';
import { toBackendTimeValue } from '@/utils/formatters';

export interface CreateScheduleDialogValues {
  class_key: string;
  dayblock: string;
  day: string;
  type: string;
  time_start: string;
  time_end: string;
  mentor_key: string | null;
  ta_key: string | null;
  account_key: string | null;
  date_start: string | null;
  date_end: string | null;
}

interface CreateScheduleDialogProps {
  open: boolean;
  saving?: boolean;
  error?: string | null;
  defaultClassKey?: string;
  defaultType?: string;
  defaultDateStart?: string;
  defaultDateEnd?: string;
  onClose: () => void;
  onSubmit: (values: CreateScheduleDialogValues) => Promise<void> | void;
}

const SCHEDULE_TYPE_OPTIONS = ['Permanent', 'Temporary'] as const;
const DAY_OPTIONS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

function isTemporaryScheduleType(type: string) {
  return type.trim().toLowerCase() === 'temporary';
}

export default function CreateScheduleDialog({
  open,
  saving = false,
  error,
  defaultClassKey = '',
  defaultType = 'Permanent',
  defaultDateStart = '',
  defaultDateEnd = '',
  onClose,
  onSubmit,
}: CreateScheduleDialogProps) {
  const [classKey, setClassKey] = useState('');
  const [dayblock, setDayblock] = useState('');
  const [day, setDay] = useState('');
  const [type, setType] = useState(defaultType);
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [mentorKey, setMentorKey] = useState('');
  const [taKey, setTaKey] = useState('');
  const [accountKey, setAccountKey] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [classesError, setClassesError] = useState<string | null>(null);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [dayblocksError, setDayblocksError] = useState<string | null>(null);
  const classOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['inlineSessionClassOptions'],
    queryFn: () => fetchInlineSessionClassOptions(),
    enabled: open,
  });
  const employeeOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['inlineEmployeeOptions'],
    queryFn: () => fetchInlineEmployeeOptions(),
    enabled: open,
  });
  const accountOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['accountOptions', day, dayblock],
    queryFn: () => fetchAccountOptions(-1, 0, undefined, { day, dayblock }),
    enabled: open,
  });
  const dayblockOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['dayblockOptions'],
    queryFn: () => fetchDayblockOptions(),
    enabled: open,
  });
  const classesLoading = classOptionsQuery.isFetching;
  const employeesLoading = employeeOptionsQuery.isFetching;
  const accountsLoading = accountOptionsQuery.isFetching;
  const dayblocksLoading = dayblockOptionsQuery.isFetching;
  const classOptions = classOptionsQuery.data ?? [];
  const employeeOptions = employeeOptionsQuery.data ?? [];
  const accountOptions = accountOptionsQuery.data ?? [];
  const dayblockOptions = dayblockOptionsQuery.data ?? [];

  const isTemporarySchedule = useMemo(() => isTemporaryScheduleType(type), [type]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setClassKey(defaultClassKey);
    setDayblock('');
    setDay('');
    setType(defaultType);
    setTimeStart('');
    setTimeEnd('');
    setMentorKey('');
    setTaKey('');
    setAccountKey('');
    setDateStart(defaultDateStart);
    setDateEnd(defaultDateEnd);
  }, [defaultClassKey, defaultDateEnd, defaultDateStart, defaultType, open]);

  useEffect(() => {
    if (classOptionsQuery.error) {
      setClassesError(classOptionsQuery.error instanceof Error ? classOptionsQuery.error.message : 'Failed to load class options');
    } else {
      setClassesError(null);
    }
  }, [classOptionsQuery.error]);

  useEffect(() => {
    if (employeeOptionsQuery.error) {
      setEmployeesError(employeeOptionsQuery.error instanceof Error ? employeeOptionsQuery.error.message : 'Failed to load employee options');
    } else {
      setEmployeesError(null);
    }
  }, [employeeOptionsQuery.error]);

  useEffect(() => {
    if (accountOptionsQuery.error) {
      setAccountsError(accountOptionsQuery.error instanceof Error ? accountOptionsQuery.error.message : 'Failed to load account options');
      return;
    }
    setAccountsError(null);
    if (!accountOptionsQuery.data) {
      return;
    }
    setAccountKey((current) => (
      current && !accountOptionsQuery.data.some((option) => option.value === current)
        ? ''
        : current
    ));
  }, [accountOptionsQuery.data, accountOptionsQuery.error]);

  useEffect(() => {
    if (dayblockOptionsQuery.error) {
      setDayblocksError(dayblockOptionsQuery.error instanceof Error ? dayblockOptionsQuery.error.message : 'Failed to load day block options');
    } else {
      setDayblocksError(null);
    }
  }, [dayblockOptionsQuery.error]);

  const handleSubmit = async () => {
    const timeStartValue = toBackendTimeValue(timeStart);
    const timeEndValue = toBackendTimeValue(timeEnd);

    if (!timeStartValue || !timeEndValue) {
      return;
    }

    await onSubmit({
      class_key: classKey.trim(),
      dayblock: dayblock.trim(),
      day: day.trim(),
      type: type.trim(),
      time_start: timeStartValue,
      time_end: timeEndValue,
      mentor_key: mentorKey.trim() || null,
      ta_key: taKey.trim() || null,
      account_key: accountKey.trim() || null,
      date_start: isTemporarySchedule ? dateStart.trim() || null : null,
      date_end: isTemporarySchedule ? dateEnd.trim() || null : null,
    });
  };

  const submitDisabled = !classKey.trim()
    || !dayblock.trim()
    || !day.trim()
    || !type.trim()
    || !timeStart.trim()
    || !timeEnd.trim();

  const combinedError = [error, classesError, employeesError, accountsError, dayblocksError]
    .filter((entry): entry is string => Boolean(entry))
    .join('\n');

  return (
    <FormTableDialog
      open={open}
      saving={saving}
      title="Create Schedule"
      error={combinedError || null}
      submitLabel="Create"
      submitDisabled={submitDisabled}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormTableRow label="Class" required>
        <SearchableSelect
          id="schedule-class"
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

      <FormTableRow label="Type" required>
        <SearchableSelect
          id="schedule-type"
          value={type}
          onValueChange={setType}
          disabled={saving}
          options={SCHEDULE_TYPE_OPTIONS.map((option) => ({ value: option, label: option }))}
          placeholder="Select type"
        />
      </FormTableRow>

      <FormTableRow label="Day" required>
        <SearchableSelect
          id="schedule-day"
          value={day}
          onValueChange={setDay}
          disabled={saving}
          options={DAY_OPTIONS.map((option) => ({ value: option, label: option }))}
          placeholder="Select day"
        />
      </FormTableRow>

      <FormTableRow label="Day Block" required>
        <SearchableSelect
          id="schedule-dayblock"
          value={dayblock}
          onValueChange={setDayblock}
          disabled={saving || dayblocksLoading}
          options={[
            { value: '', label: dayblocksLoading ? 'Loading day blocks...' : '-- Day block --' },
            ...dayblockOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={dayblocksLoading ? 'Loading day blocks...' : '-- Day block --'}
          searchPlaceholder="Search day blocks..."
        />
      </FormTableRow>

      <FormTableRow label="Start Time" required>
        <Input
          id="schedule-time-start"
          type="time"
          value={timeStart}
          onChange={(event) => setTimeStart(event.target.value)}
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="End Time" required>
        <Input
          id="schedule-time-end"
          type="time"
          value={timeEnd}
          onChange={(event) => setTimeEnd(event.target.value)}
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="Mentor">
        <SearchableSelect
          id="schedule-mentor"
          value={mentorKey}
          onValueChange={setMentorKey}
          disabled={saving || employeesLoading}
          options={[
            { value: '', label: employeesLoading ? 'Loading mentors...' : 'Unassigned' },
            ...employeeOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={employeesLoading ? 'Loading mentors...' : 'Unassigned'}
          searchPlaceholder="Search mentors..."
        />
      </FormTableRow>

      <FormTableRow label="Teaching Assistant">
        <SearchableSelect
          id="schedule-ta"
          value={taKey}
          onValueChange={setTaKey}
          disabled={saving || employeesLoading}
          options={[
            { value: '', label: employeesLoading ? 'Loading assistants...' : 'Unassigned' },
            ...employeeOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={employeesLoading ? 'Loading assistants...' : 'Unassigned'}
          searchPlaceholder="Search assistants..."
        />
      </FormTableRow>

      <FormTableRow label="Account">
        <SearchableSelect
          id="schedule-account"
          value={accountKey}
          onValueChange={setAccountKey}
          disabled={saving || accountsLoading}
          options={[
            { value: '', label: accountsLoading ? 'Loading accounts...' : '-- Account --' },
            ...accountOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={accountsLoading ? 'Loading accounts...' : '-- Account --'}
          searchPlaceholder="Search accounts..."
        />
      </FormTableRow>

      {isTemporarySchedule && (
        <>
          <FormTableRow label="Date Start">
            <Input
              id="schedule-date-start"
              type="date"
              value={dateStart}
              onChange={(event) => setDateStart(event.target.value)}
              disabled={saving}
            />
          </FormTableRow>

          <FormTableRow label="Date End">
            <Input
              id="schedule-date-end"
              type="date"
              value={dateEnd}
              onChange={(event) => setDateEnd(event.target.value)}
              disabled={saving}
            />
          </FormTableRow>
        </>
      )}
    </FormTableDialog>
  );
}
