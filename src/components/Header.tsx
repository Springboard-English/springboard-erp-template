import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';
import { useGlobalStatus } from '@/context/GlobalStatusContext';
import type { PermissionLevel } from '../routing/navigation';
import PermissionLevelSwitch from './PermissionLevelSwitch';

interface HeaderProps {
  permissionLevel: PermissionLevel;
  setPermissionLevel: (level: PermissionLevel) => void;
}

export default function Header({
  permissionLevel,
  setPermissionLevel,
}: HeaderProps) {
  const { status } = useGlobalStatus();

  return (
    <div className="hidden w-full max-w-[1700px] items-center justify-end gap-3 pt-2 md:flex">
      <div className="flex min-w-0 items-center justify-end gap-2">
        {status && (
          <p
            className={[
              'max-w-[48rem] truncate rounded-full border px-3 py-1 text-sm',
              status.tone === 'error'
                ? 'border-destructive/35 bg-destructive/10 text-destructive'
                : 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300',
            ].join(' ')}
            aria-live="polite"
          >
            {status.message}
          </p>
        )}
        <PermissionLevelSwitch
          permissionLevel={permissionLevel}
          setPermissionLevel={setPermissionLevel}
        />
        <ColorModeIconDropdown />
      </div>
    </div>
  );
}
