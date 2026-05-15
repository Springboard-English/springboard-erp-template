import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext';

interface AccountPanelProps {
  className?: string;
  collapsed?: boolean;
}

function formatAccountType(accountType?: string) {
  if (!accountType) {
    return '';
  }

  return accountType.charAt(0).toUpperCase() + accountType.slice(1);
}

export default function AccountPanel({
  className,
  collapsed = false,
}: AccountPanelProps) {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : '?';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Card
      className={cn(
        'rounded-2xl border-border/70 bg-card/85 py-0 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.45)] backdrop-blur',
        collapsed && 'rounded-xl',
        className,
      )}
    >
      <CardContent className={cn('space-y-4 px-4 py-4', collapsed && 'px-3 py-3')}>
        {collapsed ? (
          <div className="flex justify-center">
            <div
              className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold tracking-tight"
              title={user ? `${user.name} · ${formatAccountType(user.account_type)}` : 'Logging in...'}
              aria-label={user ? `${user.name} · ${formatAccountType(user.account_type)}` : 'Logging in...'}
            >
              {userInitials}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-tight">
              {user
                ? `${user.name} · ${formatAccountType(user.account_type)}`
                : 'Logging in...'}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.username}
            </p>
          </div>
        )}

        <Separator />

        <Button
          variant="outline"
          size={collapsed ? 'icon' : 'sm'}
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={collapsed ? 'Logout' : undefined}
          aria-label={collapsed ? 'Logout' : undefined}
          className={cn(
            collapsed ? 'mx-auto flex size-9 justify-center' : 'w-full justify-start gap-2',
          )}
        >
          <LogOut className="size-4" />
          <span className={collapsed ? 'sr-only' : undefined}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
