import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AccountPanel from './AccountPanel';
import MenuContent, { MenuContentProps } from './MenuContent';
import { SitemarkIcon } from './CustomIcons';

interface SideMenuProps extends MenuContentProps {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export default function SideMenu({
  activeTab,
  setActiveTab,
  collapsed = false,
  onToggleCollapsed,
  permissionLevel,
  setPermissionLevel,
}: SideMenuProps) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 border-r border-border/70 bg-card/95 transition-[width] duration-200 md:block',
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      <div className="relative flex h-full flex-col overflow-visible backdrop-blur">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute -right-4 top-6 z-10 hidden size-8 rounded-full border-border/70 bg-background shadow-sm md:flex"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>

        <div
          className={cn(
            'border-b border-border/60 py-5',
            collapsed ? 'px-3' : 'px-5',
          )}
        >
          <div className={cn('flex items-center', collapsed ? 'justify-center' : 'justify-start')}>
            {collapsed ? (
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                SB
              </div>
            ) : (
              <SitemarkIcon />
            )}
          </div>
        </div>

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-y-auto py-4',
            collapsed ? 'px-2' : 'px-3',
          )}
        >
          <MenuContent
            activeTab={activeTab}
            collapsed={collapsed}
            setActiveTab={setActiveTab}
            permissionLevel={permissionLevel}
            setPermissionLevel={setPermissionLevel}
          />
        </div>

        <div className={cn('border-t border-border/60', collapsed ? 'p-2' : 'p-3')}>
          <AccountPanel collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}
