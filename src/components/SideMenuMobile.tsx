import AccountPanel from './AccountPanel';
import MenuContent, { MenuContentProps } from './MenuContent';
import { SitemarkIcon } from './CustomIcons';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';

interface SideMenuMobileProps extends MenuContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SideMenuMobile({
  open,
  onOpenChange,
  activeTab,
  setActiveTab,
  permissionLevel,
  setPermissionLevel,
}: SideMenuMobileProps) {
  const handleSetActiveTab = (tab: string) => {
    setActiveTab?.(tab);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(22rem,88vw)] gap-0 border-l border-border/70 bg-card/95 p-0 shadow-2xl"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <div className="flex h-full flex-col">
          <div className="border-b border-border/60 px-5 py-5">
            <div className="flex items-center justify-center">
              <SitemarkIcon />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <MenuContent
              activeTab={activeTab}
              setActiveTab={handleSetActiveTab}
              permissionLevel={permissionLevel}
              setPermissionLevel={setPermissionLevel}
            />
          </div>

          <div className="border-t border-border/60 p-3">
            <AccountPanel />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
