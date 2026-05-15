import { Save, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PendingChangesBarProps {
  pendingCount: number;
  saving?: boolean;
  onSave: () => void | Promise<void>;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  dimmed?: boolean;
  disabled?: boolean;
}

export default function PendingChangesBar({
  pendingCount,
  saving = false,
  onSave,
  onCancel,
  saveLabel = 'Save changes',
  cancelLabel = 'Cancel',
  dimmed = false,
  disabled = false,
}: PendingChangesBarProps) {
  if (pendingCount <= 0) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'fixed bottom-3 left-3 right-3 z-[80] flex items-center justify-between gap-3 rounded-2xl border border-border/70 px-4 py-3 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.4)] backdrop-blur md:bottom-6 md:left-[calc(18rem+1.5rem)] md:right-6',
        dimmed ? 'bg-muted/80 opacity-80 shadow-none' : 'bg-card/95',
      )}
    >
      <div className="min-w-0 text-sm text-muted-foreground">
        Unsaved pending changes
      </div>
      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        {onCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={saving || disabled}
          >
            <X className="size-4" />
            {cancelLabel}
          </Button>
        )}
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving || disabled}
        >
          <Save className="size-4" />
          {saving ? 'Saving...' : saveLabel}
        </Button>
      </div>
    </div>,
    document.body,
  );
}
