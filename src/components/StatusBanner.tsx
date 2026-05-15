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
      'border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/12 dark:text-emerald-300',
    icon: CheckCircle2,
  },
  info: {
    container:
      'border-sky-500/35 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/12 dark:text-sky-300',
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
