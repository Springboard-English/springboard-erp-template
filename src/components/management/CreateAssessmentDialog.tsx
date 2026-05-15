import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import type { CreateTestAssessmentRequest, InlineOption } from '@/api_calls/UserData';
import FormTableDialog, { FormTableRow } from '@/components/management/FormTableDialog';

export type CreateAssessmentDialogValues = Omit<CreateTestAssessmentRequest, 'test_key'>;

type AssessmentFieldRow = {
  key: string;
  score: string;
  feedback: string;
};

interface CreateAssessmentDialogProps {
  open: boolean;
  saving?: boolean;
  error?: string | null;
  scoreParts: string[];
  sessionOptions: InlineOption[];
  selectedSessionKey: string;
  showSessionSelector?: boolean;
  onSessionKeyChange: (value: string) => void;
  registrationOptions: InlineOption[];
  loadingRegistrations?: boolean;
  onClose: () => void;
  onSubmit: (values: CreateAssessmentDialogValues) => Promise<void> | void;
}

function createRows(scoreParts: string[]): AssessmentFieldRow[] {
  return scoreParts.map((key) => ({
    key,
    score: '',
    feedback: '',
  }));
}

export default function CreateAssessmentDialog({
  open,
  saving = false,
  error,
  scoreParts,
  sessionOptions,
  selectedSessionKey,
  showSessionSelector = true,
  onSessionKeyChange,
  registrationOptions,
  loadingRegistrations = false,
  onClose,
  onSubmit,
}: CreateAssessmentDialogProps) {
  const [registrationKey, setRegistrationKey] = useState('');
  const [rows, setRows] = useState<AssessmentFieldRow[]>(() => createRows(scoreParts));
  const [suggestions, setSuggestions] = useState('');
  const [projections, setProjections] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setRegistrationKey('');
    onSessionKeyChange('');
    setRows(createRows(scoreParts));
    setSuggestions('');
    setProjections('');
  }, [open, scoreParts]);

  useEffect(() => {
    setRegistrationKey('');
  }, [selectedSessionKey]);

  useEffect(() => {
    if (showSessionSelector || selectedSessionKey || sessionOptions.length === 0) {
      return;
    }

    onSessionKeyChange(sessionOptions[0].value);
  }, [showSessionSelector, selectedSessionKey, sessionOptions, onSessionKeyChange]);

  const handleSubmit = async () => {
    const scores = rows.reduce<Record<string, number>>((acc, row) => {
      const trimmed = row.score.trim();
      if (!trimmed) {
        return acc;
      }

      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) {
        acc[row.key] = parsed;
      }
      return acc;
    }, {});

    const feedbacks = rows.reduce<Record<string, string>>((acc, row) => {
      const trimmed = row.feedback.trim();
      if (trimmed) {
        acc[row.key] = trimmed;
      }
      return acc;
    }, {});

    await onSubmit({
      registration_key: registrationKey.trim(),
      scores: Object.keys(scores).length > 0 ? scores : null,
      feedbacks: Object.keys(feedbacks).length > 0 ? feedbacks : null,
      suggestions: suggestions.trim() || null,
      projections: projections.trim() || null,
    });
  };

  return (
    <FormTableDialog
      open={open}
      saving={saving}
      title="Create Assessment"
      error={error}
      submitLabel="Create"
      submitDisabled={!registrationKey.trim()}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {showSessionSelector && (
        <FormTableRow label="Class">
          <SearchableSelect
            id="assessment-session-key"
            value={selectedSessionKey}
            onValueChange={onSessionKeyChange}
            disabled={saving}
            options={[
              { value: '', label: '-- Class --' },
              ...sessionOptions.map((option) => ({ value: option.value, label: option.name })),
            ]}
            placeholder="-- Class --"
            searchPlaceholder="Search classes..."
          />
        </FormTableRow>
      )}

      <FormTableRow label="Registration Key" required>
        <SearchableSelect
          id="assessment-registration-key"
          value={registrationKey}
          onValueChange={setRegistrationKey}
          disabled={saving || !selectedSessionKey || loadingRegistrations}
          options={[
            {
              value: '',
              label: loadingRegistrations
                ? 'Loading registrations...'
                : '-- Registration --',
            },
            ...registrationOptions.map((option) => ({ value: option.value, label: option.name })),
          ]}
          placeholder={loadingRegistrations ? 'Loading registrations...' : '-- Registration --'}
          searchPlaceholder="Search registrations..."
        />
      </FormTableRow>

      <FormTableRow label="Scores and Feedbacks">
        <section className="space-y-3">
          <div className="grid gap-3">
            {rows.map((row, index) => (
              <div
                key={row.key}
                className="grid gap-3 rounded-2xl border border-border/70 p-4"
              >
                <div className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:grid-cols-[minmax(0,0.9fr)_minmax(8rem,0.55fr)_minmax(0,1.65fr)]">
                  <div>Part</div>
                  <div>Score</div>
                  <div>Feedback</div>
                </div>
                <div className="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(8rem,0.55fr)_minmax(0,1.65fr)] md:items-stretch h-full">
                  <div className="flex min-h-10 items-center rounded-xl border border-border/70 bg-muted/20 px-4 text-sm font-medium">
                    {row.key}
                  </div>
                  <Input
                    type="number"
                    step="any"
                    value={row.score}
                    onChange={(event) => setRows((prev) => prev.map((entry, entryIndex) => (
                      entryIndex === index ? { ...entry, score: event.target.value } : entry
                    )))}
                    disabled={saving}
                    className="resize-none h-full"
                  />
                  <Textarea
                    value={row.feedback}
                    onChange={(event) => setRows((prev) => prev.map((entry, entryIndex) => (
                      entryIndex === index ? { ...entry, feedback: event.target.value } : entry
                    )))}
                    disabled={saving}
                    className="resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </FormTableRow>

      <FormTableRow label="Suggestions">
        <Textarea
          id="assessment-suggestions"
          value={suggestions}
          onChange={(event) => setSuggestions(event.target.value)}
          rows={4}
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="Projections">
        <Textarea
          id="assessment-projections"
          value={projections}
          onChange={(event) => setProjections(event.target.value)}
          rows={4}
          disabled={saving}
        />
      </FormTableRow>
    </FormTableDialog>
  );
}
