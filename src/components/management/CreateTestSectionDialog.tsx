import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { CreateTestSectionRequest } from '@/api_calls/UserData';
import FormTableDialog, { FormTableRow } from '@/components/management/FormTableDialog';

interface CreateTestSectionDialogProps {
  open: boolean;
  saving?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: CreateTestSectionRequest) => Promise<void> | void;
}

export default function CreateTestSectionDialog({
  open,
  saving = false,
  error,
  onClose,
  onSubmit,
}: CreateTestSectionDialogProps) {
  const [section, setSection] = useState('');
  const [score, setScore] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setSection('');
    setScore('');
  }, [open]);

  const parsedScore = Number(score);

  return (
    <FormTableDialog
      open={open}
      saving={saving}
      title="Create Test Section"
      error={error}
      submitLabel="Create"
      submitDisabled={!section.trim() || !Number.isFinite(parsedScore) || parsedScore < 0}
      onClose={onClose}
      onSubmit={() => onSubmit({
        section: section.trim(),
        score: parsedScore,
      })}
    >
      <FormTableRow label="Section" required>
        <Input
          id="test-section-name"
          value={section}
          onChange={(event) => setSection(event.target.value)}
          placeholder="Reading, Speaking, Grammar..."
          disabled={saving}
        />
      </FormTableRow>

      <FormTableRow label="Score" required>
        <Input
          id="test-section-score"
          type="number"
          min="0"
          step="any"
          value={score}
          onChange={(event) => setScore(event.target.value)}
          placeholder="0"
          disabled={saving}
        />
      </FormTableRow>
    </FormTableDialog>
  );
}
