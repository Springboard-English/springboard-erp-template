import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import Header from './Header';
import SideMenu from './SideMenu';
import AppTheme from '../theme/AppTheme';
import { useAuth } from '../context/AuthContext';
import { GlobalStatusProvider } from '../context/GlobalStatusContext';
import LazyViewFallback from './LazyViewFallback';
import {
  getActiveTabFromPath,
  getPathForPermissionLevel,
  getPathForTab,
  PermissionLevel,
} from '../routing/navigation';

interface DashboardLayoutProps {
  disableCustomTheme?: boolean;
  permissionLevel: PermissionLevel;
  setPermissionLevel: (level: PermissionLevel) => void;
}

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'dashboard-sidebar-collapsed-v2';

export default function DashboardLayout({
  disableCustomTheme,
  permissionLevel,
  setPermissionLevel,
}: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = getActiveTabFromPath(location.pathname);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const storedValue = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
    return storedValue === null ? true : storedValue === 'true';
  });

  useEffect(() => {
    localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      String(isSidebarCollapsed),
    );
  }, [isSidebarCollapsed]);

  const handleSetActiveTab = (tab: string) => {
    const nextPath = getPathForTab(tab, permissionLevel, user?.account_type);
    const currentPathWithQuery = `${location.pathname}${location.search}${location.hash}`;

    if (nextPath !== currentPathWithQuery) {
      navigate(nextPath);
      return;
    }

    // Re-clicking the active sidebar tab should reset list/detail views that share a route.
    navigate(nextPath, {
      replace: true,
      state: {
        sidebarResetTab: tab,
        sidebarResetAt: Date.now(),
      },
    });
  };

  const handleSetPermissionLevel = (nextPermissionLevel: PermissionLevel) => {
    setPermissionLevel(nextPermissionLevel);

    const nextPath = getPathForPermissionLevel(
      location.pathname,
      nextPermissionLevel,
      user?.account_type,
    );
    const currentPathWithQuery = `${location.pathname}${location.search}${location.hash}`;

    if (nextPath !== currentPathWithQuery) {
      navigate(nextPath, { replace: true });
    }
  };

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <div className="flex min-h-screen bg-background">
        <SideMenu
          activeTab={activeTab}
          collapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed((current) => !current)}
          setActiveTab={handleSetActiveTab}
          permissionLevel={permissionLevel}
          setPermissionLevel={handleSetPermissionLevel}
        />
        <GlobalStatusProvider>
          <div className="flex min-w-0 flex-1 flex-col">
            <AppNavbar
              activeTab={activeTab}
              setActiveTab={handleSetActiveTab}
              permissionLevel={permissionLevel}
              setPermissionLevel={handleSetPermissionLevel}
            />
            <main className="min-w-0 flex-1 overflow-auto">
              <div className="mx-auto flex w-full max-w-[1700px] flex-col items-center gap-2 px-4 pb-5 pt-20 md:px-6 md:pt-0">
                <Header
                  permissionLevel={permissionLevel}
                  setPermissionLevel={handleSetPermissionLevel}
                />
                <div className="w-full">
                  <Suspense fallback={<LazyViewFallback />}>
                    <Outlet />
                  </Suspense>
                </div>
              </div>
            </main>
          </div>
        </GlobalStatusProvider>
      </div>
    </AppTheme>
  );
}
