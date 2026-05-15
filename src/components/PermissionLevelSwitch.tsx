import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext';
import type { PermissionLevel } from '../routing/navigation';
import { canAccessManagement } from '../utils/userScopes';

interface PermissionLevelSwitchProps {
  className?: string;
  permissionLevel: PermissionLevel;
  setPermissionLevel: (level: PermissionLevel) => void;
}

const PERMISSION_OPTIONS: Array<{
  value: PermissionLevel;
  label: string;
}> = [
  { value: 'management', label: 'Management' },
  { value: 'normal_user', label: 'User' },
];

export default function PermissionLevelSwitch({
  className,
  permissionLevel,
  setPermissionLevel,
}: PermissionLevelSwitchProps) {
  const { user } = useAuth();

  if (!canAccessManagement(user)) {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex h-9 shrink-0 items-center rounded-md border border-border/70 bg-muted/45 p-0.5',
        className,
      )}
      role="group"
      aria-label="Permission level"
    >
      {PERMISSION_OPTIONS.map((option) => {
        const selected = permissionLevel === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className={cn(
              'h-8 rounded-[6px] px-2.5 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              selected
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
            aria-pressed={selected}
            onClick={() => setPermissionLevel(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
