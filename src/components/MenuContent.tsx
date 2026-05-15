import {
  CalendarDays,
  GraduationCap,
  NotebookPen,
  MessageSquareMore,
  LayoutDashboard,
  Presentation,
  ScreenShare,
  type LucideIcon,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext';
import type { PermissionLevel } from '../routing/navigation';

export type { PermissionLevel } from '../routing/navigation';

type MenuItemConfig = {
  text: string;
  id: string;
  icon: LucideIcon;
};

const MANAGEMENT_MENU_ITEMS: MenuItemConfig[] = [
  { text: 'Classes', id: 'classes', icon: GraduationCap },
  { text: 'Sessions', id: 'sessions', icon: ScreenShare },
  { text: 'Schedules', id: 'schedules', icon: CalendarDays },
  { text: 'Tests', id: 'tests', icon: NotebookPen },
  { text: 'Feedbacks', id: 'feedbacks', icon: MessageSquareMore },
];

const NORMAL_USER_MENU_ITEMS: MenuItemConfig[] = [
  { text: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
  { text: 'Sessions', id: 'sessions', icon: Presentation },
];

const TAB_LABELS: Record<string, string> = {
  classes: 'Classes',
  dashboard: 'Dashboard',
  sessions: 'Sessions',
  schedules: 'Schedules',
  tests: 'Tests',
  feedbacks: 'Feedbacks',
  recordings: 'Recordings',
};

export interface MenuContentProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  permissionLevel?: PermissionLevel;
  setPermissionLevel?: (level: PermissionLevel) => void;
  collapsed?: boolean;
}

export function getTabLabel(tab = 'dashboard') {
  return TAB_LABELS[tab] ?? 'Dashboard';
}

function NavigationMenu({
  activeTab = 'dashboard',
  collapsed = false,
  items,
  setActiveTab,
}: {
  activeTab?: string;
  collapsed?: boolean;
  items: MenuItemConfig[];
  setActiveTab?: (tab: string) => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <Button
            key={item.id}
            type="button"
            variant={isActive ? 'secondary' : 'ghost'}
            title={collapsed ? item.text : undefined}
            aria-label={collapsed ? item.text : undefined}
            className={cn(
              'h-11 w-full rounded-xl text-sm font-medium',
              collapsed ? 'justify-center px-0' : 'justify-start gap-3 px-3',
              isActive && 'shadow-none',
            )}
            onClick={() => setActiveTab?.(item.id)}
          >
            <Icon className="size-4" />
            <span className={collapsed ? 'sr-only' : undefined}>{item.text}</span>
          </Button>
        );
      })}
    </nav>
  );
}

function ManagementMenuContent({
  activeTab = 'dashboard',
  collapsed = false,
  setActiveTab,
}: Pick<MenuContentProps, 'activeTab' | 'collapsed' | 'setActiveTab'>) {
  return (
    <NavigationMenu
      activeTab={activeTab}
      collapsed={collapsed}
      items={MANAGEMENT_MENU_ITEMS}
      setActiveTab={setActiveTab}
    />
  );
}

function NormalUserMenuContent({
  activeTab = 'dashboard',
  collapsed = false,
  setActiveTab,
}: Pick<MenuContentProps, 'activeTab' | 'collapsed' | 'setActiveTab'>) {
  const { user } = useAuth();
  const mainListItems = [...NORMAL_USER_MENU_ITEMS];

  if (user?.account_type === 'student') {
    mainListItems.push({
      text: 'Recordings',
      id: 'recordings',
      icon: Video,
    });
  }

  return (
    <NavigationMenu
      activeTab={activeTab}
      collapsed={collapsed}
      items={mainListItems}
      setActiveTab={setActiveTab}
    />
  );
}

export default function MenuContent({
  activeTab = 'dashboard',
  collapsed = false,
  setActiveTab,
  permissionLevel = 'normal_user',
}: MenuContentProps) {
  if (permissionLevel === 'management') {
    return (
      <ManagementMenuContent
        activeTab={activeTab}
        collapsed={collapsed}
        setActiveTab={setActiveTab}
      />
    );
  }

  return (
    <NormalUserMenuContent
      activeTab={activeTab}
      collapsed={collapsed}
      setActiveTab={setActiveTab}
    />
  );
}
