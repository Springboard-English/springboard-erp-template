import * as React from 'react';
import { Menu } from 'lucide-react';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';
import { getTabLabel, MenuContentProps } from './MenuContent';
import { useGlobalStatus } from '@/context/GlobalStatusContext';
import type { PermissionLevel } from '../routing/navigation';
import PermissionLevelSwitch from './PermissionLevelSwitch';

interface AppNavbarProps extends MenuContentProps {
  permissionLevel: PermissionLevel;
  setPermissionLevel: (level: PermissionLevel) => void;
}

export default function AppNavbar({
  activeTab,
  setActiveTab,
  permissionLevel,
  setPermissionLevel,
}: AppNavbarProps) {
  const [open, setOpen] = React.useState(false);
  const title = getTabLabel(activeTab);
  const { status } = useGlobalStatus();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur md:hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p
              className={[
                'inline-flex max-w-full truncate rounded-full border px-2 py-0.5 text-xs',
                status?.tone === 'error'
                  ? 'border-destructive/35 bg-destructive/10 text-destructive'
                  : 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300',
              ].join(' ')}
              aria-live={status ? 'polite' : undefined}
            >
              {status?.message || title}
            </p>
          </div>

          <PermissionLevelSwitch
            permissionLevel={permissionLevel}
            setPermissionLevel={setPermissionLevel}
          />
          <ColorModeIconDropdown />
          <MenuButton aria-label="Open navigation menu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </MenuButton>
        </div>
      </header>

      <SideMenuMobile
        open={open}
        onOpenChange={setOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        permissionLevel={permissionLevel}
        setPermissionLevel={setPermissionLevel}
      />
    </>
  );
}
