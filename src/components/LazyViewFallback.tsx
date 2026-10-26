import { useLayoutEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

import { holdBootScreen, isBootScreenShowing } from '@/boot/bootScreen';
import { cn } from '@/lib/utils';

export interface LazyViewFallbackProps {
  /** Fill the viewport, for a fallback that stands in for a whole page. */
  fullScreen?: boolean;
  /** What a screen reader announces while the spinner shows. */
  label?: string;
}

/**
 * The one "still loading" state: a centred spinner. While the boot screen is
 * up it also holds it, so a lazy chunk or an auth check that outlasts boot.js's
 * failsafe keeps the boot card on screen instead of fading it onto a spinner.
 */
export default function LazyViewFallback({
  fullScreen = false,
  label = 'Loading',
}: LazyViewFallbackProps) {
  // Only a boot screen still on screen is held; one already leaving keeps going.
  useLayoutEffect(() => (isBootScreenShowing() ? holdBootScreen() : undefined), []);

  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'flex w-full items-center justify-center',
        fullScreen ? 'min-h-dvh bg-background' : 'min-h-[240px]',
      )}
    >
      <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
    </div>
  );
}
