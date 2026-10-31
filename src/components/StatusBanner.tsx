import type { ComponentType, ReactNode } from 'react';
import { CheckCircle2, CircleAlert, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusVariant = 'error' | 'success' | 'info';

interface StatusBannerProps {
  children: ReactNode;
  className?: string;
  variant?: StatusVariant;
}

const STATUS_STYLES: Record<
  StatusVariant,
  { container: string; icon: ComponentType<{ className?: string }> }
> = {
  error: {
    container:
      'border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/12',
    icon: CircleAlert,
  },
  success: {
    container:
      'border-success/35 bg-success-bg text-success',
    icon: CheckCircle2,
  },
  info: {
    container:
      'border-info/35 bg-info-bg text-info',
    icon: Info,
  },
};

export default function StatusBanner({
  children,
  className,
  variant = 'info',
}: StatusBannerProps) {
  const { container, icon: Icon } = STATUS_STYLES[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-xl border px-3 py-2 text-sm',
        container,
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
